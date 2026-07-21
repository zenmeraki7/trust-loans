import { randomUUID } from "node:crypto";
import type { UserRole } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { observeAdminLogin, observeLoginFailure } from "../../security/securityMonitoring.js";
import { hashIpAddress } from "./auth.crypto.js";

export type AuthAuditEvent =
  | "LOGIN_SUCCEEDED"
  | "LOGIN_FAILED"
  | "SESSION_CREATED"
  | "SESSION_REVOKED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "EMAIL_VERIFIED"
  | "ALL_SESSIONS_REVOKED";

type AuthAuditOutcome = "SUCCEEDED" | "FAILED" | "ACCEPTED" | "REVOKED";

export type AuthAuditContext = {
  requestId?: string;
  ip?: string;
  userAgent?: string;
};

type AuthAuditInput = {
  event: AuthAuditEvent;
  userId?: string;
  sessionId?: string;
  outcome: AuthAuditOutcome;
  reasonCode: string;
  context: AuthAuditContext;
  accountIdentifier?: string;
  trustedRole?: UserRole;
};

const identifier = (value: string | undefined, fallback: string) => {
  const safe = value?.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 128);
  return safe || fallback;
};

const userAgentSummary = (value: string | undefined) => {
  if (!value) return "UNKNOWN_CLIENT";
  const browser = value.match(/Edg\/(\d+)/)?.[1]
    ? `EDGE_${value.match(/Edg\/(\d+)/)![1]}`
    : value.match(/Chrome\/(\d+)/)?.[1]
      ? `CHROME_${value.match(/Chrome\/(\d+)/)![1]}`
      : value.match(/Firefox\/(\d+)/)?.[1]
        ? `FIREFOX_${value.match(/Firefox\/(\d+)/)![1]}`
        : value.match(/Version\/(\d+).+Safari/)?.[1]
          ? `SAFARI_${value.match(/Version\/(\d+).+Safari/)![1]}`
          : "OTHER_BROWSER";
  const platform = /Android/i.test(value)
    ? "ANDROID"
    : /iPhone|iPad|iPod/i.test(value)
      ? "IOS"
      : /Windows/i.test(value)
        ? "WINDOWS"
        : /Macintosh|Mac OS X/i.test(value)
          ? "MACOS"
          : /Linux/i.test(value)
            ? "LINUX"
            : "OTHER_OS";
  return `${browser}_${platform}`;
};

export async function writeAuthAuditEvent(input: AuthAuditInput) {
  const requestId = identifier(input.context.requestId, randomUUID());
  const reasonCode = identifier(input.reasonCode.toUpperCase(), "UNSPECIFIED");
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.userId,
        action: input.event,
        targetType: "Authentication",
        targetId: input.sessionId,
        afterJson: {
          requestId,
          ipHash: hashIpAddress(input.context.ip),
          client: userAgentSummary(input.context.userAgent),
          outcome: input.outcome,
          reasonCode,
        },
      },
    });
  } catch {
    // Never print the original error: provider and database errors can contain
    // connection details, request URLs, or serialized authentication inputs.
    console.error("Authentication audit write failed.", { event: input.event, requestId });
  }

  if (input.event === "LOGIN_FAILED" && input.accountIdentifier) {
    await observeLoginFailure({
      accountKey: input.accountIdentifier,
      ip: input.context.ip ?? "unknown-client",
      requestId,
    });
  }
  if (input.event === "LOGIN_SUCCEEDED" && input.userId && input.trustedRole) {
    await observeAdminLogin({
      userId: input.userId,
      role: input.trustedRole,
      ip: input.context.ip ?? "unknown-client",
      userAgent: input.context.userAgent ?? "unknown-client",
      requestId,
    });
  }
}
