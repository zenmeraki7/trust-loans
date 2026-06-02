import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { compareController } from "./compare.controller.js";

export const compareRoutes = Router();

compareRoutes.get("/compare", asyncHandler(compareController.list));
