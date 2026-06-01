"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, canUseDevFallback } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import { publicReviewDetail as fallbackReviewDetail } from "@/data/mockPublicReviewDetail";
import { apiReviewSchema, type ApiReview } from "@/types/apiDtos";
import type { PublicReviewDetailData } from "@/types/publicReviewDetail";

const mapApiReviewToDetail = (review: ApiReview): PublicReviewDetailData => ({
  ...fallbackReviewDetail,
  id: review.id,
  title: review.title,
  body: review.body,
  rating: review.rating,
  linkedApp: {
    ...fallbackReviewDetail.linkedApp,
    id: review.loanAppId ?? "",
    slug: review.loanAppId ?? "",
    name: "Linked loan app",
    logoUrl: "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
    developerName: "Under verification",
    companyName: "Under verification",
    claimedNbfcPartner: "Under verification",
    profileUrl: review.loanAppId ? `/loan-apps/${review.loanAppId}` : "/loan-apps",
  },
  metadata: {
    ...fallbackReviewDetail.metadata,
    publishedAt: String(review.publishedAt ?? review.createdAt ?? ""),
    helpfulCount: review.helpfulCount,
    evidenceSubmitted: Boolean(review.evidenceSubmitted),
    evidencePublic: false,
    redactionsApplied: Boolean(review.redactionsApplied),
  },
  incident: {
    ...fallbackReviewDetail.incident,
    category: review.reviewType ?? fallbackReviewDetail.incident.category,
    loanAmountRange: review.loanAmountRange ?? fallbackReviewDetail.incident.loanAmountRange,
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
    : { ...fallbackReviewDetail.companyResponse, exists: false },
});

export function useReviewDetail(reviewId: string) {
  return useQuery({
    queryKey: queryKeys.reviewDetail(reviewId),
    enabled: Boolean(reviewId),
    queryFn: async () => {
      try {
        const review = apiReviewSchema.parse(await apiClient<ApiReview>(`/api/reviews/${reviewId}`));
        return { data: mapApiReviewToDetail(review), source: "api" as const };
      } catch (error) {
        if (!canUseDevFallback(error)) throw error;
        return { data: { ...fallbackReviewDetail, id: reviewId }, source: "fallback" as const };
      }
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
