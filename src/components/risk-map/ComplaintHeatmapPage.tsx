"use client";

import { useMemo, useState } from "react";
import type { ComplaintHeatmapData } from "@/types/complaintHeatmap";

function riskBadge(level: "low" | "medium" | "high") {
  if (level === "high") return "bg-rose-100 text-rose-700";
  if (level === "medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function HeatmapHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Loan app complaint risk map</h1>
      <p className="mt-1 text-sm text-slate-600">Explore aggregated user-reported complaint patterns by region and category.</p>
    </section>
  );
}

export function HeatmapFilters({
  filters,
  onChange,
}: {
  filters: ComplaintHeatmapData["filters"];
  onChange: (next: ComplaintHeatmapData["filters"]) => void;
}) {
  const patch = (key: keyof ComplaintHeatmapData["filters"], value: string | { from: string; to: string }) => onChange({ ...filters, [key]: value });
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
        <input value={filters.region} onChange={(e) => patch("region", e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Region/state/city" />
        <select value={filters.category} onChange={(e) => patch("category", e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-xs">
          <option value="">Category filter</option>
          <option>Harassment</option>
          <option>Hidden charges</option>
          <option>Data misuse</option>
          <option>Photo morphing threats</option>
          <option>Payment not updated</option>
          <option>Loan not closed</option>
        </select>
        <input type="date" value={filters.dateRange.from} onChange={(e) => patch("dateRange", { ...filters.dateRange, from: e.target.value })} className="rounded-lg border border-slate-300 px-2 py-2 text-xs" />
        <input type="date" value={filters.dateRange.to} onChange={(e) => patch("dateRange", { ...filters.dateRange, to: e.target.value })} className="rounded-lg border border-slate-300 px-2 py-2 text-xs" />
        <select value={filters.riskLevel} onChange={(e) => patch("riskLevel", e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-xs">
          <option value="">Risk level filter</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </section>
  );
}

export function IndiaRiskMapPlaceholder({
  regions,
  selected,
  onSelect,
}: {
  regions: ComplaintHeatmapData["regions"];
  selected: string;
  onSelect: (region: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Map Section</h2>
      <p className="text-xs text-slate-600">India map placeholder using region-level cards with privacy-safe aggregation.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {regions.map((r) => (
          <button
            key={r.region}
            onClick={() => !r.hiddenForPrivacy && onSelect(r.region)}
            className={`rounded-xl border p-3 text-left ${selected === r.region ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"} ${r.hiddenForPrivacy ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{r.region}</p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${riskBadge(r.riskLevel)}`}>{r.riskLevel}</span>
            </div>
            <p className="mt-1 text-xs">Reports: {r.hiddenForPrivacy ? "Hidden for privacy" : r.reportCount}</p>
            <p className="text-xs">Top category: {r.hiddenForPrivacy ? "Hidden" : r.topCategory}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function RegionalSummaryCards({ region, privacyHidden }: { region: ComplaintHeatmapData["selectedRegion"]; privacyHidden: boolean }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Regional Summary</h2>
      {privacyHidden ? (
        <p className="mt-2 text-sm text-slate-600">This region is hidden due to low sample size and privacy protection thresholds.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"><p className="text-slate-500">Total reports</p><p className="text-lg font-semibold text-slate-900">{region.totalReports}</p></article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"><p className="text-slate-500">Top category</p><p className="font-semibold text-slate-900">{region.topComplaintCategory}</p></article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"><p className="text-slate-500">Rising pattern</p><p className="font-semibold text-slate-900">{region.risingPattern}</p></article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"><p className="text-slate-500">Most reviewed apps</p><p className="font-semibold text-slate-900">{region.relatedApps.length}</p></article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"><p className="text-slate-500">Privacy threshold</p><p className="font-semibold text-slate-900">Protected</p></article>
        </div>
      )}
    </section>
  );
}

export function RegionalComplaintTrends({ trends }: { trends: ComplaintHeatmapData["categoryTrends"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Complaint Category Trends</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {trends.map((t) => (
          <article key={t.category} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{t.category}</p>
            <p className="mt-1 text-xs text-slate-600">Reports: {t.count}</p>
            <p className="text-xs text-slate-600">Trend: {t.trend}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className={`h-2 rounded-full ${t.trend === "up" ? "bg-rose-400" : t.trend === "stable" ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(100, Math.max(20, Math.floor(t.count / 20)))}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RegionalRelatedApps({ apps, hidden }: { apps: ComplaintHeatmapData["selectedRegion"]["relatedApps"]; hidden: boolean }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Related Apps</h2>
      {hidden ? (
        <p className="mt-2 text-sm text-slate-600">Related app breakdown is hidden for low-sample privacy protection.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((app) => (
            <article key={app.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded-lg border border-slate-200" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{app.name}</p>
                <p className="text-xs text-slate-600">Reports in region: {app.reportCount}</p>
              </div>
              <a href={app.profileUrl} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700">View</a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function HeatmapPrivacyNotice() {
  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
      We hide small sample groups and never show individual user locations.
    </section>
  );
}

export default function ComplaintHeatmapPage({ data }: { data: ComplaintHeatmapData }) {
  const [filters, setFilters] = useState(data.filters);
  const [selectedRegion, setSelectedRegion] = useState(data.selectedRegion.name);

  const filteredRegions = useMemo(() => {
    return data.regions.filter((r) => {
      if (filters.region && !r.region.toLowerCase().includes(filters.region.toLowerCase())) return false;
      if (filters.category && !r.topCategory.toLowerCase().includes(filters.category.toLowerCase())) return false;
      if (filters.riskLevel && r.riskLevel !== filters.riskLevel) return false;
      return true;
    });
  }, [data.regions, filters.category, filters.region, filters.riskLevel]);

  const selectedRegionData = filteredRegions.find((r) => r.region === selectedRegion);
  const privacyHidden = Boolean(selectedRegionData?.hiddenForPrivacy);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] space-y-4">
        <HeatmapHero />
        <HeatmapFilters filters={filters} onChange={setFilters} />
        <IndiaRiskMapPlaceholder regions={filteredRegions} selected={selectedRegion} onSelect={setSelectedRegion} />
        <RegionalSummaryCards region={data.selectedRegion} privacyHidden={privacyHidden} />
        <RegionalComplaintTrends trends={data.categoryTrends} />
        <RegionalRelatedApps apps={data.selectedRegion.relatedApps} hidden={privacyHidden} />
        <HeatmapPrivacyNotice />
      </div>
    </main>
  );
}
