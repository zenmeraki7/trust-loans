import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { loanAppRepository } from "../loanApps/loanApp.repository.js";
import { reviewRepository } from "./review.repository.js";
import type { CreateReviewInput, ReportReviewInput } from "./review.validators.js";

export const reviewService = {
  async createReview(input: CreateReviewInput) {
    const app = await loanAppRepository.findById(input.loanAppId) ?? await loanAppRepository.findBySlug(input.loanAppId);
    if (!app) {
      throw new AppError("Loan app not found", 404);
    }

    const review = await reviewRepository.create({ ...input, loanAppId: app.id });
    await auditLog({
      actorId: input.userId,
      action: "review.submitted",
      targetType: "Review",
      targetId: review.id,
      afterJson: { status: review.status, loanAppId: review.loanAppId },
      reason: "User submitted review for moderation",
    });
    return review;
  },

  async getPublicReview(id: string) {
    const review = await reviewRepository.findPublicById(id);
    if (!review) {
      throw new AppError("Review not found or not public", 404);
    }
    return review;
  },

  async markHelpful(id: string) {
    const existing = await reviewRepository.findPublicById(id);
    if (!existing) {
      throw new AppError("Review not found or not public", 404);
    }
    const updated = await reviewRepository.incrementHelpful(id);
    await auditLog({
      action: "review.helpful",
      targetType: "Review",
      targetId: id,
      beforeJson: { helpfulCount: existing.helpfulCount },
      afterJson: { helpfulCount: updated.helpfulCount },
    });
    return updated;
  },

  async reportReview(input: ReportReviewInput & { reporterUserId?: string }) {
    const review = await reviewRepository.findById(input.reviewId);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    const report = await reviewRepository.createReport(input);
    await auditLog({
      actorId: input.reporterUserId,
      action: "review.reported",
      targetType: "Review",
      targetId: input.reviewId,
      afterJson: { reportId: report.id, reason: report.reason, status: report.status },
      reason: input.reason,
    });
    return report;
  },
};
