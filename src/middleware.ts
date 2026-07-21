import { NextRequest, NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

function configuredConnectSources() {
  const values = [process.env.NEXT_PUBLIC_API_BASE_URL, process.env.CSP_CONNECT_SRC]
    .filter(Boolean)
    .flatMap((value) => value!.split(/[\s,]+/));

  const origins = new Set<string>();
  for (const value of values) {
    try {
      const url = new URL(value);
      const localHttp = !isProduction && url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      if (url.protocol === "https:" || localHttp) origins.add(url.origin);
    } catch {
      // Invalid optional sources are denied instead of being copied into CSP.
    }
  }
  return [...origins];
}

function contentSecurityPolicy(nonce: string) {
  const connectSources = ["'self'", ...configuredConnectSources(), "https://challenges.cloudflare.com"];
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ];
  if (isProduction) directives.push("upgrade-insecure-requests");
  return `${directives.join("; ")};`;
}

export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const policy = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  // Next.js reads the request CSP to nonce its framework scripts and styles.
  requestHeaders.set("Content-Security-Policy", policy);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const responseHeader = process.env.CSP_ENFORCE === "true"
    ? "Content-Security-Policy"
    : "Content-Security-Policy-Report-Only";

  response.headers.set(responseHeader, policy);
  response.headers.set("Reporting-Endpoints", `csp-endpoint="${request.nextUrl.origin}/api/csp-report"`);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
