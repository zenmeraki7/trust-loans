import { ReviewStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { CreateReviewInput, ReportReviewInput } from "./review.validators.js";

export const reviewRepository = {
  create(userId: string, input: CreateReviewInput) {
    return prisma.review.create({
      data: {
        loanAppId: input.loanAppId,
        userId,
        title: input.title,
        body: input.body,
        rating: input.rating,
        reviewType: input.reviewType,
        displayMode: input.displayMode,
        incidentDate: input.incidentDate,
        loanAmountRange: input.loanAmountRange,
        tags: input.tags,
        evidenceSubmitted: false,
        status: ReviewStatus.SUBMITTED,
      },
    });
  },

  findPublicById(id: string) {
    return prisma.review.findFirst({
      where: {
        id,
        status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] },
      },
      include: { companyResponses: { where: { status: "APPROVED" } } },
    });
  },

  async incrementHelpfulPublic(id: string) {
    const result = await prisma.review.updateMany({
      where: { id, status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] } },
      data: { helpfulCount: { increment: 1 } },
    });
    if (result.count !== 1) return null;
    return this.findPublicById(id);
  },

  createReport(input: ReportReviewInput & { reporterUserId?: string }) {
    return prisma.reviewReport.create({
      data: {
        reviewId: input.reviewId,
        reporterUserId: input.reporterUserId,
        reason: input.reason,
        note: input.note,
      },
    });
  },
};
