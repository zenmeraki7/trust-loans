"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { CompareLoanApp } from "@/types/compareLoanApps";

type CompareLoanAppsResponse = {
  items: CompareLoanApp[];
  insights?: string[];
};

export function useCompareLoanApps(ids: string[] = []) {
  return useQuery({
    queryKey: queryKeys.compareLoanApps(ids),
    queryFn: () => {
      const params = new URLSearchParams();
      if (ids.length > 0) params.set("ids", ids.join(","));
      const query = params.toString();
      return apiClient<CompareLoanAppsResponse>(`/api/compare${query ? `?${query}` : ""}`);
    },
  });
}
