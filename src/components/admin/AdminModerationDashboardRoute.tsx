"use client";

import AdminModerationDashboardPage from "@/components/admin/AdminModerationDashboardPage";
import { useAdminModerationDashboard } from "@/hooks/useAdminDashboards";

export default function AdminModerationDashboardRoute() {
  const query = useAdminModerationDashboard();

  if (query.isLoading) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">Loading moderation dashboard...</main>;
  if (query.isError) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-rose-700">Unable to load moderation dashboard from the API.</main>;
  if (!query.data) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">No moderation records found.</main>;

  return <AdminModerationDashboardPage data={query.data} />;
}
