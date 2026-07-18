import { Router } from "express";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { scoringController } from "./scoring.controller.js";
import { recalculateScoringSchema, scoreBreakdownParamSchema, updateScoringConfigSchema } from "./scoring.validators.js";

export const scoringRoutes = Router();

scoringRoutes.get("/apps/:id/score-breakdown", validate(scoreBreakdownParamSchema), asyncHandler(scoringController.getAppScoreBreakdown));

scoringRoutes.get(
  "/admin/scoring/config",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "ANALYST"),
  asyncHandler(scoringController.getConfig),
);

scoringRoutes.patch(
  "/admin/scoring/config",
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateScoringConfigSchema),
  asyncHandler(scoringController.updateConfig),
);

scoringRoutes.post(
  "/admin/scoring/recalculate",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR"),
  validate(recalculateScoringSchema),
  asyncHandler(scoringController.recalculate),
);

