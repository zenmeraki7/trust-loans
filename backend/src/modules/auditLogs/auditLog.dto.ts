import type { AuditLog } from "@prisma/client";

export const toAuditLogDto = (log: AuditLog) => ({
  id: log.id,
  actorId: log.actorId,
  action: log.action,
  targetType: log.targetType,
  targetId: log.targetId,
  beforeJson: log.beforeJson,
  afterJson: log.afterJson,
  reason: log.reason,
  createdAt: log.createdAt,
});

