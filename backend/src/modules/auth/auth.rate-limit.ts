import { getRedisClient } from "../../infrastructure/redis.client.js";
import { AppError } from "../../utils/AppError.js";
import { hashSecurityIdentifier } from "./auth.crypto.js";

const PREFIX = "borrowscope:auth";

const fixedWindowScript = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count
`;

const failureScript = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
if count >= 4 and count < 6 then redis.call('SET', KEYS[3], '1', 'EX', ARGV[1]) end
if count >= 6 then
  redis.call('SET', KEYS[2], '1', 'EX', ARGV[2])
  redis.call('DEL', KEYS[3])
end
return count
`;

async function consumeFixedWindow(key: string, limit: number, seconds: number) {
  const redis = await getRedisClient();
  const count = Number(await redis.sendCommand(["EVAL", fixedWindowScript, "1", key, String(seconds)]));
  return count > limit;
}

const ipKey = (purpose: string, ip: string | undefined) =>
  `${PREFIX}:${purpose}:ip:${hashSecurityIdentifier("ip", ip ?? "unknown-client")}`;
const accountKey = (purpose: string, normalizedEmail: string) =>
  `${PREFIX}:${purpose}:account:${hashSecurityIdentifier("email", normalizedEmail)}`;

export async function enforceSignupRateLimit(ip: string | undefined) {
  const [hourExceeded, dayExceeded] = await Promise.all([
    consumeFixedWindow(ipKey("signup:hour", ip), 3, 60 * 60),
    consumeFixedWindow(ipKey("signup:day", ip), 10, 24 * 60 * 60),
  ]);
  if (hourExceeded || dayExceeded) throw new AppError("Too many signup attempts. Please try again later.", 429);
}

export async function getLoginProtection(ip: string | undefined, normalizedEmail: string) {
  const redis = await getRedisClient();
  const base = accountKey("login", normalizedEmail);
  const [minuteExceeded, hourExceeded, accountRestricted, challengeRequired] = await Promise.all([
    consumeFixedWindow(ipKey("login:minute", ip), 5, 60),
    consumeFixedWindow(ipKey("login:hour", ip), 30, 60 * 60),
    redis.exists(`${base}:restricted`),
    redis.exists(`${base}:challenge`),
  ]);
  const restricted = minuteExceeded || hourExceeded || accountRestricted > 0;
  return { restricted, challengeRequired: !restricted && challengeRequired > 0 };
}

export async function recordLoginFailure(normalizedEmail: string) {
  const redis = await getRedisClient();
  const base = accountKey("login", normalizedEmail);
  const count = Number(await redis.sendCommand([
    "EVAL", failureScript, "3", `${base}:failures`, `${base}:restricted`, `${base}:challenge`, String(15 * 60), String(15 * 60),
  ]));
  if (count === 4) return { delayMs: 2_000, challengeRequired: true };
  if (count === 5) return { delayMs: 5_000, challengeRequired: true };
  return { delayMs: 0, challengeRequired: false };
}

export async function clearLoginFailures(normalizedEmail: string) {
  const redis = await getRedisClient();
  const base = accountKey("login", normalizedEmail);
  await redis.del([`${base}:failures`, `${base}:restricted`, `${base}:challenge`]);
}

export async function passwordResetIsRestricted(ip: string | undefined, normalizedEmail: string) {
  const [accountExceeded, ipExceeded] = await Promise.all([
    consumeFixedWindow(accountKey("password-reset:hour", normalizedEmail), 3, 60 * 60),
    consumeFixedWindow(ipKey("password-reset:hour", ip), 5, 60 * 60),
  ]);
  return accountExceeded || ipExceeded;
}

export async function enforcePasswordResetConfirmationRateLimit(ip: string | undefined) {
  const exceeded = await consumeFixedWindow(ipKey("password-reset-confirm:15m", ip), 10, 15 * 60);
  if (exceeded) throw new AppError("Too many password reset attempts. Please request a new link later.", 429);
}

export async function enforceReauthenticationRateLimit(ip: string | undefined, userId: string) {
  const [userExceeded, ipExceeded] = await Promise.all([
    consumeFixedWindow(`${PREFIX}:reauth:user:${hashSecurityIdentifier("user", userId)}`, 5, 15 * 60),
    consumeFixedWindow(ipKey("reauth:15m", ip), 10, 15 * 60),
  ]);
  if (userExceeded || ipExceeded) throw new AppError("Too many reauthentication attempts. Please try again later.", 429);
}
