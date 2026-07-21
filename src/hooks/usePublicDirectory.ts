"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { PublicDirectoryResponse } from "@/types/publicDirectory";

const toSearchParams = (filters: Record<string, unknown>) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
};

export function usePublicDirectory(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.publicDirectory(filters),
    queryFn: () => {
      const query = toSearchParams(filters);
      return apiClient<PublicDirectoryResponse>(`/api/directory${query ? `?${query}` : ""}`);
    },
  });
}
