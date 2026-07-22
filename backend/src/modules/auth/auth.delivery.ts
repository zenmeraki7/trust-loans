type AuthEmail = {
  type: "verify_email" | "reset_password" | "password_changed";
  to: string;
  actionUrl: string;
  occurredAt?: string;
};

export async function deliverAuthEmail(message: AuthEmail) {
  const endpoint = process.env.EMAIL_DELIVERY_WEBHOOK_URL;
  const apiKey = process.env.EMAIL_API_KEY;

  if (!endpoint || !apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("Auth email was queued but EMAIL_DELIVERY_WEBHOOK_URL or EMAIL_API_KEY is not configured.");
    }
    return false;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Auth email provider returned ${response.status}.`);
  }
  return true;
}
