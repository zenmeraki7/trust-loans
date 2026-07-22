import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { requireAction } from "../../authorization/authorization.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { reviewController } from "./review.controller.js";
import { createReviewSchema, reportReviewSchema, reviewIdParamSchema } from "./review.validators.js";
import { safetyScanRoutes } from "./safetyScan/safetyScan.routes.js";

export const reviewRoutes = Router();
export const reportRoutes = Router();

reviewRoutes.post("/", requireAction("review.create"), validate(createReviewSchema), asyncHandler(reviewController.create));
reviewRoutes.use(safetyScanRoutes);
reviewRoutes.get("/:id", validate(reviewIdParamSchema), asyncHandler(reviewController.getById));
reviewRoutes.post("/:id/helpful", validate(reviewIdParamSchema), asyncHandler(reviewController.helpful));

reportRoutes.post("/", validate(reportReviewSchema), asyncHandler(reviewController.report));
