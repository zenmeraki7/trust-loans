import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { reviewController } from "./review.controller.js";
import { createReviewSchema, reviewIdParamSchema } from "./review.validators.js";
import { safetyScanRoutes } from "./safetyScan/safetyScan.routes.js";

export const reviewRoutes = Router();

reviewRoutes.post("/", validate(createReviewSchema), asyncHandler(reviewController.create));
reviewRoutes.use(safetyScanRoutes);
reviewRoutes.get("/:id", validate(reviewIdParamSchema), asyncHandler(reviewController.getById));
reviewRoutes.post("/:id/helpful", validate(reviewIdParamSchema), asyncHandler(reviewController.helpful));
