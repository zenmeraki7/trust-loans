import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loanAppController } from "./loanApp.controller.js";
import { appIdParamSchema, createLoanAppSchema, listLoanAppsSchema, slugParamSchema, suggestLoanAppSchema } from "./loanApp.validators.js";

export const loanAppRoutes = Router();

loanAppRoutes.get("/", validate(listLoanAppsSchema), asyncHandler(loanAppController.list));
loanAppRoutes.post("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), validate(createLoanAppSchema), asyncHandler(loanAppController.create));
loanAppRoutes.post("/suggest", validate(suggestLoanAppSchema), asyncHandler(loanAppController.suggest));
loanAppRoutes.get("/:id/reviews", validate(appIdParamSchema), asyncHandler(loanAppController.reviews));
loanAppRoutes.get("/:slug", validate(slugParamSchema), asyncHandler(loanAppController.getBySlug));
