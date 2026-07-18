import type { Notification, NotificationSettings } from "@prisma/client";

export const toNotificationDto = (notification: Notification) => ({
  id: notification.id,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  priority: notification.priority,
  read: notification.read,
  relatedUrl: notification.relatedUrl,
  createdAt: notification.createdAt,
});

export const toNotificationSettingsDto = (settings: NotificationSettings) => ({
  emailEnabled: settings.emailEnabled,
  inAppEnabled: settings.inAppEnabled,
  reviewStatusUpdates: settings.reviewStatusUpdates,
  companyResponseAlerts: settings.companyResponseAlerts,
  correctionUpdates: settings.correctionUpdates,
  evidenceUpdates: settings.evidenceUpdates,
  adminAlerts: settings.adminAlerts,
  savedAppAlerts: settings.savedAppAlerts,
  updatedAt: settings.updatedAt,
});

