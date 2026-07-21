import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const roots = ["src", "backend/src"];
const sourceExtension = /\.(?:js|jsx|ts|tsx|mdx)$/i;
const testFile = /(?:^|\.)test\.[^.]+$/i;
const forbiddenPatterns = [
  [/dangerouslySetInnerHTML/, "React raw HTML prop"],
  [/\.innerHTML\s*=/, "DOM innerHTML assignment"],
  [/\.outerHTML\s*=/, "DOM outerHTML assignment"],
  [/insertAdjacentHTML\s*\(/, "DOM HTML insertion"],
  [/document\.write\s*\(/, "document.write"],
  [/createContextualFragment\s*\(/, "contextual HTML fragment"],
  [/new\s+DOMParser\s*\(/, "DOMParser"],
  [/allowDangerousHtml\s*[:=]/, "dangerous Markdown HTML option"],
  [/rehypeRaw|rehype-raw/, "raw Markdown HTML plugin"],
];
const forbiddenPackages = [
  "@next/mdx",
  "html-react-parser",
  "markdown-it",
  "marked",
  "react-markdown",
  "rehype-raw",
  "remark-html",
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }))).flat();
}

const violations = [];
for (const root of roots) {
  for (const file of (await filesUnder(root)).filter((value) => sourceExtension.test(value) && !testFile.test(value))) {
    if (file.toLowerCase().endsWith(".mdx")) {
      violations.push(`${file}: application MDX is disabled`);
      continue;
    }
    const source = await readFile(file, "utf8");
    for (const [pattern, label] of forbiddenPatterns) {
      if (pattern.test(source)) violations.push(`${file}: ${label}`);
    }
  }
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const packages = { ...packageJson.dependencies, ...packageJson.devDependencies };
for (const dependency of forbiddenPackages) {
  if (dependency in packages) violations.push(`package.json: ${dependency} can introduce raw HTML rendering`);
}

if (violations.length > 0) {
  console.error("Raw HTML policy violations:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Raw HTML policy passed: stored content is text-only.");

