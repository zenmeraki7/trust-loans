import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authenticateRequest } from "./middlewares/auth.js";
import { csrfProtection } from "./middlewares/csrf.js";
import { requestContext } from "./middlewares/requestContext.js";
import { privateResponseHeaders } from "./middlewares/privateResponse.js";
import { sanitizeJsonResponses } from "./middlewares/publicContent.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { adminModerationRoutes } from "./modules/adminModeration/adminModeration.routes.js";
import { auditLogRoutes } from "./modules/auditLogs/auditLog.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { complaintSummaryRoutes } from "./modules/complaintSummaries/complaintSummary.routes.js";
import { complaintDraftRoutes } from "./modules/complaintDrafts/complaintDraft.routes.js";
import { complaintTemplateRoutes } from "./modules/complaintTemplates/complaintTemplate.routes.js";
import { compareRoutes } from "./modules/compare/compare.routes.js";
import { companyRoutes } from "./modules/companies/company.routes.js";
import { correctionRoutes } from "./modules/corrections/correction.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { directoryRoutes } from "./modules/directory/directory.routes.js";
import { loanAppRoutes } from "./modules/loanApps/loanApp.routes.js";
import { harassmentCaseRoutes } from "./modules/harassmentCases/harassmentCase.routes.js";
import { notificationRoutes } from "./modules/notifications/notification.routes.js";
import { reportRoutes, reviewRoutes } from "./modules/reviews/review.routes.js";
import { scoringRoutes } from "./modules/scoring/scoring.routes.js";
import { env } from "./config/env.js";
import { securityResponseMonitoring } from "./security/securityMonitoring.js";
import { jsonRequestLimit, limitSearchQuery, REQUEST_SIZE_LIMITS } from "./middlewares/requestSize.js";

export const app = express();

if (env.trustProxy) app.set("trust proxy", 1);

app.use(requestContext);
// Personal endpoints are marked private before parsing so even 4xx/413
// responses cannot be cached. This runs again after authentication below.
app.use(privateResponseHeaders);
app.use(securityResponseMonitoring);
app.use(helmet({
  contentSecurityPolicy: {
    reportOnly: !env.cspEnforce,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", env.publicAppOrigin],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
    },
  },
}));
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin.replace(/\/+$/, ""))) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
}));
// Reject cross-site or non-JSON mutations before parsing a body or loading a session.
app.use(csrfProtection);

// Reject and parse bounded bodies before doing session/database work. Express
// skips later JSON parsers after a route-specific parser consumes the request.
app.use("/api/auth/login", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.loginBytes));
app.use("/api/auth/signup", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.signupBytes));
app.use([
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/reauthenticate",
  "/api/auth/change-password",
  "/api/auth/logout",
  "/api/auth/logout-all",
], ...jsonRequestLimit(REQUEST_SIZE_LIMITS.authBytes));
app.use("/api/reviews", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.reviewBytes));
app.use("/api/reports", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.reviewBytes));
app.use("/api/me/cases", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.complaintCaseBytes));
app.use("/api/complaint-drafts", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.complaintDraftBytes));
app.use("/api/me/complaint-drafts", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.complaintDraftBytes));
app.use("/api/complaint-templates/generate", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.complaintGenerationBytes));
app.use("/api/corrections", ...jsonRequestLimit(REQUEST_SIZE_LIMITS.correctionBytes));
app.use(...jsonRequestLimit(REQUEST_SIZE_LIMITS.generalJsonBytes));

app.use("/api/apps", limitSearchQuery());
app.use("/api/directory", limitSearchQuery());
app.use("/api/compare", limitSearchQuery());
app.use("/api/companies", limitSearchQuery());

// Resolve any session only after request size checks have succeeded. Public
// routes may continue; protected routes use the authorization middleware.
app.use(authenticateRequest);
app.use(privateResponseHeaders);
app.use(sanitizeJsonResponses);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/apps", loanAppRoutes);
app.use("/api", harassmentCaseRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/complaint-summaries", complaintSummaryRoutes);
app.use("/api", complaintTemplateRoutes);
app.use("/api", complaintDraftRoutes);
app.use("/api", compareRoutes);
app.use("/api", companyRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", directoryRoutes);
app.use("/api/admin/moderation", adminModerationRoutes);
app.use("/api/admin/audit-logs", auditLogRoutes);
app.use("/api", scoringRoutes);
app.use("/api", correctionRoutes);
app.use("/api", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
