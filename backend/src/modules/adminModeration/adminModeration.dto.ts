import type { LoanApp, Review } from "@prisma/client";

type ModerationReview = Review & { loanApp?: Pick<LoanApp, "id" | "slug" | "name"> };

export const toModerationReviewListItemDto = (review: ModerationReview) => ({
  id: review.id,
  loanAppId: review.loanAppId,
  loanApp: review.loanApp
    ? {
        id: review.loanApp.id,
        slug: review.loanApp.slug,
        name: review.loanApp.name,
      }
    : null,
  title: review.title,
  rating: review.rating,
  reviewType: review.reviewType,
  status: review.status,
  displayMode: review.displayMode,
  tags: review.tags,
  evidenceSubmitted: review.evidenceSubmitted,
  redactionsApplied: review.redactionsApplied,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const toModerationReviewDetailDto = (review: ModerationReview) => ({
  ...toModerationReviewListItemDto(review),
  body: review.body,
  publicBody: review.publicBody,
  incidentDate: review.incidentDate,
  loanAmountRange: review.loanAmountRange,
  helpfulCount: review.helpfulCount,
  publishedAt: review.publishedAt,
  safetyNote: "Moderation actions should preserve factual wording, privacy, and user safety.",
});

