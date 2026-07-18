import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { complaintDraftController } from "./complaintDraft.controller.js";
import {
  complaintDraftIdParamSchema,
  createComplaintDraftSchema,
  updateComplaintDraftSchema,
} from "../complaintTemplates/complaintTemplate.validators.js";

export const complaintDraftRoutes = Router();

complaintDraftRoutes.post("/complaint-drafts", requireAuth, validate(createComplaintDraftSchema), asyncHandler(complaintDraftController.create));
complaintDraftRoutes.get("/me/complaint-drafts", requireAuth, asyncHandler(complaintDraftController.listMine));
complaintDraftRoutes.get("/me/complaint-drafts/:id", requireAuth, validate(complaintDraftIdParamSchema), asyncHandler(complaintDraftController.getMine));
complaintDraftRoutes.patch("/me/complaint-drafts/:id", requireAuth, validate(updateComplaintDraftSchema), asyncHandler(complaintDraftController.updateMine));
complaintDraftRoutes.delete("/me/complaint-drafts/:id", requireAuth, validate(complaintDraftIdParamSchema), asyncHandler(complaintDraftController.deleteMine));
