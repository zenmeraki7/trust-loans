import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { correctionController } from "./correction.controller.js";
import {
  correctionDecisionSchema,
  correctionIdParamSchema,
  createCorrectionSchema,
  listCorrectionsSchema,
} from "./correction.validators.js";

export const correctionRoutes = Router();

correctionRoutes.post("/corrections", validate(createCorrectionSchema), asyncHandler(correctionController.create));
correctionRoutes.get("/me/corrections", requireAuth, validate(listCorrectionsSchema), asyncHandler(correctionController.listMine));
correctionRoutes.get("/corrections/:id", validate(correctionIdParamSchema), asyncHandler(correctionController.getById));

correctionRoutes.get(
  "/admin/corrections",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "MODERATOR"),
  validate(listCorrectionsSchema),
  asyncHandler(correctionController.listAdmin),
);
correctionRoutes.get(
  "/admin/corrections/:id",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "MODERATOR"),
  validate(correctionIdParamSchema),
  asyncHandler(correctionController.getById),
);
correctionRoutes.post(
  "/admin/corrections/:id/accept",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.accept),
);
correctionRoutes.post(
  "/admin/corrections/:id/reject",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.reject),
);
correctionRoutes.post(
  "/admin/corrections/:id/escalate",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "MODERATOR"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.escalate),
);
correctionRoutes.post(
  "/admin/corrections/:id/request-info",
  requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "MODERATOR"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.requestInfo),
);

