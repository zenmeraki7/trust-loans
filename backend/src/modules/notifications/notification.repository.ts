import { NotificationPriority, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { UpdateNotificationSettingsInput } from "./notification.validators.js";

export const notificationRepository = {
  async findMany(input: {
    userId: string;
    skip: number;
    take: number;
    read?: boolean;
    type?: string;
    priority?: NotificationPriority;
  }) {
    const where: Prisma.NotificationWhereInput = {
      userId: input.userId,
      read: input.read,
      type: input.type,
      priority: input.priority,
    };

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  },

  markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  getSettings(userId: string) {
    return prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },

  updateSettings(userId: string, input: UpdateNotificationSettingsInput) {
    return prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...input },
      update: input,
    });
  },
};

