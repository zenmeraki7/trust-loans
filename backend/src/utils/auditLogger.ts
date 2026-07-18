import { prisma } from "../prisma/client.js";

type AuditLogInput = {
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
  reason?: string;
};

export const auditLog = async (input: AuditLogInput) => {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      beforeJson: input.beforeJson === undefined ? undefined : JSON.parse(JSON.stringify(input.beforeJson)),
      afterJson: input.afterJson === undefined ? undefined : JSON.parse(JSON.stringify(input.afterJson)),
      reason: input.reason,
    },
  });
};

