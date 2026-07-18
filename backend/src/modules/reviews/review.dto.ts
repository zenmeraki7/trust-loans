import type { CompanyResponse, Review } from "@prisma/client";

type PublicReview = Review & { companyResponses?: CompanyResponse[] };

const publicReviewBody = (review: Review) => {
  if (review.publicBody) return review.publicBody;
  if (review.status === "PUBLISHED" && !review.redactionsApplied) return review.body;
  return "This review text is not fully public because moderation or privacy review may apply.";
};

export const toPublicReviewDto = (review: PublicReview) => ({
  id: review.id,
  loanAppId: review.loanAppId,
  title: review.title,
  body: publicReviewBody(review),
  rating: review.rating,
  reviewType: review.reviewType,
  status: review.status,
  displayMode: review.displayMode,
  incidentDate: review.incidentDate,
  loanAmountRange: review.loanAmountRange,
  tags: review.tags,
  evidenceSubmitted: review.evidenceSubmitted,
  redactionsApplied: review.redactionsApplied,
  helpfulCount: review.helpfulCount,
  publishedAt: review.publishedAt,
  createdAt: review.createdAt,
  companyResponses: review.companyResponses?.map((response) => ({
    id: response.id,
    companyName: response.companyName,
    body: response.body,
    category: response.category,
    createdAt: response.createdAt,
  })),
  safetyNote: "This is a user-submitted review. It is not a legal finding.",
});

export const toSubmittedReviewDto = (review: Review) => ({
  id: review.id,
  status: review.status,
  message: "Review submitted for moderation. It is not public until reviewed.",
  createdAt: review.createdAt,
});

