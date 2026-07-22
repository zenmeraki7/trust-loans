import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import { deliverAuthEmail } from "./auth.delivery.js";
import { normalizeEmail } from "./auth.email.js";
import { verifyLoginChallenge } from "./auth.challenge.js";
import {
  DUMMY_PASSWORD_HASH,
  createOpaqueToken,
  createSecureToken,
  hashIpAddress,
  hashOpaqueToken,
  hashPassword,
  hashVerificationToken,
  verifyPassword,
} from "./auth.crypto.js";
import { InvalidCredentialsError } from "./auth.errors.js";
import { writeAuthAuditEvent } from "./auth.audit.js";
import {
  clearLoginFailures,
  enforcePasswordResetConfirmationRateLimit,
  enforceReauthenticationRateLimit,
  enforceSignupRateLimit,
  getLoginProtection,
  passwordResetIsRestricted,
  recordLoginFailure,
} from "./auth.rate-limit.js";
import type { ChangePasswordInput, ForgotPasswordInput, LoginInput, ReauthenticateInput, ResetPasswordInput, SignupInput, TokenInput } from "./auth.validators.js";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const VERIFICATION_TTL_MS = 30 * 60 * 1000;
const RESET_TTL_MS = 15 * 60 * 1000;
const RECENT_REAUTHENTICATION_MS = 10 * 60 * 1000;
export type SessionContext = {
  requestId?: string;
  ip?: string;
  userAgent?: string;
  currentSessionToken?: string;
  botChallengeToken?: string;
};

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  emailVerified: true,
  emailVerifiedAt: true,
} as const;

const invalidLoginError = (challengeRequired = false) => new InvalidCredentialsError(challengeRequired);
const invalidVerificationTokenError = () => new AppError("Email verification link is invalid or expired.", 400);
const invalidPasswordResetTokenError = () => new AppError("Password reset link is invalid or expired.", 400);
const publicMessage = "If an account exists for this email, an email will be sent with the next step.";
const passwordResetMessage = "If an account exists, password-reset instructions will be sent.";
const signupMessage = "If the address can be registered, verification instructions will be sent.";
const actionUrl = (path: string) => `${env.publicAppOrigin}${path}`;

async function createSession(
  user: { id: string; sessionVersion: number },
  context: SessionContext,
  options: { reauthenticatedAt?: Date } = {},
) {
  const rawSessionToken = createOpaqueToken();
  const tokenHash = hashOpaqueToken(rawSessionToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const sessionId = randomUUID();
  const create = prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash,
      sessionVersion: user.sessionVersion,
      expiresAt,
      reauthenticatedAt: options.reauthenticatedAt ?? null,
      ipHash: hashIpAddress(context.ip),
      userAgent: context.userAgent?.slice(0, 500) || null,
    },
  });
  if (context.currentSessionToken) {
    await prisma.$transaction([
      prisma.session.updateMany({
        where: { tokenHash: hashOpaqueToken(context.currentSessionToken), revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      create,
    ]);
  } else {
    await create;
  }
  if (context.currentSessionToken) {
    await writeAuthAuditEvent({
      event: "SESSION_REVOKED",
      userId: user.id,
      outcome: "REVOKED",
      reasonCode: "SESSION_ROTATED",
      context,
    });
  }
  await writeAuthAuditEvent({
    event: "SESSION_CREATED",
    userId: user.id,
    sessionId,
    outcome: "SUCCEEDED",
    reasonCode: options.reauthenticatedAt ? "RECENT_AUTHENTICATION" : "AUTHENTICATION",
    context,
  });
  return { token: rawSessionToken, expiresAt: expiresAt.toISOString() };
}

const delay = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

const logLoginFailure = (reason: string, userId: string | undefined, accountIdentifier: string, context: SessionContext) =>
  writeAuthAuditEvent({ event: "LOGIN_FAILED", userId, accountIdentifier, outcome: "FAILED", reasonCode: reason, context });

const reportEmailDeliveryFailure = (type: "VERIFY_EMAIL" | "RESET_PASSWORD" | "PASSWORD_CHANGED", context: SessionContext) => {
  console.error("Authentication email delivery failed.", {
    type,
    requestId: context.requestId ?? "BACKGROUND_TASK",
  });
};

export async function invalidateSessionsForSecurityChange(userId: string) {
  const now = new Date();
  await prisma.$transaction([
    prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } }),
    prisma.user.update({ where: { id: userId }, data: { sessionVersion: { increment: 1 } } }),
  ]);
}

async function createEmailVerification(userId: string, email: string, context: SessionContext) {
  const { rawToken, tokenHash } = createSecureToken();
  await prisma.$transaction([
    prisma.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS) },
    }),
  ]);
  const path = `/verify-email?token=${encodeURIComponent(rawToken)}`;
  void deliverAuthEmail({ type: "verify_email", to: email, actionUrl: actionUrl(path) })
    .catch(() => reportEmailDeliveryFailure("VERIFY_EMAIL", context));
}

export const authService = {
  async signup(input: SignupInput, context: SessionContext) {
    await enforceSignupRateLimit(context.ip);
    const email = input.email.trim();
    const normalizedEmail = normalizeEmail(input.email);
    const passwordHash = await hashPassword(input.password);
    const { rawToken, tokenHash } = createSecureToken();
    const now = new Date();

    let user: { id: string; email: string };
    try {
      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            normalizedEmail,
            name: input.name || null,
            passwordHash,
            passwordSalt: null,
            passwordUpdatedAt: now,
            passwordChangedAt: now,
            status: "PENDING_VERIFICATION",
            emailVerified: false,
          },
          select: { id: true, email: true },
        });
        await tx.emailVerificationToken.create({
          data: { userId: created.id, tokenHash, expiresAt: new Date(now.getTime() + VERIFICATION_TTL_MS) },
        });
        return created;
      });
    } catch (error: unknown) {
      if ((error as { code?: string }).code === "P2002") {
        return { message: signupMessage };
      }
      throw error;
    }

    const path = `/verify-email?token=${encodeURIComponent(rawToken)}`;
    void deliverAuthEmail({ type: "verify_email", to: user.email, actionUrl: actionUrl(path) })
      .catch(() => reportEmailDeliveryFailure("VERIFY_EMAIL", context));
    return { message: signupMessage };
  },

  async resendVerification(input: ForgotPasswordInput, context: SessionContext) {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await prisma.user.findUnique({
      where: { normalizedEmail },
      select: { id: true, email: true, emailVerifiedAt: true, status: true },
    });
    if (user && !user.emailVerifiedAt && user.status === "PENDING_VERIFICATION") {
      await createEmailVerification(user.id, user.email, context);
    }
    return { message: publicMessage };
  },

  async verifyEmail(input: TokenInput, context: SessionContext) {
    const tokenHash = hashVerificationToken(input.token);
    const user = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const record = await tx.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: { select: { status: true } } },
      });
      if (!record || record.usedAt || record.expiresAt <= now) {
        throw invalidVerificationTokenError();
      }
      if (["SUSPENDED", "DISABLED", "REVOKED"].includes(record.user.status)) {
        throw new AppError("Account is not available.", 403);
      }

      const consumed = await tx.emailVerificationToken.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) throw invalidVerificationTokenError();

      await tx.emailVerificationToken.updateMany({
        where: { userId: record.userId, id: { not: record.id }, usedAt: null },
        data: { usedAt: now },
      });

      const activated = await tx.user.updateMany({
        where: { id: record.userId, status: { in: ["PENDING_VERIFICATION", "PENDING"] } },
        data: { emailVerified: true, emailVerifiedAt: now, status: "ACTIVE", failedLoginCount: 0, lockedUntil: null },
      });
      if (activated.count !== 1) throw new AppError("Account is not available.", 403);

      return tx.user.findUniqueOrThrow({
        where: { id: record.userId },
        select: { ...publicUserSelect, sessionVersion: true },
      });
    });
    await writeAuthAuditEvent({ event: "EMAIL_VERIFIED", userId: user.id, outcome: "SUCCEEDED", reasonCode: "TOKEN_CONSUMED", context });
    const session = await createSession(user, context);
    const { sessionVersion: _sessionVersion, ...publicUser } = user;
    return { ...session, user: publicUser };
  },

  async forgotPassword(input: ForgotPasswordInput, context: SessionContext) {
    const normalizedEmail = normalizeEmail(input.email);
    if (await passwordResetIsRestricted(context.ip, normalizedEmail)) {
      await writeAuthAuditEvent({ event: "PASSWORD_RESET_REQUESTED", outcome: "ACCEPTED", reasonCode: "RATE_LIMITED_GENERIC_RESPONSE", context });
      return { message: passwordResetMessage };
    }
    const user = await prisma.user.findUnique({
      where: { normalizedEmail },
      select: { id: true, email: true, emailVerifiedAt: true, status: true },
    });
    if (user?.emailVerifiedAt && user.status === "ACTIVE") {
      const { rawToken, tokenHash } = createSecureToken();
      const now = new Date();
      await prisma.$transaction([
        prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: now } }),
        prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash, expiresAt: new Date(now.getTime() + RESET_TTL_MS) },
        }),
      ]);
      const path = `/reset-password?token=${encodeURIComponent(rawToken)}`;
      void deliverAuthEmail({ type: "reset_password", to: user.email, actionUrl: actionUrl(path) })
        .catch(() => reportEmailDeliveryFailure("RESET_PASSWORD", context));
    }
    await writeAuthAuditEvent({
      event: "PASSWORD_RESET_REQUESTED",
      userId: user?.emailVerifiedAt && user.status === "ACTIVE" ? user.id : undefined,
      outcome: "ACCEPTED",
      reasonCode: user?.emailVerifiedAt && user.status === "ACTIVE" ? "ELIGIBLE_ACCOUNT" : "GENERIC_RESPONSE",
      context,
    });
    return { message: passwordResetMessage };
  },

  async resetPassword(input: ResetPasswordInput, context: SessionContext) {
    await enforcePasswordResetConfirmationRateLimit(context.ip);
    const now = new Date();
    const passwordHash = await hashPassword(input.password);
    const user = await prisma.$transaction(async (tx) => {
      const tokenHashes = [hashVerificationToken(input.token), hashOpaqueToken(input.token)];
      const record = await tx.passwordResetToken.findFirst({
        where: { tokenHash: { in: tokenHashes } },
        select: {
          id: true,
          userId: true,
          usedAt: true,
          expiresAt: true,
          user: { select: { status: true, emailVerifiedAt: true } },
        },
      });
      if (!record || record.usedAt || record.expiresAt <= now || record.user.status !== "ACTIVE" || !record.user.emailVerifiedAt) {
        throw invalidPasswordResetTokenError();
      }

      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) throw invalidPasswordResetTokenError();

      const updated = await tx.user.updateMany({
        where: { id: record.userId, status: "ACTIVE", emailVerifiedAt: { not: null } },
        data: {
          passwordHash,
          passwordSalt: null,
          passwordUpdatedAt: now,
          passwordChangedAt: now,
          sessionVersion: { increment: 1 },
          failedLoginCount: 0,
          lockedUntil: null,
        },
      });
      if (updated.count !== 1) throw invalidPasswordResetTokenError();

      await tx.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: now } });
      await tx.passwordResetToken.updateMany({ where: { userId: record.userId, usedAt: null }, data: { usedAt: now } });

      return tx.user.findUniqueOrThrow({
        where: { id: record.userId },
        select: { ...publicUserSelect, sessionVersion: true },
      });
    });
    await writeAuthAuditEvent({ event: "PASSWORD_RESET_COMPLETED", userId: user.id, outcome: "SUCCEEDED", reasonCode: "TOKEN_CONSUMED", context });
    await writeAuthAuditEvent({ event: "ALL_SESSIONS_REVOKED", userId: user.id, outcome: "REVOKED", reasonCode: "PASSWORD_RESET", context });
    const session = await createSession(user, { ...context, currentSessionToken: undefined }, { reauthenticatedAt: now });
    const { sessionVersion: _sessionVersion, ...publicUser } = user;
    return { ...session, user: publicUser };
  },

  async login(input: LoginInput, context: SessionContext) {
    const normalizedEmail = normalizeEmail(input.email);
    const protection = await getLoginProtection(context.ip, normalizedEmail);
    if (protection.restricted) {
      await logLoginFailure("rate_limited", undefined, normalizedEmail, context);
      throw invalidLoginError();
    }
    if (protection.challengeRequired && !(await verifyLoginChallenge(context.botChallengeToken, context.ip))) {
      await logLoginFailure("bot_challenge_required", undefined, normalizedEmail, context);
      throw invalidLoginError(true);
    }

    const user = await prisma.user.findUnique({
      where: { normalizedEmail },
      select: { ...publicUserSelect, passwordHash: true, passwordSalt: true, sessionVersion: true, failedLoginCount: true, lockedUntil: true },
    });
    const hashToVerify = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const passwordValid = await verifyPassword(input.password, hashToVerify, user?.passwordSalt);
    const temporarilyRestricted = Boolean(user?.lockedUntil && user.lockedUntil > new Date());
    const failureReason = !user
      ? "user_not_found"
      : !passwordValid || !user.passwordHash
        ? "password_mismatch"
        : temporarilyRestricted
          ? "account_temporarily_restricted"
          : user.status !== "ACTIVE"
            ? `account_${user.status.toLowerCase()}`
            : !user.emailVerifiedAt
              ? "email_unverified"
              : null;

    if (failureReason) {
      const failureProtection = await recordLoginFailure(normalizedEmail);
      if (user && (!passwordValid || !user.passwordHash)) {
        await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: { increment: 1 } } });
      }
      await logLoginFailure(failureReason, user?.id, normalizedEmail, context);
      if (failureProtection.delayMs) await delay(failureProtection.delayMs);
      throw invalidLoginError(failureProtection.challengeRequired);
    }

    if (!user || !user.passwordHash) throw invalidLoginError();

    const upgradedPasswordHash = hashToVerify.startsWith("$argon2") ? undefined : await hashPassword(input.password);
    await clearLoginFailures(normalizedEmail);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        ...(upgradedPasswordHash ? { passwordHash: upgradedPasswordHash, passwordSalt: null, passwordUpdatedAt: new Date() } : {}),
      },
    });
    const session = await createSession(user, context, { reauthenticatedAt: new Date() });
    await writeAuthAuditEvent({ event: "LOGIN_SUCCEEDED", userId: user.id, trustedRole: user.role, outcome: "SUCCEEDED", reasonCode: "CREDENTIALS_VERIFIED", context });
    const { passwordHash: _hash, passwordSalt: _salt, sessionVersion: _version, failedLoginCount: _failed, lockedUntil: _locked, ...publicUser } = user;
    return { ...session, user: publicUser };
  },

  async reauthenticate(userId: string, sessionId: string, input: ReauthenticateInput, context: SessionContext) {
    await enforceReauthenticationRateLimit(context.ip, userId);
    const account = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true, passwordHash: true, passwordSalt: true, sessionVersion: true },
    });
    if (!account?.passwordHash || account.status !== "ACTIVE" || !(await verifyPassword(input.password, account.passwordHash, account.passwordSalt))) {
      throw new AppError("Current password is incorrect.", 400);
    }

    const now = new Date();
    const updated = await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
        sessionVersion: account.sessionVersion,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: { reauthenticatedAt: now },
    });
    if (updated.count !== 1) throw new AppError("Session is no longer valid.", 401);
    return {
      message: "Recent authentication confirmed.",
      reauthenticatedUntil: new Date(now.getTime() + RECENT_REAUTHENTICATION_MS).toISOString(),
    };
  },

  async changePassword(userId: string, sessionId: string, input: ChangePasswordInput, context: SessionContext) {
    const now = new Date();
    const reauthenticationCutoff = new Date(now.getTime() - RECENT_REAUTHENTICATION_MS);
    const account = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, status: true, passwordHash: true, passwordSalt: true, sessionVersion: true },
    });
    const recentSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { gt: now },
        reauthenticatedAt: { gte: reauthenticationCutoff },
      },
      select: { sessionVersion: true },
    });
    if (!account || !recentSession || recentSession.sessionVersion !== account.sessionVersion) {
      throw new AppError("Recent authentication is required before changing your password.", 403, { code: "RECENT_REAUTHENTICATION_REQUIRED" });
    }
    if (!account?.passwordHash || account.status !== "ACTIVE" || !(await verifyPassword(input.currentPassword, account.passwordHash, account.passwordSalt))) {
      throw new AppError("Current password is incorrect.", 400);
    }
    if (await verifyPassword(input.newPassword, account.passwordHash, account.passwordSalt)) {
      throw new AppError("Choose a password you have not just used.", 400);
    }

    const passwordHash = await hashPassword(input.newPassword);
    const user = await prisma.$transaction(async (tx) => {
      const session = await tx.session.findFirst({
        where: {
          id: sessionId,
          userId,
          revokedAt: null,
          expiresAt: { gt: now },
          reauthenticatedAt: { gte: reauthenticationCutoff },
        },
        select: { sessionVersion: true },
      });
      if (!session || session.sessionVersion !== account.sessionVersion) {
        throw new AppError("Recent authentication is required before changing your password.", 403, { code: "RECENT_REAUTHENTICATION_REQUIRED" });
      }

      await tx.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } });
      const updated = await tx.user.updateMany({
        where: { id: userId, status: "ACTIVE", sessionVersion: account.sessionVersion, passwordHash: account.passwordHash },
        data: {
          passwordHash,
          passwordSalt: null,
          passwordUpdatedAt: now,
          passwordChangedAt: now,
          sessionVersion: { increment: 1 },
          failedLoginCount: 0,
          lockedUntil: null,
        },
      });
      if (updated.count !== 1) throw new AppError("Account changed during password update. Please try again.", 409);
      return tx.user.findUniqueOrThrow({ where: { id: userId }, select: { ...publicUserSelect, sessionVersion: true } });
    });
    const session = await createSession(user, { ...context, currentSessionToken: undefined }, { reauthenticatedAt: now });
    await writeAuthAuditEvent({ event: "ALL_SESSIONS_REVOKED", userId, outcome: "REVOKED", reasonCode: "PASSWORD_CHANGE", context });
    await writeAuthAuditEvent({ event: "PASSWORD_CHANGED", userId, outcome: "SUCCEEDED", reasonCode: "CURRENT_PASSWORD_VERIFIED", context });
    void deliverAuthEmail({
      type: "password_changed",
      to: user.email,
      actionUrl: actionUrl("/account-recovery"),
      occurredAt: now.toISOString(),
    }).catch(() => reportEmailDeliveryFailure("PASSWORD_CHANGED", context));
    const { sessionVersion: _sessionVersion, ...publicUser } = user;
    return { ...session, user: publicUser };
  },

  async invalidateSessionsForSecurityChange(userId: string) {
    await invalidateSessionsForSecurityChange(userId);
  },

  async logout(token: string | undefined, userId: string | undefined, sessionId: string | undefined, context: SessionContext) {
    if (token) {
      await prisma.session.updateMany({ where: { tokenHash: hashOpaqueToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
      await writeAuthAuditEvent({ event: "SESSION_REVOKED", userId, sessionId, outcome: "REVOKED", reasonCode: "USER_LOGOUT", context });
    }
  },

  async logoutAll(userId: string, context: SessionContext) {
    await invalidateSessionsForSecurityChange(userId);
    await writeAuthAuditEvent({ event: "ALL_SESSIONS_REVOKED", userId, outcome: "REVOKED", reasonCode: "USER_REQUEST", context });
  },

  async getSessionUser(userId: string) {
    return prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  },
};
