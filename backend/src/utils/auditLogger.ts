import { prisma } from "../prisma/client.js";
import { emitSecurityAlert } from "../security/securityMonitoring.js";

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
  if (/role|membership\.(grant|revoke|suspend)/i.test(input.action)) {
    await emitSecurityAlert({
      type: "ROLE_CHANGE",
      severity: "HIGH",
      actorId: input.actorId,
      reasonCode: input.action.toUpperCase().replace(/[^A-Z0-9_]/g, "_"),
      attributes: { targetType: input.targetType, targetId: input.targetId },
    });
  }
};
