import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { companyController } from "./company.controller.js";

export const companyRoutes = Router();

companyRoutes.get("/companies", asyncHandler(companyController.list));
companyRoutes.get("/companies/:id", asyncHandler(companyController.getBySlug));
