import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditLogController } from "./auditLog.controller.js";
import { auditLogIdSchema, listAuditLogsSchema } from "./auditLog.validators.js";

export const auditLogRoutes = Router();

const auditRoles = requireAction("admin.audit.read");

auditLogRoutes.get("/", auditRoles, validate(listAuditLogsSchema), asyncHandler(auditLogController.list));
auditLogRoutes.get("/:id", auditRoles, validate(auditLogIdSchema), asyncHandler(auditLogController.getById));
