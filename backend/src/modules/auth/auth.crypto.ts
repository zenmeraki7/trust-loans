import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { Algorithm, hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";

const KEY_LENGTH = 64;
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const HASH_PREFIX = "scrypt";
const ARGON2_OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const;
const CSRF_TOKEN_VERSION = "v1";
export const CSRF_TOKEN_TTL_MS = 60 * 60 * 1000;
const CSRF_CLOCK_SKEW_MS = 5 * 60 * 1000;

export const DUMMY_PASSWORD_HASH = "$argon2id$v=19$m=19456,t=2,p=1$JOLCQdv8hXmUh6yDfTxWsg$nramAKcwtdM/+WVQps79b+CxONrDQEUoOtD5la406ws";

const secretForHashing = () => {
  const secret = process.env.SESSION_SIGNING_KEY ?? process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SIGNING_KEY must be set to at least 32 characters in production.");
  }
  return "development-only-session-hashing-key-change-me";
};

const derive = (password: string, salt: string, n = SCRYPT_N, r = SCRYPT_R, p = SCRYPT_P) =>
  scryptSync(password, salt, KEY_LENGTH, { N: n, r, p, maxmem: 64 * 1024 * 1024 });

export const hashPassword = (password: string) => argon2Hash(password, ARGON2_OPTIONS);

export const verifyPassword = async (password: string, passwordHash: string, legacySalt?: string | null) => {
  try {
    if (passwordHash.startsWith("$argon2")) {
      return await argon2Verify(passwordHash, password);
    }

    if (passwordHash.startsWith(`${HASH_PREFIX}$`)) {
      const [prefix, nValue, rValue, pValue, salt, expectedValue] = passwordHash.split("$");
      if (prefix !== HASH_PREFIX || !salt || !expectedValue) return false;
      const expected = Buffer.from(expectedValue, "base64url");
      const actual = derive(password, salt, Number(nValue), Number(rValue), Number(pValue));
      return actual.length === expected.length && timingSafeEqual(actual, expected);
    }

    if (!legacySalt) return false;
    const expected = Buffer.from(passwordHash, "base64url");
    const actual = scryptSync(password, legacySalt, KEY_LENGTH);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
};

// Used when the email does not exist so login timing does not reveal account membership.
export const createOpaqueToken = () => randomBytes(32).toString("base64url");
export const hashOpaqueToken = (token: string) => createHash("sha256").update(token).digest("base64url");

export const createSecureToken = () => {
  const rawToken = createOpaqueToken();
  return { rawToken, tokenHash: hashVerificationToken(rawToken) };
};

export const hashVerificationToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const hashIpAddress = (ip: string | undefined) => {
  if (!ip) return null;
  return createHmac("sha256", secretForHashing()).update(ip).digest("base64url");
};

export const hashSecurityIdentifier = (kind: string, value: string) =>
  createHmac("sha256", secretForHashing()).update(`${kind}:${value}`).digest("base64url");


const signCsrfPayload = (payload: string) =>
  createHmac("sha256", secretForHashing()).update(`csrf:${payload}`).digest("base64url");

export const createCsrfToken = () => {
  const issuedAt = Date.now();
  const payload = `${CSRF_TOKEN_VERSION}.${issuedAt}.${createOpaqueToken()}`;
  return {
    token: `${payload}.${signCsrfPayload(payload)}`,
    expiresAt: new Date(issuedAt + CSRF_TOKEN_TTL_MS).toISOString(),
  };
};

export const verifyCsrfToken = (token: string) => {
  if (!token || token.length > 256) return false;
  const [version, issuedAtValue, nonce, suppliedSignature, extra] = token.split(".");
  if (extra || version !== CSRF_TOKEN_VERSION || !/^\d{13}$/.test(issuedAtValue) || !/^[A-Za-z0-9_-]{43}$/.test(nonce) || !/^[A-Za-z0-9_-]{43}$/.test(suppliedSignature)) {
    return false;
  }

  const issuedAt = Number(issuedAtValue);
  const now = Date.now();
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + CSRF_CLOCK_SKEW_MS || now - issuedAt > CSRF_TOKEN_TTL_MS) {
    return false;
  }

  const expectedSignature = signCsrfPayload(`${version}.${issuedAtValue}.${nonce}`);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
};
