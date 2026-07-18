"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { EntityProfileData } from "@/types/entityProfile";

export type CompanyDirectoryItem = Pick<
  EntityProfileData,
  "id" | "slug" | "name" | "displayName" | "entityType" | "verificationStatus" | "riskSignalLevel" | "totalLinkedApps" | "totalReviewsAcrossApps"
>;

type CompanyDirectoryResponse = {
  items: CompanyDirectoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => apiClient<CompanyDirectoryResponse>("/api/companies"),
  });
}
