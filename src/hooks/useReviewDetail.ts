"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import { apiReviewSchema, type ApiReview } from "@/types/apiDtos";
import type { PublicReviewDetailData } from "@/types/publicReviewDetail";

const defaultCompanyResponse: PublicReviewDetailData["companyResponse"] = {
  exists: false,
  companyName: "",
  verifiedCompany: false,
  responseDate: "",
  responseCategory: "general_statement",
  body: "",
  officialContactChannel: "",
};

const reportReasons: PublicReviewDetailData["reportReasons"] = [
  { id: "private_information", label: "Contains private information" },
  { id: "abusive_or_threatening", label: "Abusive or threatening content" },
  { id: "not_personal_experience", label: "Not based on personal experience" },
  { id: "spam_or_duplicate", label: "Spam or duplicate review" },
  { id: "other", label: "Other policy concern" },
];

const mapApiReviewToDetail = (review: ApiReview): PublicReviewDetailData => ({
  id: review.id,
  title: review.title,
  body: review.body,
  rating: review.rating,
  reviewer: {
    displayName: review.displayMode === "FIRST_NAME_ONLY" ? "Reviewer" : "Anonymous reviewer",
    displayMode: review.displayMode === "FIRST_NAME_ONLY" ? "first_name_only" : "anonymous",
    verificationBadge: "unverified_review",
  },
  linkedApp: {
    id: review.loanAppId ?? "",
    slug: review.loanAppId ?? "",
    name: "Linked loan app",
    logoUrl: "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
    developerName: "Under verification",
    companyName: "Under verification",
    claimedNbfcPartner: "Under verification",
    trustScore: 0,
    averageRating: 0,
    reviewCount: 0,
    riskLevel: "medium",
    profileUrl: review.loanAppId ? `/loan-apps/${review.loanAppId}` : "/loan-apps",
  },
  metadata: {
    publishedAt: String(review.publishedAt ?? review.createdAt ?? ""),
    experienceDate: review.incidentDate ? String(review.incidentDate) : "",
    reviewStatus: review.redactionsApplied ? "partially_redacted" : "published",
    helpfulCount: review.helpfulCount,
    evidenceSubmitted: Boolean(review.evidenceSubmitted),
    evidencePublic: false,
    redactionsApplied: Boolean(review.redactionsApplied),
    publicModerationNote: review.safetyNote ?? "This public review is moderated for privacy and safety.",
  },
  incident: {
    category: review.reviewType ?? "GENERAL_REVIEW",
    loanAmountRange: review.loanAmountRange ?? "",
    tags: review.tags,
  },
  relatedReviews: [],
  similarComplaintPatterns: review.tags.map((tag) => ({ tag, mentionPercent: 0 })),
  companyResponse: review.companyResponses?.[0]
    ? {
        exists: true,
        companyName: review.companyResponses[0].companyName,
        verifiedCompany: true,
        responseDate: String(review.companyResponses[0].createdAt),
        responseCategory: review.companyResponses[0].category.toLowerCase() as PublicReviewDetailData["companyResponse"]["responseCategory"],
        body: review.companyResponses[0].body,
        officialContactChannel: "Published company response",
      }
    : defaultCompanyResponse,
  reportReasons,
});

export function useReviewDetail(reviewId: string) {
  return useQuery({
    queryKey: queryKeys.reviewDetail(reviewId),
    enabled: Boolean(reviewId),
    queryFn: async () => {
      const review = apiReviewSchema.parse(await apiClient<ApiReview>(`/api/reviews/${reviewId}`));
      return { data: mapApiReviewToDetail(review), source: "api" as const };
    },
  });
}

export function useMarkReviewHelpful(reviewId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient<{ id: string; helpfulCount: number }>(`/api/reviews/${reviewId}/helpful`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reviewDetail(reviewId) }),
  });
}

export function useReportReview(reviewId: string) {
  return useMutation({
    mutationFn: (reason: string) =>
      apiClient<{ id: string; reviewId: string; reason: string; status: string; message: string }>("/api/reports", {
        method: "POST",
        body: { reviewId, reason },
      }),
  });
}
