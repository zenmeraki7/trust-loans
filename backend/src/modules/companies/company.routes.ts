import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { companyController } from "./company.controller.js";
import { createCompanyProfileSchema, enrichCompanyProfileSchema } from "./company.validators.js";

export const companyRoutes = Router();

companyRoutes.get("/companies", asyncHandler(companyController.list));
companyRoutes.post("/companies", requireAction("admin.company.write"), validate(createCompanyProfileSchema), asyncHandler(companyController.create));
companyRoutes.get("/companies/:id", asyncHandler(companyController.getBySlug));
companyRoutes.post("/companies/:id/enrich", requireAction("admin.company.write"), validate(enrichCompanyProfileSchema), asyncHandler(companyController.enrich));
