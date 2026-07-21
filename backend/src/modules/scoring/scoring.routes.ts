import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { scoringController } from "./scoring.controller.js";
import { recalculateScoringSchema, scoreBreakdownParamSchema, updateScoringConfigSchema } from "./scoring.validators.js";

export const scoringRoutes = Router();

scoringRoutes.get("/apps/:id/score-breakdown", validate(scoreBreakdownParamSchema), asyncHandler(scoringController.getAppScoreBreakdown));

scoringRoutes.get(
  "/admin/scoring/config",
  requireAction("admin.scoring.read"),
  asyncHandler(scoringController.getConfig),
);

scoringRoutes.patch(
  "/admin/scoring/config",
  requireAction("admin.scoring.write"),
  validate(updateScoringConfigSchema),
  asyncHandler(scoringController.updateConfig),
);

scoringRoutes.post(
  "/admin/scoring/recalculate",
  requireAction("admin.scoring.recalculate"),
  validate(recalculateScoringSchema),
  asyncHandler(scoringController.recalculate),
);
