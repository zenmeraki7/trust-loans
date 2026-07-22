import { randomUUID } from "node:crypto";
import { safeErrorType } from "../../utils/safeLogging.js";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResult = {
  success?: boolean;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyLoginChallenge(token: string | undefined, ip: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token || token.length > 2_048) return false;

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip, idempotency_key: randomUUID() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return false;
    const result = await response.json() as TurnstileResult;
    return result.success === true && result.action === "login";
  } catch (error) {
    console.error("Turnstile validation failed.", { errorType: safeErrorType(error) });
    return false;
  }
}
