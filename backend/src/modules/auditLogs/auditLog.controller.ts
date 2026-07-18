import type { Request, Response } from "express";
import { toAuditLogDto } from "./auditLog.dto.js";
import { auditLogService } from "./auditLog.service.js";

export const auditLogController = {
  async list(req: Request, res: Response) {
    const result = await auditLogService.list(req.query);
    res.json({ ...result, items: result.items.map(toAuditLogDto) });
  },

  async getById(req: Request, res: Response) {
    const log = await auditLogService.getById(req.params.id);
    res.json(toAuditLogDto(log));
  },
};

