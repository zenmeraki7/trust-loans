import { createClient, type RedisClientType } from "redis";
import { safeErrorType } from "../utils/safeLogging.js";

let client: RedisClientType | undefined;
let connection: Promise<RedisClientType> | undefined;

export function getRedisClient(): Promise<RedisClientType> {
  if (client?.isReady) return Promise.resolve(client);
  if (connection) return connection;

  const url = process.env.REDIS_URL;
  if (!url) return Promise.reject(new Error("REDIS_URL is required for authentication rate limiting."));

  client = createClient({ url });
  client.on("error", (error) => console.error("SECURITY_ALERT", {
    schemaVersion: 1,
    occurredAt: new Date().toISOString(),
    type: "RATE_LIMITER_OR_REDIS_FAILURE",
    severity: "CRITICAL",
    reasonCode: safeErrorType(error),
  }));
  connection = client.connect().then(() => client!).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}
