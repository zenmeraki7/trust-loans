import { ReviewStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { CreateReviewInput } from "./review.validators.js";

export const reviewRepository = {
  create(input: CreateReviewInput) {
    return prisma.review.create({
      data: {
        loanAppId: input.loanAppId,
        userId: input.userId,
        title: input.title,
        body: input.body,
        rating: input.rating,
        reviewType: input.reviewType,
        displayMode: input.displayMode,
        incidentDate: input.incidentDate,
        loanAmountRange: input.loanAmountRange,
        tags: input.tags,
        evidenceSubmitted: input.evidenceSubmitted,
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

  findById(id: string) {
    return prisma.review.findUnique({ where: { id } });
  },

  incrementHelpful(id: string) {
    return prisma.review.update({
      where: { id },
      data: { helpfulCount: { increment: 1 } },
    });
  },

  updateStatus(input: { id: string; status: ReviewStatus; publicBody?: string | null; redactionsApplied?: boolean; publishedAt?: Date | null }) {
    return prisma.review.update({
      where: { id: input.id },
      data: {
        status: input.status,
        publicBody: input.publicBody,
        redactionsApplied: input.redactionsApplied,
        publishedAt: input.publishedAt,
      },
    });
  },
};
