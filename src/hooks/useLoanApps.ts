"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, canUseDevFallback } from "@/lib/apiClient";
import { mapApiLoanAppToDirectoryItem } from "@/lib/apiMappers";
import { queryKeys } from "@/lib/queryKeys";
import { loanApps as fallbackLoanApps } from "@/data/mockLoanAppsDirectory";
import { apiLoanAppSchema, paginatedMetaSchema, type ApiLoanApp, type PaginatedResponse } from "@/types/apiDtos";
import type { LoanAppDirectoryItem } from "@/types/loanAppsDirectory";

type LoanAppsResponse = {
  items: LoanAppDirectoryItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  source: "api" | "fallback";
};

const toSearchParams = (filters: Record<string, unknown>) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, String(entry)));
      return;
    }
    params.set(key, String(value));
  });
  return params.toString();
};

export function useLoanApps(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.loanApps(filters),
    queryFn: async () => {
      const query = toSearchParams(filters);
      try {
        const response = await apiClient<PaginatedResponse<ApiLoanApp> & { count?: number }>(`/api/apps${query ? `?${query}` : ""}`);
        const meta = response.meta ?? { total: response.count ?? response.items.length, page: 1, limit: response.items.length, totalPages: 1 };
        return {
          items: response.items.map((item) => mapApiLoanAppToDirectoryItem(apiLoanAppSchema.parse(item))),
          meta: paginatedMetaSchema.parse(meta),
          source: "api" as const,
        };
      } catch (error) {
        if (!canUseDevFallback(error)) throw error;
        return {
          items: fallbackLoanApps,
          meta: { total: fallbackLoanApps.length, page: 1, limit: fallbackLoanApps.length, totalPages: 1 },
          source: "fallback" as const,
        };
      }
    },
  });
}
