import { Router } from "express";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditLogController } from "./auditLog.controller.js";
import { auditLogIdSchema, listAuditLogsSchema } from "./auditLog.validators.js";

export const auditLogRoutes = Router();

const auditRoles = requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "ANALYST");

auditLogRoutes.get("/", auditRoles, validate(listAuditLogsSchema), asyncHandler(auditLogController.list));
auditLogRoutes.get("/:id", auditRoles, validate(auditLogIdSchema), asyncHandler(auditLogController.getById));

