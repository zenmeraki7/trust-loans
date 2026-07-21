import type { Request, Response } from "express";
import { toAuditLogDto } from "./auditLog.dto.js";
import { auditLogService } from "./auditLog.service.js";
import { observeDatabaseRead } from "../../security/securityMonitoring.js";

export const auditLogController = {
  async list(req: Request, res: Response) {
    const result = await auditLogService.list(req.query);
    await observeDatabaseRead({ actorId: req.user!.id, requestId: req.requestId, resourceType: "AuditLog", rowCount: result.items.length });
    res.json({ ...result, items: result.items.map(toAuditLogDto) });
  },

  async getById(req: Request, res: Response) {
    const log = await auditLogService.getById(req.params.id);
    res.json(toAuditLogDto(log));
  },
};
