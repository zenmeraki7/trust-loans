import { AppError } from "../../utils/AppError.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import { auditLogRepository } from "./auditLog.repository.js";

export const auditLogService = {
  async list(query: unknown) {
    const pagination = getPagination(query);
    const filters = query as { actorId?: string; targetType?: string; targetId?: string; action?: string };
    const result = await auditLogRepository.findMany({
      skip: pagination.skip,
      take: pagination.take,
      actorId: filters.actorId,
      targetType: filters.targetType,
      targetId: filters.targetId,
      action: filters.action,
    });
    return paginatedResponse(result.items, result.total, pagination.page, pagination.limit);
  },

  async getById(id: string) {
    const log = await auditLogRepository.findById(id);
    if (!log) throw new AppError("Audit log not found", 404);
    return log;
  },
};

