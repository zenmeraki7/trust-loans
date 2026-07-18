"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { mapApiLoanAppToProfile } from "@/lib/apiMappers";
import { queryKeys } from "@/lib/queryKeys";
import { apiLoanAppSchema, type ApiLoanApp } from "@/types/apiDtos";

export function useLoanAppProfile(slug: string) {
  return useQuery({
    queryKey: queryKeys.loanAppProfile(slug),
    queryFn: async () => {
      const app = apiLoanAppSchema.parse(await apiClient<ApiLoanApp>(`/api/apps/${slug}`));
      return { app: mapApiLoanAppToProfile(app), source: "api" as const };
    },
    enabled: Boolean(slug),
  });
}
