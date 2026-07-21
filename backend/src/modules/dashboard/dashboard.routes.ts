import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { dashboardController } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/me/dashboard", requireAction("dashboard.read"), asyncHandler(dashboardController.getMine));
