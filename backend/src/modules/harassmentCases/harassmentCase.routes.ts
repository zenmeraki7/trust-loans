import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { harassmentCaseController } from "./harassmentCase.controller.js";
import {
  caseIdParamSchema,
  caseItemParamSchema,
  checklistSchema,
  complaintIdParamSchema,
  createCaseSchema,
  externalComplaintSchema,
  linkCaseSchema,
  timelineSchema,
  updateCaseSchema,
  updateChecklistSchema,
  updateExternalComplaintSchema,
  updateTimelineSchema,
} from "./harassmentCase.validators.js";

export const harassmentCaseRoutes = Router();

harassmentCaseRoutes.post("/me/cases", requireAuth, validate(createCaseSchema), asyncHandler(harassmentCaseController.create));
harassmentCaseRoutes.get("/me/cases", requireAuth, asyncHandler(harassmentCaseController.list));
harassmentCaseRoutes.get("/me/cases/:caseId", requireAuth, validate(caseIdParamSchema), asyncHandler(harassmentCaseController.get));
harassmentCaseRoutes.patch("/me/cases/:caseId", requireAuth, validate(updateCaseSchema), asyncHandler(harassmentCaseController.update));
harassmentCaseRoutes.delete("/me/cases/:caseId", requireAuth, validate(caseIdParamSchema), asyncHandler(harassmentCaseController.remove));

harassmentCaseRoutes.post("/me/cases/:caseId/timeline", requireAuth, validate(caseIdParamSchema.merge(timelineSchema)), asyncHandler(harassmentCaseController.createTimeline));
harassmentCaseRoutes.patch("/me/cases/:caseId/timeline/:itemId", requireAuth, validate(updateTimelineSchema), asyncHandler(harassmentCaseController.updateTimeline));
harassmentCaseRoutes.delete("/me/cases/:caseId/timeline/:itemId", requireAuth, validate(caseItemParamSchema), asyncHandler(harassmentCaseController.deleteTimeline));

harassmentCaseRoutes.post("/me/cases/:caseId/checklist", requireAuth, validate(caseIdParamSchema.merge(checklistSchema)), asyncHandler(harassmentCaseController.createChecklist));
harassmentCaseRoutes.patch("/me/cases/:caseId/checklist/:itemId", requireAuth, validate(updateChecklistSchema), asyncHandler(harassmentCaseController.updateChecklist));
harassmentCaseRoutes.delete("/me/cases/:caseId/checklist/:itemId", requireAuth, validate(caseItemParamSchema), asyncHandler(harassmentCaseController.deleteChecklist));

harassmentCaseRoutes.post("/me/cases/:caseId/external-complaints", requireAuth, validate(caseIdParamSchema.merge(externalComplaintSchema)), asyncHandler(harassmentCaseController.createExternalComplaint));
harassmentCaseRoutes.patch("/me/cases/:caseId/external-complaints/:complaintId", requireAuth, validate(updateExternalComplaintSchema), asyncHandler(harassmentCaseController.updateExternalComplaint));
harassmentCaseRoutes.delete("/me/cases/:caseId/external-complaints/:complaintId", requireAuth, validate(complaintIdParamSchema), asyncHandler(harassmentCaseController.deleteExternalComplaint));

harassmentCaseRoutes.post("/me/cases/:caseId/link-review", requireAuth, validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkReview));
harassmentCaseRoutes.post("/me/cases/:caseId/link-evidence", requireAuth, validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkEvidence));
harassmentCaseRoutes.post("/me/cases/:caseId/link-decision-session", requireAuth, validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkDecisionSession));
harassmentCaseRoutes.post("/me/cases/:caseId/link-complaint-draft", requireAuth, validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkComplaintDraft));
