"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { UserDashboardData } from "@/types/userDashboard";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";

export function useUserDashboard() {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => apiClient<UserDashboardData>("/api/me/dashboard", { userId: DEV_USER_ID, userRole: "USER" }),
  });
}
