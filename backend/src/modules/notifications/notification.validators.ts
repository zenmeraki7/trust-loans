import { NotificationPriority } from "@prisma/client";
import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const listNotificationsSchema = z.object({
  query: paginationQuerySchema.extend({
    read: z.coerce.boolean().optional(),
    type: z
      .enum([
        "review_status",
        "company_response",
        "correction_update",
        "evidence_update",
        "admin_alert",
        "saved_app_alert",
      ])
      .optional(),
    priority: z.nativeEnum(NotificationPriority).optional(),
  }),
});

export const notificationIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const updateNotificationSettingsSchema = z.object({
  body: z.object({
    emailEnabled: z.boolean().optional(),
    inAppEnabled: z.boolean().optional(),
    reviewStatusUpdates: z.boolean().optional(),
    companyResponseAlerts: z.boolean().optional(),
    correctionUpdates: z.boolean().optional(),
    evidenceUpdates: z.boolean().optional(),
    adminAlerts: z.boolean().optional(),
    savedAppAlerts: z.boolean().optional(),
  }),
});

export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>["body"];

