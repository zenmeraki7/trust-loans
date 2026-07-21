import { Router } from "express";
import { requireAction } from "../../authorization/authorization.js";
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
  requireAction("notification.read"),
  validate(listNotificationsSchema),
  asyncHandler(notificationController.list),
);
notificationRoutes.post(
  "/notifications/read-all",
  requireAction("notification.write"),
  asyncHandler(notificationController.markAllRead),
);
notificationRoutes.post(
  "/notifications/:id/read",
  requireAction("notification.write"),
  validate(notificationIdParamSchema),
  asyncHandler(notificationController.markRead),
);
notificationRoutes.get(
  "/notification-settings",
  requireAction("notification.read"),
  asyncHandler(notificationController.getSettings),
);
notificationRoutes.patch(
  "/notification-settings",
  requireAction("notification.write"),
  validate(updateNotificationSettingsSchema),
  asyncHandler(notificationController.updateSettings),
);
