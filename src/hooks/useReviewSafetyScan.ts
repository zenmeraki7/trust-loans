"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";
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

type ReviewSafetyScanInput = {
  title: string;
  body: string;
  tags: string[];
  reviewType: ReviewSubmission["reviewType"];
};

export function useReviewSafetyScan() {
  return useMutation({
    mutationFn: (input: ReviewSafetyScanInput) =>
      apiClient<ReviewSafetyScanResponse>("/api/reviews/safety-scan", {
        method: "POST",
        body: { ...input, reviewType: reviewTypeMap[input.reviewType] },
      }),
  });
}
