import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { complaintTemplateController } from "./complaintTemplate.controller.js";
import {
  complaintTemplateKeyParamSchema,
  createComplaintTemplateSchema,
  generateComplaintTemplateSchema,
  listComplaintTemplatesSchema,
  templateIdParamSchema,
  updateComplaintTemplateSchema,
} from "./complaintTemplate.validators.js";

export const complaintTemplateRoutes = Router();

complaintTemplateRoutes.get("/complaint-templates", validate(listComplaintTemplatesSchema), asyncHandler(complaintTemplateController.list));
complaintTemplateRoutes.get("/complaint-templates/:key", validate(complaintTemplateKeyParamSchema), asyncHandler(complaintTemplateController.getByKey));
complaintTemplateRoutes.post("/complaint-templates/generate", validate(generateComplaintTemplateSchema), asyncHandler(complaintTemplateController.generate));

complaintTemplateRoutes.post("/admin/complaint-templates", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), validate(createComplaintTemplateSchema), asyncHandler(complaintTemplateController.create));
complaintTemplateRoutes.patch("/admin/complaint-templates/:id", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), validate(updateComplaintTemplateSchema), asyncHandler(complaintTemplateController.update));
complaintTemplateRoutes.post("/admin/complaint-templates/:id/activate", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), validate(templateIdParamSchema), asyncHandler(complaintTemplateController.activate));
complaintTemplateRoutes.post("/admin/complaint-templates/:id/deactivate", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), validate(templateIdParamSchema), asyncHandler(complaintTemplateController.deactivate));
