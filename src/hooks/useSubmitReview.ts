"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { SubmitReviewResponse } from "@/types/apiDtos";
import type { ReviewSubmission } from "@/types/reviewSubmission";

const reviewTypeMap: Record<ReviewSubmission["reviewType"], string> = {
  general_review: "GENERAL_REVIEW",
  harassment_recovery: "HARASSMENT_COMPLAINT",
  hidden_charges: "HIDDEN_CHARGES",
  data_privacy: "DATA_PRIVACY",
  photo_morphing_threat: "PHOTO_MORPHING_THREAT",
  fake_legal_notice_impersonation: "FAKE_LEGAL_NOTICE",
  payment_issue: "PAYMENT_ISSUE",
  app_not_closing_loan: "LOAN_CLOSURE_ISSUE",
  positive_experience: "POSITIVE_EXPERIENCE",
};

const displayModeMap: Record<ReviewSubmission["privacy"]["displayMode"], string> = {
  anonymous: "ANONYMOUS",
  first_name_only: "FIRST_NAME_ONLY",
  verified_badge_only: "VERIFIED_BADGE_ONLY",
};

export function toReviewApiPayload(payload: ReviewSubmission) {
  return {
    loanAppId: payload.appId,
    title: payload.title,
    body: payload.body,
    rating: payload.rating.overall,
    reviewType: reviewTypeMap[payload.reviewType],
    displayMode: displayModeMap[payload.privacy.displayMode],
    incidentDate: payload.incidentDate || undefined,
    loanAmountRange: payload.loanAmountRange || undefined,
    tags: payload.tags,
    evidenceSubmitted: payload.evidenceFiles.length > 0,
  };
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSubmission) =>
      apiClient<SubmitReviewResponse>("/api/reviews", {
        method: "POST",
        body: toReviewApiPayload(payload),
      }),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["loanApps"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.appReviews(payload.appId) });
    },
  });
}
