# Security policy

## Secrets

Never place secrets directly in source code or commit them to git.

Store the following only through environment variables or a trusted secret manager:

- Database connection string
- Authentication secret
- Session-signing key
- Email API key
- AI API key
- Encryption keys
- Cloud credentials

The repository intentionally ignores local secret files including `.env`, `.env.local`, `.env.production`, `*.pem`, and `*.key`.

Use separate values for development, staging, and production. Rotate any secret immediately if it was ever committed, pasted into logs, or shared outside the secret manager.

## GitHub secret scanning

Enable GitHub secret scanning and push protection in the repository security settings:

`Settings → Code security and analysis → Secret scanning → Enable`

Also enable push protection where available so accidental secret commits are blocked before they reach GitHub.

## Authentication and sessions

- Authentication uses opaque, server-managed sessions stored in PostgreSQL.
- Browsers receive only an `HttpOnly`, `Secure` (production), `SameSite=Lax` cookie. Access tokens and session IDs must never be copied to `localStorage` or `sessionStorage`.
- PostgreSQL stores SHA-256 hashes of session, email-verification, and password-reset tokens. Raw one-time tokens are delivered only through the configured email channel.
- Set `SESSION_SIGNING_KEY` to at least 32 random characters. It pseudonymizes IP addresses for security review and is never exposed to the browser.
- Configure `EMAIL_DELIVERY_WEBHOOK_URL`, `EMAIL_API_KEY`, and `PUBLIC_APP_ORIGIN` before enabling production signup or password recovery. Recovery URLs are never derived from request headers.
- Configure `REDIS_URL` for distributed login, signup, and password-reset throttling. Authentication fails closed if Redis is unavailable.
- Configure `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for adaptive Cloudflare Turnstile checks. The widget is loaded only after Redis identifies suspicious login failures; every token is validated server-side.
- Browser-supplied identity and role headers are never accepted, including in development. Use a real account and server-managed session cookie for local testing.
- Apply `backend/prisma/migrations/20260719143000_add_secure_server_sessions` before deploying the backend.
- Login, password reset, password change, and suspicious recovery issue a new random session only after revoking the applicable prior sessions. Any future email-change, MFA, role-change, or administrator-elevation workflow must call `invalidateSessionsForSecurityChange` before issuing a replacement session.

## Content Security Policy rollout

- CSP defaults to report-only. Keep `CSP_ENFORCE=false` in the first staging and production rollout.
- Review structured `CSP_VIOLATION` events. The collector removes URL queries and fragments before logging and rejects bodies larger than 16 KiB.
- Add only required HTTPS API origins to `CSP_CONNECT_SRC`; do not add wildcards. `NEXT_PUBLIC_API_BASE_URL` is included automatically after origin validation.
- Exercise authentication, Turnstile, YouTube tutorials, API requests, images, forms, and every protected screen while collecting violations.
- Investigate and fix every unexplained `script-src`, `style-src`, `connect-src`, `frame-src`, and `form-action` violation. Do not add `unsafe-inline` or `unsafe-eval` to silence reports.
- After a representative clean observation window, set `CSP_ENFORCE=true` in staging, repeat smoke and regression tests, and then promote the same setting to production.
- Return to report-only if enforcement blocks a critical user flow; fix the narrow source directive before re-enabling enforcement.

## Public-content rendering

- Treat database text as plain text. Render it through normal React text children; never add a raw-HTML sink for company descriptions, reviews, corrections, complaint summaries, or administrator content.
- New public URLs accept HTTPS only and reject embedded credentials. Internal navigation may use a single-leading-slash path.
- Logo data URLs are limited to bounded PNG, JPEG, WebP, or GIF payloads. SVG, HTML, scriptable protocols, protocol-relative URLs, and arbitrary data URLs are rejected.
- API responses sanitize URL-context fields again so unsafe legacy database values cannot become `href` or `src` values.
- No Markdown renderer is currently installed. If Markdown is introduced, raw HTML must remain disabled and stored-payload tests must be extended before deployment.
- Run `npm run test:stored-xss` and `cd backend && npm run test:security` when changing public content, links, rendering, or validation.
- Raw HTML rendering is disabled. Stored descriptions, corrections, reviews, company responses, and complaint drafts are passed only as React text children; HTML-like input is displayed literally.
- Application MDX, DOM HTML insertion APIs, raw-Markdown plugins, and HTML/Markdown parser packages are blocked by `npm run security:raw-html`, which also runs before every frontend production build.
- `PlainText` is the explicit rendering boundary for high-risk multiline stored content. It preserves line breaks and wrapping without parsing HTML or Markdown.

## Private-record query invariant

- A user-owned record is never read, updated, or deleted using only its resource ID. Repository code must build its predicate with `ownedByUser(id, authenticatedUserId, ...)` or `ownedByRequester(id, authenticatedUserId, ...)`.
- The trusted ID and owner fields are applied after additional predicates, so browser input cannot override them.
- Child case records are atomically scoped by child ID, case ID, and the parent case's user ID.
- Public records use explicit public-status predicates. Administrative review repositories are separate, named as administrative review access, protected by server-side role policies, and are never callable from user routes.
- `npm run test:security` includes a source invariant that rejects ambiguous ID-only helpers in private user repositories.

## Request-field integrity

- Request bodies use strict Zod objects. Unknown fields are rejected rather than silently stripped.
- The validation middleware also compares the original request shape with the parsed shape, providing deny-by-default protection for any legacy schema that still uses Zod's stripping behavior.
- User-facing create and update schemas do not accept identity, ownership, role, approval, publication, or lifecycle-status fields. Those values come from the authenticated session, database authorization state, or explicit privileged server workflows.
- Loan-app publication, verification, claim, risk, and scoring defaults are assigned by the repository. Review evidence flags, complaint-draft status, evidence processing state, and case status are also server generated.

## Request-size limits

- Login and other credential requests accept at most 16 KiB; signup accepts 32 KiB.
- Case updates accept at most 16 KiB. Reviews, reports, and corrections accept 48 KiB so their Unicode byte ceiling remains compatible with their character limits. Complaint generation accepts 32 KiB and complaint drafts accept 128 KiB for the explicitly bounded 20,000-character generated body plus structured fields.
- All other JSON endpoints are capped at 64 KiB, replacing the former 5 MiB parser limit.
- Search query strings are capped at 2 KiB and individual search fields retain their schema-level character limits.
- Declared oversized bodies are rejected before session/database work. The JSON parser independently enforces the same limit against chunked and decompressed bodies.
- The HTTP server caps headers at 16 KiB and uses bounded header/request timeouts. Oversized bodies return 413 and oversized search queries return 414.

## Private response caching

- Every response associated with an authenticated session receives `Cache-Control: private, no-store`, `Pragma: no-cache`, and `Expires: 0`, including otherwise-public directory responses.
- Personal and administrative route families receive the same headers before body parsing and authentication. Validation failures, rejected credentials, expired sessions, CSRF failures, and oversized-request errors therefore inherit the protection.
- Authentication routes call the shared cache-header helper and cannot replace the policy with a weaker header.
- `Vary: Cookie, Authorization` prevents shared representations from being reused across authentication contexts.

## Security monitoring and retention

- Security alerts are emitted as structured `SECURITY_ALERT` events for the platform log drain and, when configured, copied to `SECURITY_EVENT_SINK_URL` over HTTPS. The sink token comes only from the secret manager.
- Production must retain the external sink or platform log drain in a separately administered account with append-only retention. The primary PostgreSQL `AuditLog` table is not the sole security record.
- Detectors cover distributed login attacks, one-account/many-network attacks, repeated 401/403 responses, private resource-ID probing, admin login from a new environment, rapid company-profile changes, role changes, Redis failures, large exports, abnormal read volumes, suspicious redirects, and production configuration changes.
- Route implementations that add exports, redirect endpoints, bulk readers, or role mutation must call the corresponding monitoring function in `securityMonitoring.ts` in the same change.
- Alert payloads contain reason codes, counts, pseudonymous network/account fingerprints, request IDs, and trusted actor IDs. They must never contain passwords, cookies, tokens, authorization headers, complaint text, or evidence content.
