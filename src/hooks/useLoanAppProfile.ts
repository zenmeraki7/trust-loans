"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, canUseDevFallback } from "@/lib/apiClient";
import { mapApiLoanAppToProfile } from "@/lib/apiMappers";
import { queryKeys } from "@/lib/queryKeys";
import { appProfile } from "@/data/mockLoanAppProfile";
import { apiLoanAppSchema, type ApiLoanApp } from "@/types/apiDtos";

export function useLoanAppProfile(slug: string) {
  return useQuery({
    queryKey: queryKeys.loanAppProfile(slug),
    queryFn: async () => {
      try {
        const app = apiLoanAppSchema.parse(await apiClient<ApiLoanApp>(`/api/apps/${slug}`));
        return { app: mapApiLoanAppToProfile(app), source: "api" as const };
      } catch (error) {
        if (!canUseDevFallback(error)) throw error;
        return { app: { ...appProfile, id: slug }, source: "fallback" as const };
      }
    },
    enabled: Boolean(slug),
  });
}
