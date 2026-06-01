import { Router } from "express";
import { requireRole } from "../../middlewares/roles.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminModerationController } from "./adminModeration.controller.js";
import {
  approveReviewSchema,
  listModerationReviewsSchema,
  moderationReviewIdSchema,
  redactReviewSchema,
  rejectReviewSchema,
  requestInfoReviewSchema,
} from "./adminModeration.validators.js";

export const adminModerationRoutes = Router();

const moderateRoles = requireRole("ADMIN", "SUPER_ADMIN", "SENIOR_MODERATOR", "MODERATOR");

adminModerationRoutes.get("/reviews", moderateRoles, validate(listModerationReviewsSchema), asyncHandler(adminModerationController.listReviews));
adminModerationRoutes.get("/reviews/:id", moderateRoles, validate(moderationReviewIdSchema), asyncHandler(adminModerationController.getReview));
adminModerationRoutes.post("/reviews/:id/approve", moderateRoles, validate(approveReviewSchema), asyncHandler(adminModerationController.approve));
adminModerationRoutes.post("/reviews/:id/reject", moderateRoles, validate(rejectReviewSchema), asyncHandler(adminModerationController.reject));
adminModerationRoutes.post("/reviews/:id/request-info", moderateRoles, validate(requestInfoReviewSchema), asyncHandler(adminModerationController.requestInfo));
adminModerationRoutes.post("/reviews/:id/redact", moderateRoles, validate(redactReviewSchema), asyncHandler(adminModerationController.redact));
