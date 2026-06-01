"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";

export function useReviewSafetyScan() {
  return useMutation({
    mutationFn: (input: { title: string; body: string; tags: string[]; reviewType: string }) =>
      apiClient<ReviewSafetyScanResponse>("/api/reviews/safety-scan", { method: "POST", body: input }),
  });
}
