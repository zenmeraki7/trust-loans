"use client";

import AdminCorrectionDisputeQueuePage from "@/components/admin/AdminCorrectionDisputeQueuePage";
import { useAdminCorrectionDisputeQueue } from "@/hooks/useAdminDashboards";

export default function AdminCorrectionDisputeQueueRoute() {
  const query = useAdminCorrectionDisputeQueue();

  if (query.isLoading) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">Loading corrections queue...</main>;
  if (query.isError) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-rose-700">Unable to load corrections queue from the API.</main>;
  if (!query.data) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">No correction requests found.</main>;

  return <AdminCorrectionDisputeQueuePage data={query.data} />;
}
