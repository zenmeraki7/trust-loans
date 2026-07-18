import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationController } from "./notification.controller.js";
import {
  listNotificationsSchema,
  notificationIdParamSchema,
  updateNotificationSettingsSchema,
} from "./notification.validators.js";

export const notificationRoutes = Router();

notificationRoutes.get(
  "/notifications",
  requireAuth,
  validate(listNotificationsSchema),
  asyncHandler(notificationController.list),
);
notificationRoutes.post(
  "/notifications/read-all",
  requireAuth,
  asyncHandler(notificationController.markAllRead),
);
notificationRoutes.post(
  "/notifications/:id/read",
  requireAuth,
  validate(notificationIdParamSchema),
  asyncHandler(notificationController.markRead),
);
notificationRoutes.get(
  "/notification-settings",
  requireAuth,
  asyncHandler(notificationController.getSettings),
);
notificationRoutes.patch(
  "/notification-settings",
  requireAuth,
  validate(updateNotificationSettingsSchema),
  asyncHandler(notificationController.updateSettings),
);

