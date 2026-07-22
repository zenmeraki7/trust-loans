import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { safeImageUrl, safeNavigationUrl, sanitizeApiPayload } from "./publicContent.js";
import PlainText from "../components/security/PlainText.js";

const storedPayload = `<img src=x onerror=alert(1)><script>alert(document.cookie)</script>`;

test("stored public text is contextually encoded by React", () => {
  const html = renderToStaticMarkup(createElement("p", null, storedPayload));
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("onerror="), true);
  assert.equal(html.includes("&lt;img"), true);
});

test("PlainText preserves multiline content without interpreting HTML or Markdown", () => {
  const value = `# Not a heading\n${storedPayload}\n[not a link](javascript:alert(1))`;
  const html = renderToStaticMarkup(createElement(PlainText, { as: "pre", value }));
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("<img"), false);
  assert.equal(html.includes("<a "), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
  assert.equal(html.includes("# Not a heading"), true);
});

test("stored URL payloads are denied while plain text remains unchanged", () => {
  const sanitized = sanitizeApiPayload({
    companyDescription: storedPayload,
    officialWebsite: "javascript:alert(1)",
    logoUrl: "data:image/svg+xml,<svg onload=alert(1)>",
    verificationUrl: "javascript:alert(2)",
    profileUrl: "/entities/example",
    sourceUrls: ["https://rbi.org.in/source", "vbscript:msgbox(1)"],
  });
  assert.equal(sanitized.companyDescription, storedPayload);
  assert.equal(sanitized.officialWebsite, "");
  assert.equal(sanitized.logoUrl, "");
  assert.equal(sanitized.verificationUrl, "");
  assert.equal(sanitized.profileUrl, "/entities/example");
  assert.deepEqual(sanitized.sourceUrls, ["https://rbi.org.in/source"]);
});

test("navigation and image URL policies reject executable protocols and credentials", () => {
  for (const payload of ["javascript:alert(1)", "data:text/html,x", "vbscript:x", "//evil.example/x", "https://user:pass@example.com/x"]) {
    assert.equal(safeNavigationUrl(payload), null, payload);
    assert.equal(safeImageUrl(payload), null, payload);
  }
  assert.equal(safeNavigationUrl("/loan-apps/example"), "/loan-apps/example");
  assert.equal(safeImageUrl("https://cdn.example/logo.png"), "https://cdn.example/logo.png");
  assert.equal(safeImageUrl("data:image/png;base64,iVBORw0KGgo="), "data:image/png;base64,iVBORw0KGgo=");
  assert.equal(safeImageUrl("data:image/svg+xml;base64,PHN2Zy8+"), null);
});

test("React sources contain no raw HTML injection sink", async () => {
  const forbiddenSink = ["dangerously", "SetInnerHTML"].join("");
  const files = await sourceFiles(path.resolve(process.cwd(), "src"));
  for (const file of files.filter((name) => !name.endsWith(".test.ts"))) {
    assert.equal((await readFile(file, "utf8")).includes(forbiddenSink), false, file);
  }
});

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}
