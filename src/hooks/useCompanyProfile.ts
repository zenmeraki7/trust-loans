"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { EntityProfileData } from "@/types/entityProfile";

export function useCompanyProfile(slug: string) {
  return useQuery({
    queryKey: ["companyProfile", slug] as const,
    queryFn: () => apiClient<EntityProfileData>(`/api/companies/${slug}`),
    enabled: Boolean(slug),
  });
}
