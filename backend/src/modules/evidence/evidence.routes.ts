import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { evidenceController } from "./evidence.controller.js";
import { adminListEvidenceSchema, completeUploadSchema, createUploadUrlSchema, evidenceIdParamSchema, reasonActionSchema, secureOpenSchema } from "./evidence.validators.js";

export const evidenceRoutes = Router();
export const adminEvidenceRoutes = Router();

evidenceRoutes.post("/upload-url", requireAction("evidence.write"), validate(createUploadUrlSchema), asyncHandler(evidenceController.uploadUrl));
evidenceRoutes.post("/complete", requireAction("evidence.write"), validate(completeUploadSchema), asyncHandler(evidenceController.complete));
evidenceRoutes.get("/:id/metadata", requireAction("evidence.read"), validate(evidenceIdParamSchema), asyncHandler(evidenceController.metadata));
evidenceRoutes.delete("/:id", requireAction("evidence.write"), validate(evidenceIdParamSchema), asyncHandler(evidenceController.delete));

adminEvidenceRoutes.get("/", requireAction("admin.evidence"), validate(adminListEvidenceSchema), asyncHandler(evidenceController.adminList));
adminEvidenceRoutes.get("/:id", requireAction("admin.evidence"), validate(evidenceIdParamSchema), asyncHandler(evidenceController.adminGet));
adminEvidenceRoutes.post("/:id/secure-open", requireAction("admin.evidence"), validate(secureOpenSchema), asyncHandler(evidenceController.secureOpen));
adminEvidenceRoutes.post("/:id/accept", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.accept));
adminEvidenceRoutes.post("/:id/reject", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.reject));
adminEvidenceRoutes.post("/:id/private-only", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.privateOnly));
adminEvidenceRoutes.post("/:id/request-replacement", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.requestReplacement));
adminEvidenceRoutes.post("/:id/delete", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.adminDelete));
adminEvidenceRoutes.post("/:id/escalate", requireAction("admin.evidence"), validate(reasonActionSchema), asyncHandler(evidenceController.escalate));
