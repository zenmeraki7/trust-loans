"use client";

import type { AdminRiskIntelligenceDashboard } from "@/types/adminRiskIntelligence";
import type { RiskLevel } from "@/types/loanAppProfile";
import { useMemo, useState } from "react";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { adminRiskIntelligenceFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, string> = { low: "bg-emerald-100 text-emerald-700", medium: "bg-amber-100 text-amber-700", high: "bg-orange-100 text-orange-700", severe: "bg-rose-100 text-rose-700" };
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${map[level]}`}>{level}</span>;
}

export function TrendBadge({ trend }: { trend: { changePercent: number; direction: "up" | "down" | "flat"; statusLabel: string } }) {
  const cls = trend.direction === "up" ? "text-rose-700" : trend.direction === "down" ? "text-emerald-700" : "text-slate-700";
  return <span className={`text-xs font-semibold ${cls}`}>{trend.direction === "up" ? "+" : ""}{trend.changePercent}% • {trend.statusLabel}</span>;
}

export function VerificationStatusBadge({ status }: { status: string }) {
  const cls = status.includes("verified") ? "bg-emerald-100 text-emerald-700" : status.includes("conflicting") ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_", " ")}</span>;
}

export function RiskIntelligenceHeader() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Risk Intelligence</h1>
      <p className="mt-1 text-sm text-slate-600">Monitor complaint trends, emerging risk signals, review anomalies, and app/company-level patterns.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
        {["Date range", "App", "Company", "Claimed NBFC partner", "Complaint category", "Risk level", "State/region", "Platform"].map((f) => (
          <input key={f} className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder={f} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Export Report", "Create Watchlist", "Review High-Risk Apps", "Open Moderation Queue"].map((a) => (
          <button key={a} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">{a}</button>
        ))}
      </div>
    </section>
  );
}

export function RiskMetricCards({ metrics, trends }: { metrics: AdminRiskIntelligenceDashboard["metrics"]; trends: AdminRiskIntelligenceDashboard["metricTrends"] }) {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{key}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
          <TrendBadge trend={trends[key]} />
        </div>
      ))}
    </section>
  );
}

export function ComplaintTrendCharts({ trends }: { trends: AdminRiskIntelligenceDashboard["trends"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Complaint trend charts</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(trends).map(([k, arr]) => (
          <div key={k} className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-700">{k}</p>
            <div className="mt-2 h-20 rounded bg-slate-100 p-2 text-[10px] text-slate-600">Chart placeholder ({arr.length} points)</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EmergingRiskSignalsTable({ items }: { items: AdminRiskIntelligenceDashboard["emergingRiskSignals"] }) {
  return (
    <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Emerging risk signals</h2>
      <table className="min-w-[1100px] text-left text-xs">
        <thead><tr className="border-b border-slate-200 text-slate-500">{["App", "Company", "Claimed NBFC partner", "Risk", "Trust", "Review change", "Top complaint", "Spike", "Moderation", "Action"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}</tr></thead>
        <tbody>{items.map((i) => <tr key={i.appId} className="border-b border-slate-100"><td className="py-2 pr-3">{i.appName}</td><td className="py-2 pr-3">{i.developerName}</td><td className="py-2 pr-3">{i.claimedNbfcPartner}</td><td className="py-2 pr-3"><RiskBadge level={i.currentRiskLevel} /></td><td className="py-2 pr-3">{i.trustScore}</td><td className="py-2 pr-3">{i.reviewCountChange}</td><td className="py-2 pr-3">{i.topRisingComplaintTag}</td><td className="py-2 pr-3 text-rose-700 font-semibold">+{i.spikePercent}%</td><td className="py-2 pr-3">{i.moderationStatus}</td><td className="py-2 pr-3"><div className="flex gap-1"><button className="rounded border px-2 py-1">Open app</button><button className="rounded border px-2 py-1">Send moderation</button></div></td></tr>)}</tbody>
      </table>
    </section>
  );
}

export function ComplaintCategoryBreakdown({ categories }: { categories: AdminRiskIntelligenceDashboard["complaintCategories"] }) {
  return <section className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">{categories.map((c) => <div key={c.key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="font-semibold text-slate-900">{c.label}</p><p className="text-sm text-slate-700">Count: {c.count} ({c.percentOfTotal}%)</p><p className="text-xs text-slate-600">Change: {c.changePercent}%</p><p className="text-xs text-slate-600">Top apps: {c.topApps.join(", ")}</p></div>)}</section>;
}

export function AppWatchlistPanel({ items }: { items: AdminRiskIntelligenceDashboard["watchlist"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">App watchlist</h2><div className="space-y-2">{items.map((i) => <div key={i.appId} className="rounded-lg border border-slate-200 p-3 text-xs"><div className="flex items-center gap-2"><img src={i.logoUrl} alt={i.appName} className="h-8 w-8 rounded border" /><p className="font-semibold">{i.appName}</p><RiskBadge level={i.riskLevel} /></div><p>Main concern: {i.mainConcern}</p><p>Status: {i.status}</p><div className="mt-1 flex gap-1"><button className="rounded border px-2 py-1">Review now</button><button className="rounded border px-2 py-1">Open profile</button></div></div>)}</div></section>;
}

export function CompanyClusterAnalysis({ items }: { items: AdminRiskIntelligenceDashboard["companyClusters"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Company / developer clusters</h2><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((c) => <div key={c.id} className="rounded-lg border border-slate-200 p-3 text-xs"><p className="font-semibold">{c.clusterName}</p><p>Linked apps: {c.linkedAppCount}</p><p>Shared details: {c.sharedDetails.join(", ")}</p><p>Average trust score: {c.averageTrustScore}</p><p>Verification confidence: {c.verificationConfidence}</p><button className="mt-1 rounded border px-2 py-1">View cluster</button></div>)}</div></section>;
}

export function ReviewIntegritySignals({ items }: { items: AdminRiskIntelligenceDashboard["reviewIntegritySignals"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Review quality / manipulation signals</h2><div className="space-y-2">{items.map((s) => <div key={s.id} className="rounded-lg border border-slate-200 p-3 text-xs"><p className="font-semibold">{s.appName} • {s.signalType}</p><p>{s.description}</p><p>Severity: {s.severity} • Status: {s.status}</p><div className="mt-1 flex gap-1"><button className="rounded border px-2 py-1">Send moderation</button><button className="rounded border px-2 py-1">Open suspicious reviews</button></div></div>)}</div></section>;
}

export function RegionalSignalMapPlaceholder({ items }: { items: AdminRiskIntelligenceDashboard["regionalSignals"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Regional signals (aggregated)</h2><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((r) => <div key={r.region} className="rounded-lg bg-slate-50 p-3 text-xs"><p className="font-semibold">{r.region}</p><p>{r.hiddenForPrivacy ? "Hidden for privacy (small sample)" : `Reports: ${r.reportCount}`}</p><p>Top category: {r.topComplaintCategory}</p></div>)}</div></section>;
}

export function NbfcClaimMonitoring({ items }: { items: AdminRiskIntelligenceDashboard["nbfcClaimMonitoring"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">NBFC claim monitoring</h2><div className="space-y-2">{items.map((n) => <div key={n.claimedNbfcPartnerId} className="rounded-lg border border-slate-200 p-3 text-xs"><p className="font-semibold">{n.claimedNbfcPartnerName}</p><p>Linked apps: {n.linkedAppCount} • Complaint volume: {n.complaintVolume}</p><VerificationStatusBadge status={n.verificationStatus} /><p>Conflicting claims: {n.conflictingClaims} • Missing proof: {n.missingProofCount}</p></div>)}</div></section>;
}

export function ModeratorWorkloadAnalytics({ data }: { data: AdminRiskIntelligenceDashboard["moderatorWorkload"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Moderator workload analytics</h2><p className="text-xs">Avg moderation time: {data.averageModerationTimeHours}h • Evidence backlog: {data.evidenceBacklog} • Company response backlog: {data.companyResponseBacklog} • Correction backlog: {data.correctionRequestBacklog}</p><div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">{data.pendingByModerator.map((m) => <div key={m.moderator} className="rounded bg-slate-50 p-2 text-xs">{m.moderator}: {m.pendingCount} pending</div>)}</div></section>;
}

export function RiskInsightSummaryPanel({ insights }: { insights: string[] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Insight summary</h2><div className="space-y-1">{insights.map((i) => <p key={i} className="rounded bg-slate-50 p-2 text-xs">{i}</p>)}</div></section>;
}

export function ExportReportBuilder() {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold text-slate-900">Export / report builder</h2><div className="grid grid-cols-1 gap-2 md:grid-cols-3">{["Date range", "Complaint categories", "Apps", "Companies", "Claimed NBFC partners"].map((f) => <input key={f} className="rounded border border-slate-300 px-3 py-2 text-xs" placeholder={f} />)}</div><div className="mt-2 flex flex-wrap gap-2"><label className="text-xs"><input type="checkbox" className="mr-1" />Include charts</label><label className="text-xs"><input type="checkbox" className="mr-1" />Include tables</label><label className="text-xs"><input type="checkbox" className="mr-1" />Include moderation metrics</label></div><div className="mt-2 flex gap-2"><button className="rounded border px-2 py-1 text-xs">Export CSV</button><button className="rounded border px-2 py-1 text-xs">Export PDF (placeholder)</button></div></section>;
}

export default function AdminRiskIntelligenceDashboardPage({ data }: { data: AdminRiskIntelligenceDashboard }) {
  const [filters, setFilters] = useState({});
  const filteredSignals = useMemo(() => applyGlobalFilters(data.emergingRiskSignals, adminRiskIntelligenceFilterSchema, filters), [data.emergingRiskSignals, filters]);
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1700px] space-y-4">
        <RiskIntelligenceHeader />
        <GlobalFilterPanel schema={adminRiskIntelligenceFilterSchema} state={filters} onChange={setFilters} />
        <RiskMetricCards metrics={data.metrics} trends={data.metricTrends} />
        <ComplaintTrendCharts trends={data.trends} />
        <EmergingRiskSignalsTable items={filteredSignals} />
        <ComplaintCategoryBreakdown categories={data.complaintCategories} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AppWatchlistPanel items={data.watchlist} />
          <CompanyClusterAnalysis items={data.companyClusters} />
          <ReviewIntegritySignals items={data.reviewIntegritySignals} />
          <RegionalSignalMapPlaceholder items={data.regionalSignals} />
          <NbfcClaimMonitoring items={data.nbfcClaimMonitoring} />
          <ModeratorWorkloadAnalytics data={data.moderatorWorkload} />
        </div>
        <RiskInsightSummaryPanel insights={data.insightSummary} />
        <ExportReportBuilder />
      </div>
    </main>
  );
}
