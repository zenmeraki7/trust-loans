"use client";

import { useMemo, useState } from "react";
import type { NotificationCenterData, NotificationPriority, NotificationType } from "@/types/notificationCenter";

const tabs = ["all", "reviews", "reports", "company_responses", "evidence", "corrections", "privacy_alerts", "watchlist", "admin_alerts"] as const;

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function typeToTab(type: NotificationType) {
  if (type === "review_status") return "reviews";
  if (type === "report_update") return "reports";
  if (type === "company_response") return "company_responses";
  if (type === "evidence_update") return "evidence";
  if (type === "correction_update") return "corrections";
  if (type === "privacy_alert") return "privacy_alerts";
  if (type === "watchlist_update") return "watchlist";
  return "admin_alerts";
}

export function NotificationPriorityBadge({ priority }: { priority: NotificationPriority }) {
  const cls = priority === "high" ? "bg-rose-100 text-rose-700" : priority === "normal" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{formatLabel(priority)}</span>;
}

export function NotificationTypeIcon({ type }: { type: NotificationType }) {
  const icon = type === "review_status" ? "RV" : type === "report_update" ? "RP" : type === "company_response" ? "CR" : type === "evidence_update" ? "EV" : type === "correction_update" ? "CO" : type === "privacy_alert" ? "PR" : type === "watchlist_update" ? "WL" : "AL";
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700" aria-hidden>{icon}</span>;
}

export function NotificationHeader({ onMarkAllRead, onClearFilters }: { onMarkAllRead: () => void; onClearFilters: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
      <p className="text-sm text-slate-600">Track updates about your reviews, reports, responses, corrections, and safety alerts.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onMarkAllRead} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Mark all as read</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Notification settings</button>
        <button onClick={onClearFilters} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button>
      </div>
    </section>
  );
}

export function NotificationTabs({ active, onChange, counts }: { active: string; onChange: (value: string) => void; counts: Record<string, number> }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => onChange(tab)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${active === tab ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>
            {formatLabel(tab)}
            <span className="ml-1 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700">{counts[tab] ?? 0}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function NotificationFilters({ filters, onChange }: { filters: NotificationCenterData["filters"]; onChange: (next: NotificationCenterData["filters"]) => void }) {
  const patch = (key: keyof NotificationCenterData["filters"], value: string | boolean | { from: string; to: string }) => onChange({ ...filters, [key]: value });
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.status} onChange={(e) => patch("status", e.target.value)}>
          <option value="">Read / unread</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.type} onChange={(e) => patch("type", e.target.value)}>
          <option value="">Notification type</option>
          <option value="review_status">Review status</option>
          <option value="report_update">Reports</option>
          <option value="company_response">Company responses</option>
          <option value="evidence_update">Evidence</option>
          <option value="correction_update">Corrections</option>
          <option value="privacy_alert">Privacy alerts</option>
          <option value="watchlist_update">Watchlist</option>
          <option value="admin_alert">Admin alerts</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.priority} onChange={(e) => patch("priority", e.target.value)}>
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input type="date" className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.dateRange.from} onChange={(e) => patch("dateRange", { ...filters.dateRange, from: e.target.value })} />
        <input type="date" className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.dateRange.to} onChange={(e) => patch("dateRange", { ...filters.dateRange, to: e.target.value })} />
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Related app ID" value={filters.relatedAppId} onChange={(e) => patch("relatedAppId", e.target.value)} />
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700">
        <input type="checkbox" checked={filters.roleScopedOnly} onChange={(e) => patch("roleScopedOnly", e.target.checked)} />
        Role-specific notifications only
      </label>
    </section>
  );
}

export function NotificationCard({ notification, onToggleRead }: { notification: NotificationCenterData["notifications"][number]; onToggleRead: (id: string) => void }) {
  return (
    <article className={`rounded-xl border p-4 shadow-sm ${notification.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/30"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1"><NotificationTypeIcon type={notification.type} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
            <NotificationPriorityBadge priority={notification.priority} />
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{notification.read ? "Read" : "Unread"}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
          <p className="mt-2 text-xs text-slate-500">{notification.relatedItem.title} | {notification.app.name} | {notification.createdAt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={notification.ctaUrl} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">{notification.ctaLabel}</a>
            <button onClick={() => onToggleRead(notification.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Mark as {notification.read ? "unread" : "read"}</button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EmptyNotificationsState() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="font-semibold text-slate-900">You have no notifications yet.</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <a href="/loan-apps" className="rounded border border-slate-300 px-3 py-2 text-xs">Browse loan apps</a>
        <a href="/loan-apps/app-cashnest/submit-review" className="rounded border border-slate-300 px-3 py-2 text-xs">Submit a review</a>
        <a href="/dashboard" className="rounded border border-slate-300 px-3 py-2 text-xs">View dashboard</a>
      </div>
    </section>
  );
}

export function NotificationList({ items, onToggleRead }: { items: NotificationCenterData["notifications"]; onToggleRead: (id: string) => void }) {
  if (!items.length) return <EmptyNotificationsState />;
  return <section className="space-y-3">{items.map((item) => <NotificationCard key={item.id} notification={item} onToggleRead={onToggleRead} />)}</section>;
}

export function NotificationSettingsPanel({ settings, onChange }: { settings: NotificationCenterData["settings"]; onChange: (next: NotificationCenterData["settings"]) => void }) {
  const toggle = (key: keyof NotificationCenterData["settings"]) => onChange({ ...settings, [key]: !settings[key] });
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Notification settings</h2>
      <div className="mt-3 space-y-2 text-xs text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.emailEnabled} onChange={() => toggle("emailEnabled")} />Email notifications</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.inAppEnabled} onChange={() => toggle("inAppEnabled")} />In-app notifications</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.reviewUpdates} onChange={() => toggle("reviewUpdates")} />Review status updates</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.companyResponses} onChange={() => toggle("companyResponses")} />Company response alerts</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.correctionUpdates} onChange={() => toggle("correctionUpdates")} />Correction updates</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.privacyAlerts} onChange={() => toggle("privacyAlerts")} />Privacy issue updates</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.savedAppAlerts} onChange={() => toggle("savedAppAlerts")} />Saved app alerts</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.adminOperationalAlerts} onChange={() => toggle("adminOperationalAlerts")} />Admin operational alerts</label>
      </div>
    </aside>
  );
}

export default function NotificationCenterPage({ data }: { data: NotificationCenterData }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState(data.filters);
  const [settings, setSettings] = useState(data.settings);
  const [notifications, setNotifications] = useState(data.notifications);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: notifications.length };
    tabs.slice(1).forEach((tab) => {
      map[tab] = notifications.filter((n) => typeToTab(n.type) === tab).length;
    });
    return map;
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab !== "all" && typeToTab(n.type) !== activeTab) return false;
      if (filters.status === "read" && !n.read) return false;
      if (filters.status === "unread" && n.read) return false;
      if (filters.type && n.type !== filters.type) return false;
      if (filters.priority && n.priority !== filters.priority) return false;
      if (filters.relatedAppId && !n.app.id.toLowerCase().includes(filters.relatedAppId.toLowerCase())) return false;
      if (filters.roleScopedOnly && !n.roles.includes(data.currentRole)) return false;
      if (filters.dateRange.from && n.createdAt.slice(0, 10) < filters.dateRange.from) return false;
      if (filters.dateRange.to && n.createdAt.slice(0, 10) > filters.dateRange.to) return false;
      return true;
    });
  }, [activeTab, data.currentRole, filters, notifications]);

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearFilters = () => {
    setFilters({ ...data.filters, dateRange: { from: "", to: "" } });
    setActiveTab("all");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] min-w-0 space-y-4">
        <NotificationHeader onMarkAllRead={markAllRead} onClearFilters={clearFilters} />
        <NotificationTabs active={activeTab} onChange={setActiveTab} counts={counts} />
        <NotificationFilters filters={filters} onChange={setFilters} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <NotificationList items={filtered} onToggleRead={toggleRead} />
          <NotificationSettingsPanel settings={settings} onChange={setSettings} />
        </div>
      </div>
    </main>
  );
}
