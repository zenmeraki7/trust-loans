import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { directoryController } from "./directory.controller.js";
import { publicDirectorySchema } from "./directory.validators.js";

export const directoryRoutes = Router();

directoryRoutes.get("/directory", validate(publicDirectorySchema), asyncHandler(directoryController.search));
