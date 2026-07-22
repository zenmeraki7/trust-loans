import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
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

correctionRoutes.post("/corrections", requireAction("correction.write"), validate(createCorrectionSchema), asyncHandler(correctionController.create));
correctionRoutes.get("/me/corrections", requireAction("correction.read"), validate(listCorrectionsSchema), asyncHandler(correctionController.listMine));
correctionRoutes.get("/corrections/:id", requireAction("correction.read"), validate(correctionIdParamSchema), asyncHandler(correctionController.getMine));

correctionRoutes.get(
  "/admin/corrections",
  requireAction("admin.correction.read"),
  validate(listCorrectionsSchema),
  asyncHandler(correctionController.listAdmin),
);
correctionRoutes.get(
  "/admin/corrections/:id",
  requireAction("admin.correction.read"),
  validate(correctionIdParamSchema),
  asyncHandler(correctionController.getById),
);
correctionRoutes.post(
  "/admin/corrections/:id/accept",
  requireAction("admin.correction.decide"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.accept),
);
correctionRoutes.post(
  "/admin/corrections/:id/reject",
  requireAction("admin.correction.decide"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.reject),
);
correctionRoutes.post(
  "/admin/corrections/:id/escalate",
  requireAction("admin.correction.triage"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.escalate),
);
correctionRoutes.post(
  "/admin/corrections/:id/request-info",
  requireAction("admin.correction.triage"),
  validate(correctionDecisionSchema),
  asyncHandler(correctionController.requestInfo),
);
