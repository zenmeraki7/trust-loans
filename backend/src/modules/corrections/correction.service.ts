import { CorrectionStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import { correctionRepository } from "./correction.repository.js";
import type { CreateCorrectionInput } from "./correction.validators.js";

export const correctionService = {
  async create(input: CreateCorrectionInput, actorId: string) {
    const correction = await correctionRepository.create(input, actorId);
    await auditLog({
      actorId,
      action: "correction.submitted",
      targetType: "CorrectionRequest",
      targetId: correction.id,
      afterJson: { status: correction.status, requestType: correction.requestType },
      reason: "Correction or dispute request submitted",
    });
    return correction;
  },

  async getById(id: string) {
    const correction = await correctionRepository.findByIdForAdmin(id);
    if (!correction) throw new AppError("Correction request not found", 404);
    return correction;
  },

  async getMine(id: string, requesterId?: string) {
    if (!requesterId) throw new AppError("Authentication required", 401);
    const correction = await correctionRepository.findByIdForRequester(id, requesterId);
    if (!correction) throw new AppError("Correction request not found", 404);
    return correction;
  },

  async listMine(query: unknown, requesterId?: string) {
    if (!requesterId) throw new AppError("Authentication required", 401);
    const pagination = getPagination(query);
    const result = await correctionRepository.findMany({
      skip: pagination.skip,
      take: pagination.take,
      requesterId,
    });
    return paginatedResponse(result.items, result.total, pagination.page, pagination.limit);
  },

  async listAdmin(query: unknown) {
    const pagination = getPagination(query);
    const filters = query as { status?: CorrectionStatus; requestType?: string };
    const result = await correctionRepository.findMany({
      skip: pagination.skip,
      take: pagination.take,
      status: filters.status,
      requestType: filters.requestType,
    });
    return paginatedResponse(result.items, result.total, pagination.page, pagination.limit);
  },

  async transition(id: string, status: CorrectionStatus, actorId?: string, reason?: string) {
    const before = await this.getById(id);
    const decisionStatuses = [CorrectionStatus.SUBMITTED, CorrectionStatus.UNDER_REVIEW, CorrectionStatus.MORE_INFORMATION_NEEDED, CorrectionStatus.ESCALATED];
    const triageStatuses = [CorrectionStatus.SUBMITTED, CorrectionStatus.UNDER_REVIEW, CorrectionStatus.MORE_INFORMATION_NEEDED];
    const isDecision = status === CorrectionStatus.ACCEPTED || status === CorrectionStatus.REJECTED;
    const updated = await correctionRepository.updateStatusForAdmin(id, isDecision ? decisionStatuses : triageStatuses, status);
    if (!updated) throw new AppError("Correction cannot be changed from its current status", 409);
    await auditLog({
      actorId,
      action: `correction.${status.toLowerCase()}`,
      targetType: "CorrectionRequest",
      targetId: id,
      beforeJson: { status: before.status },
      afterJson: { status: updated.status },
      reason,
    });
    return updated;
  },
};
