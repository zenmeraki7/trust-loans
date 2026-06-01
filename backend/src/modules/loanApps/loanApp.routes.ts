import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loanAppController } from "./loanApp.controller.js";
import { appIdParamSchema, listLoanAppsSchema, slugParamSchema, suggestLoanAppSchema } from "./loanApp.validators.js";

export const loanAppRoutes = Router();

loanAppRoutes.get("/", validate(listLoanAppsSchema), asyncHandler(loanAppController.list));
loanAppRoutes.post("/suggest", validate(suggestLoanAppSchema), asyncHandler(loanAppController.suggest));
loanAppRoutes.get("/:id/reviews", validate(appIdParamSchema), asyncHandler(loanAppController.reviews));
loanAppRoutes.get("/:slug", validate(slugParamSchema), asyncHandler(loanAppController.getBySlug));
