import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { evidenceController } from "./evidence.controller.js";
import { adminListEvidenceSchema, completeUploadSchema, createUploadUrlSchema, evidenceIdParamSchema, reasonActionSchema, secureOpenSchema } from "./evidence.validators.js";

export const evidenceRoutes = Router();
export const adminEvidenceRoutes = Router();

evidenceRoutes.post("/upload-url", requireAuth, validate(createUploadUrlSchema), asyncHandler(evidenceController.uploadUrl));
evidenceRoutes.post("/complete", requireAuth, validate(completeUploadSchema), asyncHandler(evidenceController.complete));
evidenceRoutes.get("/:id/metadata", requireAuth, validate(evidenceIdParamSchema), asyncHandler(evidenceController.metadata));
evidenceRoutes.delete("/:id", requireAuth, validate(evidenceIdParamSchema), asyncHandler(evidenceController.delete));

adminEvidenceRoutes.get("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(adminListEvidenceSchema), asyncHandler(evidenceController.adminList));
adminEvidenceRoutes.get("/:id", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(evidenceIdParamSchema), asyncHandler(evidenceController.adminGet));
adminEvidenceRoutes.post("/:id/secure-open", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(secureOpenSchema), asyncHandler(evidenceController.secureOpen));
adminEvidenceRoutes.post("/:id/accept", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.accept));
adminEvidenceRoutes.post("/:id/reject", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.reject));
adminEvidenceRoutes.post("/:id/private-only", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.privateOnly));
adminEvidenceRoutes.post("/:id/request-replacement", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.requestReplacement));
adminEvidenceRoutes.post("/:id/delete", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.adminDelete));
adminEvidenceRoutes.post("/:id/escalate", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR", "SENIOR_MODERATOR"), validate(reasonActionSchema), asyncHandler(evidenceController.escalate));
