"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { CompareLoanApp } from "@/types/compareLoanApps";

type CompareLoanAppsResponse = {
  items: CompareLoanApp[];
  insights?: string[];
};

export function useCompareLoanApps(ids: string[] = [], filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.compareLoanApps(ids, filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (ids.length > 0) params.set("ids", ids.join(","));
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "all" || value === "any") return;
        params.set(key, String(value));
      });
      const query = params.toString();
      return apiClient<CompareLoanAppsResponse>(`/api/compare${query ? `?${query}` : ""}`);
    },
  });
}
