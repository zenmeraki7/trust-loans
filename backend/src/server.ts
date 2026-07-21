import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeSecurityMonitoring } from "./security/securityMonitoring.js";

void initializeSecurityMonitoring();

const server = createServer({ maxHeaderSize: 16 * 1024 }, app);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;

server.listen(env.port, () => {
  console.log(`Trust Loans backend listening on port ${env.port}`);
});
