"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, canUseDevFallback } from "@/lib/apiClient";
import { mapApiReviewToReview } from "@/lib/apiMappers";
import { queryKeys } from "@/lib/queryKeys";
import { reviews as fallbackReviews } from "@/data/mockLoanAppProfile";
import { apiReviewSchema, paginatedMetaSchema, type ApiReview, type PaginatedResponse } from "@/types/apiDtos";

export function useAppReviews(appId: string, filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.appReviews(appId, filters),
    enabled: Boolean(appId),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
      });
      try {
        const response = await apiClient<(PaginatedResponse<ApiReview> & { count?: number; reviews?: ApiReview[] })>(
          `/api/apps/${appId}/reviews${params.size ? `?${params}` : ""}`,
        );
        const items = response.items ?? response.reviews ?? [];
        const meta = response.meta ?? { total: response.count ?? items.length, page: 1, limit: items.length, totalPages: 1 };
        return {
          items: items.map((item) => mapApiReviewToReview(apiReviewSchema.parse(item))),
          meta: paginatedMetaSchema.parse(meta),
          source: "api" as const,
        };
      } catch (error) {
        if (!canUseDevFallback(error)) throw error;
        return {
          items: fallbackReviews,
          meta: { total: fallbackReviews.length, page: 1, limit: fallbackReviews.length, totalPages: 1 },
          source: "fallback" as const,
        };
      }
    },
  });
}
