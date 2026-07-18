"use client";

import NotificationCenterPage from "@/components/notifications/NotificationCenterPage";
import { useNotificationCenter } from "@/hooks/useNotifications";

export default function NotificationCenterRoute() {
  const query = useNotificationCenter();

  if (query.isLoading) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">Loading notifications...</main>;
  if (query.isError) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-rose-700">Unable to load notifications from the API.</main>;
  if (!query.data) return <main className="min-h-screen bg-slate-100 p-6 text-sm text-slate-600">No notifications found.</main>;

  return <NotificationCenterPage data={query.data} />;
}
