import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { companyController } from "./company.controller.js";
import { enrichCompanyProfileSchema } from "./company.validators.js";

export const companyRoutes = Router();

companyRoutes.get("/companies", asyncHandler(companyController.list));
companyRoutes.get("/companies/:id", asyncHandler(companyController.getBySlug));
companyRoutes.post("/companies/:id/enrich", validate(enrichCompanyProfileSchema), asyncHandler(companyController.enrich));
