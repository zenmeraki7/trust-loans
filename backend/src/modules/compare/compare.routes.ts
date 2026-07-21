import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { compareController } from "./compare.controller.js";
import { compareListSchema } from "./compare.validators.js";

export const compareRoutes = Router();

compareRoutes.get("/compare", validate(compareListSchema), asyncHandler(compareController.list));
