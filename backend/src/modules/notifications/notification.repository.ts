import { NotificationPriority, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { ownedByUser } from "../../security/ownerScope.js";
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

  findByIdForUser(id: string, userId: string) {
    return prisma.notification.findFirst({ where: ownedByUser(id, userId) });
  },

  async markReadForUser(id: string, userId: string) {
    const result = await prisma.notification.updateMany({
      where: ownedByUser(id, userId),
      data: { read: true },
    });
    if (result.count !== 1) return null;
    return prisma.notification.findFirst({ where: ownedByUser(id, userId) });
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
