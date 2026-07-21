import { ReviewStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import { scoringService } from "../scoring/scoring.service.js";
import { adminModerationRepository } from "./adminModeration.repository.js";

export const adminModerationService = {
  async listReviews(query: unknown) {
    const pagination = getPagination(query);
    const filters = query as { status?: ReviewStatus; loanAppId?: string };
    const result = await adminModerationRepository.findReviews({
      skip: pagination.skip,
      take: pagination.take,
      status: filters.status,
      loanAppId: filters.loanAppId,
    });
    return paginatedResponse(result.items, result.total, pagination.page, pagination.limit);
  },

  async getReview(id: string) {
    const review = await adminModerationRepository.findReviewById(id);
    if (!review) throw new AppError("Review not found", 404);
    return review;
  },

  async approve(input: { id: string; status: "PUBLISHED" | "PARTIALLY_PUBLISHED"; publicBody?: string; reason?: string; actorId?: string }) {
    const before = await this.getReview(input.id);
    const isPartial = input.status === "PARTIALLY_PUBLISHED";
    const updated = await adminModerationRepository.updateReview({
      id: input.id,
      allowedCurrentStatuses: [ReviewStatus.SUBMITTED, ReviewStatus.UNDER_MODERATION, ReviewStatus.NEEDS_MORE_INFO, ReviewStatus.ESCALATED],
      status: input.status === "PUBLISHED" ? ReviewStatus.PUBLISHED : ReviewStatus.PARTIALLY_PUBLISHED,
      publicBody: input.publicBody ?? before.publicBody,
      redactionsApplied: isPartial ? true : before.redactionsApplied,
      publishedAt: before.publishedAt ?? new Date(),
    });
    if (!updated) throw new AppError("Review cannot be approved from its current status", 409);
    await this.afterModerationAction({
      actorId: input.actorId,
      action: "review.approved",
      targetId: updated.id,
      before,
      after: updated,
      reason: input.reason,
      loanAppId: updated.loanAppId,
    });
    return updated;
  },

  async reject(input: { id: string; reason: string; actorId?: string }) {
    const before = await this.getReview(input.id);
    const updated = await adminModerationRepository.updateReview({
      id: input.id,
      allowedCurrentStatuses: [ReviewStatus.SUBMITTED, ReviewStatus.UNDER_MODERATION, ReviewStatus.NEEDS_MORE_INFO, ReviewStatus.ESCALATED],
      status: ReviewStatus.REJECTED,
      publishedAt: null,
    });
    if (!updated) throw new AppError("Review cannot be rejected from its current status", 409);
    await this.afterModerationAction({
      actorId: input.actorId,
      action: "review.rejected",
      targetId: updated.id,
      before,
      after: updated,
      reason: input.reason,
      loanAppId: updated.loanAppId,
    });
    return updated;
  },

  async requestInfo(input: { id: string; reason?: string; actorId?: string }) {
    const before = await this.getReview(input.id);
    const updated = await adminModerationRepository.updateReview({
      id: input.id,
      allowedCurrentStatuses: [ReviewStatus.SUBMITTED, ReviewStatus.UNDER_MODERATION, ReviewStatus.ESCALATED],
      status: ReviewStatus.NEEDS_MORE_INFO,
    });
    if (!updated) throw new AppError("More information cannot be requested from the review's current status", 409);
    await this.afterModerationAction({
      actorId: input.actorId,
      action: "review.request_info",
      targetId: updated.id,
      before,
      after: updated,
      reason: input.reason,
      loanAppId: updated.loanAppId,
    });
    return updated;
  },

  async redact(input: { id: string; publicBody: string; reason?: string; actorId?: string }) {
    const before = await this.getReview(input.id);
    const updated = await adminModerationRepository.updateReview({
      id: input.id,
      allowedCurrentStatuses: [ReviewStatus.SUBMITTED, ReviewStatus.UNDER_MODERATION, ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED],
      status: ReviewStatus.PARTIALLY_PUBLISHED,
      publicBody: input.publicBody,
      redactionsApplied: true,
      publishedAt: before.publishedAt ?? new Date(),
    });
    if (!updated) throw new AppError("Review cannot be redacted from its current status", 409);
    await this.afterModerationAction({
      actorId: input.actorId,
      action: "review.redacted",
      targetId: updated.id,
      before,
      after: updated,
      reason: input.reason,
      loanAppId: updated.loanAppId,
    });
    return updated;
  },

  async afterModerationAction(input: {
    actorId?: string;
    action: string;
    targetId: string;
    before: unknown;
    after: unknown;
    reason?: string;
    loanAppId: string;
  }) {
    await auditLog({
      actorId: input.actorId,
      action: input.action,
      targetType: "Review",
      targetId: input.targetId,
      beforeJson: input.before,
      afterJson: input.after,
      reason: input.reason,
    });
    await scoringService.recalculateLoanAppPublicMetrics(input.loanAppId);
  },
};
