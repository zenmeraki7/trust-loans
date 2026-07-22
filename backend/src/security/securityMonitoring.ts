import { createHash, createHmac, randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { getRedisClient } from "../infrastructure/redis.client.js";
import { safeErrorType } from "../utils/safeLogging.js";

export type SecurityAlertType =
  | "FAILED_LOGINS_MANY_ACCOUNTS"
  | "ACCOUNT_ATTACKED_MANY_NETWORKS"
  | "CROSS_USER_RESOURCE_ID_PROBING"
  | "REPEATED_AUTHORIZATION_FAILURES"
  | "SUSPICIOUS_REDIRECT_ATTEMPT"
  | "LARGE_EXPORT"
  | "SUDDEN_COMPANY_PROFILE_MODIFICATIONS"
  | "ROLE_CHANGE"
  | "PRODUCTION_CONFIGURATION_CHANGE"
  | "RATE_LIMITER_OR_REDIS_FAILURE"
  | "ABNORMAL_DATABASE_READS"
  | "ADMIN_LOGIN_NEW_ENVIRONMENT";

type AlertInput = {
  type: SecurityAlertType;
  severity: "MEDIUM" | "HIGH" | "CRITICAL";
  requestId?: string;
  actorId?: string;
  reasonCode: string;
  attributes?: Record<string, string | number | boolean | undefined>;
};

const PREFIX = process.env.REDIS_KEY_PREFIX?.replace(/:+$/, "") || "borrowscope:prod";
const WINDOW_SECONDS = 15 * 60;

function fingerprint(kind: string, value: string) {
  return createHmac("sha256", process.env.AUTH_SECRET || "development-monitoring-key")
    .update(`${kind}:${value}`)
    .digest("base64url");
}

async function publishAlert(alert: AlertInput) {
  const event = {
    schemaVersion: 1,
    eventId: randomUUID(),
    occurredAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    ...alert,
  };

  // Structured stderr is intentionally separate from the application DB and
  // can be collected by the platform log drain even if the DB is unavailable.
  console.error("SECURITY_ALERT", event);

  if (!env.securityEventSinkUrl) return;
  try {
    await fetch(env.securityEventSinkUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.SECURITY_EVENT_SINK_TOKEN
          ? { authorization: `Bearer ${process.env.SECURITY_EVENT_SINK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3_000),
    });
  } catch (error) {
    console.error("SECURITY_ALERT_DELIVERY_FAILED", {
      eventId: event.eventId,
      errorType: safeErrorType(error),
    });
  }
}

async function count(key: string, ttlSeconds: number) {
  const redis = await getRedisClient();
  const result = await redis.multi().incr(key).expire(key, ttlSeconds, "NX").exec();
  return Number(result[0]);
}

async function uniqueCount(key: string, member: string, ttlSeconds: number) {
  const redis = await getRedisClient();
  const result = await redis.multi().sAdd(key, member).expire(key, ttlSeconds, "NX").sCard(key).exec();
  return Number(result[2]);
}

async function safelyObserve(work: () => Promise<void>) {
  try {
    await work();
  } catch (error) {
    await publishAlert({
      type: "RATE_LIMITER_OR_REDIS_FAILURE",
      severity: "CRITICAL",
      reasonCode: safeErrorType(error),
    });
  }
}

export function observeLoginFailure(input: { accountKey: string; ip: string; requestId?: string }) {
  return safelyObserve(async () => {
    const ipKey = fingerprint("ip", input.ip);
    const accountKey = fingerprint("account", input.accountKey);
    const [accounts, networks] = await Promise.all([
      uniqueCount(`${PREFIX}:monitor:login:ip:${ipKey}:accounts`, accountKey, WINDOW_SECONDS),
      uniqueCount(`${PREFIX}:monitor:login:account:${accountKey}:networks`, ipKey, WINDOW_SECONDS),
    ]);
    if (accounts === 5) await publishAlert({ type: "FAILED_LOGINS_MANY_ACCOUNTS", severity: "HIGH", requestId: input.requestId, reasonCode: "FIVE_ACCOUNTS_FROM_ONE_NETWORK", attributes: { uniqueAccounts: accounts } });
    if (networks === 4) await publishAlert({ type: "ACCOUNT_ATTACKED_MANY_NETWORKS", severity: "HIGH", requestId: input.requestId, reasonCode: "FOUR_NETWORKS_FOR_ONE_ACCOUNT", attributes: { uniqueNetworks: networks } });
  });
}

export function observeAdminLogin(input: { userId: string; role: UserRole; ip: string; userAgent: string; requestId?: string }) {
  if (input.role !== UserRole.ADMIN && input.role !== UserRole.SUPER_ADMIN) return Promise.resolve();
  return safelyObserve(async () => {
    const environment = fingerprint("admin-environment", `${input.ip}|${input.userAgent.slice(0, 200)}`);
    const key = `${PREFIX}:monitor:admin:${fingerprint("user", input.userId)}:environments`;
    const redis = await getRedisClient();
    const known = await redis.sIsMember(key, environment);
    if (!known) {
      await redis.sAdd(key, environment);
      await redis.expire(key, 180 * 24 * 60 * 60);
      await publishAlert({ type: "ADMIN_LOGIN_NEW_ENVIRONMENT", severity: "HIGH", actorId: input.userId, requestId: input.requestId, reasonCode: "UNSEEN_NETWORK_AND_CLIENT" });
    }
  });
}

export function observeCompanyModification(input: { actorId: string; companyId: string; requestId?: string }) {
  return safelyObserve(async () => {
    const changes = await count(`${PREFIX}:monitor:company:${fingerprint("company", input.companyId)}:changes`, 10 * 60);
    if (changes === 4) await publishAlert({ type: "SUDDEN_COMPANY_PROFILE_MODIFICATIONS", severity: "HIGH", actorId: input.actorId, requestId: input.requestId, reasonCode: "FOUR_CHANGES_IN_TEN_MINUTES", attributes: { changes } });
  });
}

export function emitSecurityAlert(input: AlertInput) {
  return publishAlert(input);
}

export function observeSuspiciousRedirect(input: { actorId?: string; requestId?: string; reasonCode: string }) {
  return publishAlert({ type: "SUSPICIOUS_REDIRECT_ATTEMPT", severity: "HIGH", ...input });
}

export function observeLargeExport(input: { actorId: string; requestId?: string; recordCount: number; byteCount?: number }) {
  if (input.recordCount < 1_000 && (input.byteCount ?? 0) < 5 * 1024 * 1024) return Promise.resolve();
  return publishAlert({ type: "LARGE_EXPORT", severity: "HIGH", actorId: input.actorId, requestId: input.requestId, reasonCode: "EXPORT_THRESHOLD_EXCEEDED", attributes: { recordCount: input.recordCount, byteCount: input.byteCount } });
}

export function observeDatabaseRead(input: { actorId: string; requestId?: string; resourceType: string; rowCount: number }) {
  return safelyObserve(async () => {
    const key = `${PREFIX}:monitor:db-read:${fingerprint("user", input.actorId)}`;
    const redis = await getRedisClient();
    const result = await redis.multi().incrBy(key, input.rowCount).expire(key, 5 * 60, "NX").exec();
    const rows = Number(result[0]);
    if (rows >= 10_000 && rows - input.rowCount < 10_000) await publishAlert({ type: "ABNORMAL_DATABASE_READS", severity: "HIGH", actorId: input.actorId, requestId: input.requestId, reasonCode: "TEN_THOUSAND_ROWS_IN_FIVE_MINUTES", attributes: { rows, resourceType: input.resourceType } });
  });
}

export function initializeSecurityMonitoring() {
  if (process.env.NODE_ENV !== "production") return Promise.resolve();
  return safelyObserve(async () => {
    const fingerprintValue = createHash("sha256").update(JSON.stringify({
      publicAppOrigin: env.publicAppOrigin,
      corsOrigins: env.corsOrigins.slice().sort(),
      trustProxy: env.trustProxy,
      cspEnforce: env.cspEnforce,
      release: process.env.RELEASE_SHA || "unknown",
    })).digest("hex");
    const redis = await getRedisClient();
    const key = `${PREFIX}:monitor:production-config:fingerprint`;
    const previous = await redis.get(key);
    await redis.set(key, fingerprintValue);
    if (previous && previous !== fingerprintValue) await publishAlert({ type: "PRODUCTION_CONFIGURATION_CHANGE", severity: "CRITICAL", reasonCode: "SECURITY_RELEVANT_CONFIGURATION_CHANGED" });
  });
}

export const securityResponseMonitoring = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    if (![401, 403, 404].includes(res.statusCode)) return;
    void safelyObserve(async () => {
      const subject = fingerprint("subject", req.user?.id || req.ip || "unknown");
      const privateResourcePath = req.path.includes("/me/")
        || /\/notifications\/[^/]+\/read$/.test(req.path)
        || (/\/corrections\/[^/]+$/.test(req.path) && !req.path.includes("/admin/"));
      if (res.statusCode === 404 && req.user && privateResourcePath) {
        const probes = await count(`${PREFIX}:monitor:probe:${subject}`, 5 * 60);
        if (probes === 8) await publishAlert({ type: "CROSS_USER_RESOURCE_ID_PROBING", severity: "HIGH", actorId: req.user.id, requestId: req.requestId, reasonCode: "EIGHT_PRIVATE_RESOURCE_MISSES", attributes: { probes } });
        return;
      }
      if (res.statusCode === 401 || res.statusCode === 403) {
        const failures = await count(`${PREFIX}:monitor:http-auth:${subject}`, 5 * 60);
        if (failures === 10) await publishAlert({ type: "REPEATED_AUTHORIZATION_FAILURES", severity: "HIGH", actorId: req.user?.id, requestId: req.requestId, reasonCode: "TEN_401_OR_403_RESPONSES", attributes: { failures } });
      }
    });
  });
  next();
};
