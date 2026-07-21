"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { UserDashboardData } from "@/types/userDashboard";

export function useUserDashboard() {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => apiClient<UserDashboardData>("/api/me/dashboard"),
  });
}
