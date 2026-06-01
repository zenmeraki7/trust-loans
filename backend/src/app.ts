import cors from "cors";
import express from "express";
import helmet from "helmet";
import { optionalAuth } from "./middlewares/auth.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { adminModerationRoutes } from "./modules/adminModeration/adminModeration.routes.js";
import { auditLogRoutes } from "./modules/auditLogs/auditLog.routes.js";
import { complaintSummaryRoutes } from "./modules/complaintSummaries/complaintSummary.routes.js";
import { complaintDraftRoutes } from "./modules/complaintDrafts/complaintDraft.routes.js";
import { complaintTemplateRoutes } from "./modules/complaintTemplates/complaintTemplate.routes.js";
import { correctionRoutes } from "./modules/corrections/correction.routes.js";
import { adminEvidenceRoutes, evidenceRoutes } from "./modules/evidence/evidence.routes.js";
import { loanAppRoutes } from "./modules/loanApps/loanApp.routes.js";
import { notificationRoutes } from "./modules/notifications/notification.routes.js";
import { reviewRoutes } from "./modules/reviews/review.routes.js";
import { scoringRoutes } from "./modules/scoring/scoring.routes.js";
import { env } from "./config/env.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(optionalAuth);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/apps", loanAppRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/admin/evidence", adminEvidenceRoutes);
app.use("/api/complaint-summaries", complaintSummaryRoutes);
app.use("/api", complaintTemplateRoutes);
app.use("/api", complaintDraftRoutes);
app.use("/api/admin/moderation", adminModerationRoutes);
app.use("/api/admin/audit-logs", auditLogRoutes);
app.use("/api", scoringRoutes);
app.use("/api", correctionRoutes);
app.use("/api", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
