"use client";

import AdminLoanAppDatabasePage from "@/components/admin/AdminLoanAppDatabasePage";
import { useAdminLoanAppDatabase } from "@/hooks/useAdminDashboards";

export default function AdminLoanAppDatabaseRoute() {
  const query = useAdminLoanAppDatabase();

  if (query.isLoading) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">Loading loan app database...</main>;
  if (query.isError) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-rose-700">Unable to load loan app database from the API.</main>;
  if (!query.data) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">No loan app records found.</main>;

  return <AdminLoanAppDatabasePage data={query.data} />;
}
