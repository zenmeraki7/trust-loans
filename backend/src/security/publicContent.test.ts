import assert from "node:assert/strict";
import test from "node:test";
import { plainTextSchema, safeHttpsUrlSchema, safePublicImageUrlSchema, sanitizePublicPayload } from "./publicContent.js";

test("public URL validation permits HTTPS only", () => {
  assert.equal(safeHttpsUrlSchema.parse("https://example.com/path?q=1"), "https://example.com/path?q=1");
  for (const payload of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "http://example.com",
    "https://user:password@example.com/private",
  ]) {
    assert.equal(safeHttpsUrlSchema.safeParse(payload).success, false, payload);
  }
});

test("image policy permits raster data only and rejects stored SVG", () => {
  assert.equal(safePublicImageUrlSchema.safeParse("data:image/png;base64,iVBORw0KGgo=").success, true);
  assert.equal(safePublicImageUrlSchema.safeParse("data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+").success, false);
});

test("legacy stored URL payloads are removed from API output", () => {
  const stored = sanitizePublicPayload({
    description: "<svg onload=alert(1)>",
    website: "javascript:alert(1)",
    logoUrl: "data:image/svg+xml,<svg onload=alert(2)>",
    resetUrl: "javascript:alert(3)",
    profileUrl: "/entities/example",
    officialDomains: ["https://example.com", "vbscript:msgbox(1)"],
  });
  assert.equal(stored.description, "<svg onload=alert(1)>");
  assert.equal(stored.website, "");
  assert.equal(stored.logoUrl, "");
  assert.equal(stored.resetUrl, "");
  assert.equal(stored.profileUrl, "/entities/example");
  assert.deepEqual(stored.officialDomains, ["https://example.com/"]);
});

test("plain text normalization rejects controls but does not interpret stored HTML", () => {
  const payload = `<img src=x onerror=alert(1)><script>alert(2)</script>`;
  assert.equal(plainTextSchema({ min: 1, max: 500 }).parse(`  ${payload}  `), payload);
  assert.equal(plainTextSchema({ max: 500 }).safeParse("safe\u0000hidden").success, false);
});
