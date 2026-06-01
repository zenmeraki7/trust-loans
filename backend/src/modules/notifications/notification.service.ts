import type { NotificationPriority } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import { notificationRepository } from "./notification.repository.js";
import type { UpdateNotificationSettingsInput } from "./notification.validators.js";

export const notificationService = {
  async list(query: unknown, userId?: string) {
    if (!userId) throw new AppError("Authentication required", 401);
    const pagination = getPagination(query);
    const filters = query as { read?: boolean; type?: string; priority?: NotificationPriority };
    const result = await notificationRepository.findMany({
      userId,
      skip: pagination.skip,
      take: pagination.take,
      read: filters.read,
      type: filters.type,
      priority: filters.priority,
    });
    return paginatedResponse(result.items, result.total, pagination.page, pagination.limit);
  },

  async markRead(id: string, userId?: string) {
    if (!userId) throw new AppError("Authentication required", 401);
    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      throw new AppError("Notification not found", 404);
    }
    const updated = await notificationRepository.markRead(id);
    await auditLog({
      actorId: userId,
      action: "notification.read",
      targetType: "Notification",
      targetId: id,
      beforeJson: { read: notification.read },
      afterJson: { read: updated.read },
    });
    return updated;
  },

  async markAllRead(userId?: string) {
    if (!userId) throw new AppError("Authentication required", 401);
    const result = await notificationRepository.markAllRead(userId);
    await auditLog({
      actorId: userId,
      action: "notification.read_all",
      targetType: "Notification",
      afterJson: { count: result.count },
    });
    return result;
  },

  async getSettings(userId?: string) {
    if (!userId) throw new AppError("Authentication required", 401);
    return notificationRepository.getSettings(userId);
  },

  async updateSettings(input: UpdateNotificationSettingsInput, userId?: string) {
    if (!userId) throw new AppError("Authentication required", 401);
    const before = await notificationRepository.getSettings(userId);
    const updated = await notificationRepository.updateSettings(userId, input);
    await auditLog({
      actorId: userId,
      action: "notification_settings.updated",
      targetType: "NotificationSettings",
      targetId: updated.id,
      beforeJson: before,
      afterJson: updated,
    });
    return updated;
  },
};

