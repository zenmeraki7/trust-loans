import { NextResponse } from "next/server";

const MAX_REPORT_BYTES = 16 * 1024;

function safeLocation(value: unknown) {
  if (typeof value !== "string") return undefined;
  const normalized = value.slice(0, 2048);
  if (["inline", "eval", "self"].includes(normalized)) return normalized;
  try {
    const url = new URL(normalized);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return normalized.replace(/[?#].*$/, "").slice(0, 500);
  }
}

function shortText(value: unknown, max = 160) {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

async function readBoundedBody(request: Request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_REPORT_BYTES) {
      await reader.cancel();
      throw new Error("REPORT_TOO_LARGE");
    }
    body += decoder.decode(value, { stream: true });
  }
  return body + decoder.decode();
}

export async function POST(request: Request) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (type !== "application/csp-report" && type !== "application/reports+json" && type !== "application/json") {
    return NextResponse.json({ error: "Unsupported report type" }, { status: 415 });
  }

  try {
    const parsed = JSON.parse(await readBoundedBody(request)) as Record<string, unknown> | Array<Record<string, unknown>>;
    const envelope = Array.isArray(parsed) ? parsed[0] : parsed;
    const report = (envelope?.["csp-report"] ?? envelope?.body ?? envelope) as Record<string, unknown>;
    const safeReport = {
      effectiveDirective: shortText(report?.["effective-directive"] ?? report?.effectiveDirective),
      violatedDirective: shortText(report?.["violated-directive"] ?? report?.violatedDirective),
      blockedLocation: safeLocation(report?.["blocked-uri"] ?? report?.blockedURL),
      documentLocation: safeLocation(report?.["document-uri"] ?? report?.documentURL),
      disposition: shortText(report?.disposition),
      statusCode: typeof report?.["status-code"] === "number" ? report["status-code"] : undefined,
    };
    console.warn("CSP_VIOLATION", safeReport);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const status = error instanceof Error && error.message === "REPORT_TOO_LARGE" ? 413 : 400;
    return NextResponse.json({ error: "Invalid CSP report" }, { status });
  }
}
