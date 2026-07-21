import "dotenv/config";

function parseOrigins(value: string) {
  return value
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

function parsePublicAppOrigin() {
  const configured = process.env.PUBLIC_APP_ORIGIN;
  if (!configured && process.env.NODE_ENV === "production") {
    throw new Error("PUBLIC_APP_ORIGIN must be configured in production.");
  }

  const origin = new URL(configured ?? "http://localhost:3000");
  if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("PUBLIC_APP_ORIGIN must be an HTTP(S) origin without credentials, path, query, or fragment.");
  }
  return origin.origin;
}

function optionalHttpsUrl(value: string | undefined, name: string) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error(`${name} must be an HTTPS URL without embedded credentials.`);
  return url.toString();
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin,
  corsOrigins: parseOrigins(corsOrigin),
  publicAppOrigin: parsePublicAppOrigin(),
  trustProxy: process.env.TRUST_PROXY === "true",
  cspEnforce: process.env.CSP_ENFORCE === "true",
  securityEventSinkUrl: optionalHttpsUrl(process.env.SECURITY_EVENT_SINK_URL, "SECURITY_EVENT_SINK_URL"),
};
