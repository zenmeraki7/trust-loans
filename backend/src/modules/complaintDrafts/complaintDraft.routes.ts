import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { complaintDraftController } from "./complaintDraft.controller.js";
import {
  complaintDraftIdParamSchema,
  createComplaintDraftSchema,
  updateComplaintDraftSchema,
} from "../complaintTemplates/complaintTemplate.validators.js";

export const complaintDraftRoutes = Router();

complaintDraftRoutes.post("/complaint-drafts", requireAction("draft.write"), validate(createComplaintDraftSchema), asyncHandler(complaintDraftController.create));
complaintDraftRoutes.get("/me/complaint-drafts", requireAction("draft.read"), asyncHandler(complaintDraftController.listMine));
complaintDraftRoutes.get("/me/complaint-drafts/:id", requireAction("draft.read"), validate(complaintDraftIdParamSchema), asyncHandler(complaintDraftController.getMine));
complaintDraftRoutes.patch("/me/complaint-drafts/:id", requireAction("draft.write"), validate(updateComplaintDraftSchema), asyncHandler(complaintDraftController.updateMine));
complaintDraftRoutes.delete("/me/complaint-drafts/:id", requireAction("draft.write"), validate(complaintDraftIdParamSchema), asyncHandler(complaintDraftController.deleteMine));
