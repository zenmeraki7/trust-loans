import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loanAppController } from "./loanApp.controller.js";
import { appIdParamSchema, createLoanAppSchema, listLoanAppsSchema, slugParamSchema, suggestLoanAppSchema } from "./loanApp.validators.js";

export const loanAppRoutes = Router();

loanAppRoutes.get("/", validate(listLoanAppsSchema), asyncHandler(loanAppController.list));
loanAppRoutes.post("/", requireAction("admin.loan-app.write"), validate(createLoanAppSchema), asyncHandler(loanAppController.create));
loanAppRoutes.post("/suggest", validate(suggestLoanAppSchema), asyncHandler(loanAppController.suggest));
loanAppRoutes.get("/:id/reviews", validate(appIdParamSchema), asyncHandler(loanAppController.reviews));
loanAppRoutes.get("/:slug", validate(slugParamSchema), asyncHandler(loanAppController.getBySlug));
