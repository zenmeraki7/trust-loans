import "dotenv/config";

function parseOrigins(value: string) {
  return value
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin,
  corsOrigins: parseOrigins(corsOrigin),
};
