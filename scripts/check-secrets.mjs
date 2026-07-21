import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const protectedFilePatterns = [
  /^\.env$/,
  /^\.env\.local$/,
  /^\.env\.production$/,
  /\.pem$/i,
  /\.key$/i,
];

const suspiciousContentPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----/,
  /\bDATABASE_URL\s*=\s*["']?(?:postgres|mysql|mongodb):\/\/[^"'\s]+/i,
  /\b(?:AUTH_SECRET|JWT_SECRET|SESSION_SIGNING_KEY|EMAIL_API_KEY|AI_API_KEY|OPENAI_API_KEY|ENCRYPTION_KEY|CLOUD_SECRET_ACCESS_KEY)\s*=\s*["']?(?!replace-|example|your-|test-|dummy-|dev-|local-)[^"'\s]{16,}/i,
  /\b(?:aws_access_key_id|aws_secret_access_key)\s*=\s*["']?[^"'\s]{16,}/i,
];

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

const protectedTracked = trackedFiles.filter((file) => protectedFilePatterns.some((pattern) => pattern.test(file)));

const suspiciousMatches = [];
for (const file of trackedFiles) {
  if (file.includes("node_modules/") || file.includes(".next/") || file.endsWith("package-lock.json")) continue;
  let content = "";
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const pattern of suspiciousContentPatterns) {
    if (pattern.test(content)) suspiciousMatches.push(file);
  }
}

if (protectedTracked.length || suspiciousMatches.length) {
  console.error("Secret scan failed.");
  if (protectedTracked.length) console.error(`Protected secret-like files are tracked:\n${protectedTracked.join("\n")}`);
  if (suspiciousMatches.length) console.error(`Suspicious secret-like content found in:\n${Array.from(new Set(suspiciousMatches)).join("\n")}`);
  process.exit(1);
}

console.log("Secret scan passed: no protected secret files or obvious secret values are tracked.");
