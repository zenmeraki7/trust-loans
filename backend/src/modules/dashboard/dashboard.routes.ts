import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { dashboardController } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/me/dashboard", requireAuth, asyncHandler(dashboardController.getMine));
