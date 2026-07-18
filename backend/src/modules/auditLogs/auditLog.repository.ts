import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

export const auditLogRepository = {
  async findMany(input: {
    skip: number;
    take: number;
    actorId?: string;
    targetType?: string;
    targetId?: string;
    action?: string;
  }) {
    const where: Prisma.AuditLogWhereInput = {
      actorId: input.actorId,
      targetType: input.targetType,
      targetId: input.targetId,
      action: input.action,
    };
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.auditLog.findUnique({ where: { id } });
  },
};

