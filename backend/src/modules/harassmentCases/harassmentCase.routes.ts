import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
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

harassmentCaseRoutes.post("/me/cases", requireAction("case.write"), validate(createCaseSchema), asyncHandler(harassmentCaseController.create));
harassmentCaseRoutes.get("/me/cases", requireAction("case.read"), asyncHandler(harassmentCaseController.list));
harassmentCaseRoutes.get("/me/cases/:caseId", requireAction("case.read"), validate(caseIdParamSchema), asyncHandler(harassmentCaseController.get));
harassmentCaseRoutes.patch("/me/cases/:caseId", requireAction("case.write"), validate(updateCaseSchema), asyncHandler(harassmentCaseController.update));
harassmentCaseRoutes.delete("/me/cases/:caseId", requireAction("case.write"), validate(caseIdParamSchema), asyncHandler(harassmentCaseController.remove));

harassmentCaseRoutes.post("/me/cases/:caseId/timeline", requireAction("case.write"), validate(caseIdParamSchema.merge(timelineSchema)), asyncHandler(harassmentCaseController.createTimeline));
harassmentCaseRoutes.patch("/me/cases/:caseId/timeline/:itemId", requireAction("case.write"), validate(updateTimelineSchema), asyncHandler(harassmentCaseController.updateTimeline));
harassmentCaseRoutes.delete("/me/cases/:caseId/timeline/:itemId", requireAction("case.write"), validate(caseItemParamSchema), asyncHandler(harassmentCaseController.deleteTimeline));

harassmentCaseRoutes.post("/me/cases/:caseId/checklist", requireAction("case.write"), validate(caseIdParamSchema.merge(checklistSchema)), asyncHandler(harassmentCaseController.createChecklist));
harassmentCaseRoutes.patch("/me/cases/:caseId/checklist/:itemId", requireAction("case.write"), validate(updateChecklistSchema), asyncHandler(harassmentCaseController.updateChecklist));
harassmentCaseRoutes.delete("/me/cases/:caseId/checklist/:itemId", requireAction("case.write"), validate(caseItemParamSchema), asyncHandler(harassmentCaseController.deleteChecklist));

harassmentCaseRoutes.post("/me/cases/:caseId/external-complaints", requireAction("case.write"), validate(caseIdParamSchema.merge(externalComplaintSchema)), asyncHandler(harassmentCaseController.createExternalComplaint));
harassmentCaseRoutes.patch("/me/cases/:caseId/external-complaints/:complaintId", requireAction("case.write"), validate(updateExternalComplaintSchema), asyncHandler(harassmentCaseController.updateExternalComplaint));
harassmentCaseRoutes.delete("/me/cases/:caseId/external-complaints/:complaintId", requireAction("case.write"), validate(complaintIdParamSchema), asyncHandler(harassmentCaseController.deleteExternalComplaint));

harassmentCaseRoutes.post("/me/cases/:caseId/link-review", requireAction("case.write"), validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkReview));
harassmentCaseRoutes.post("/me/cases/:caseId/link-evidence", requireAction("case.write"), validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkEvidence));
harassmentCaseRoutes.post("/me/cases/:caseId/link-decision-session", requireAction("case.write"), validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkDecisionSession));
harassmentCaseRoutes.post("/me/cases/:caseId/link-complaint-draft", requireAction("case.write"), validate(caseIdParamSchema.merge(linkCaseSchema)), asyncHandler(harassmentCaseController.linkComplaintDraft));
