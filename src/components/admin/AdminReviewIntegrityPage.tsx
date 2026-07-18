"use client";

import { useMemo, useState } from "react";
import type { AdminReviewIntegrityData } from "@/types/adminReviewIntegrity";

type Signal = AdminReviewIntegrityData["signals"][number];

const queueTabs = [
  "all_signals",
  "duplicate_review",
  "spam_candidate",
  "positive_spike",
  "negative_spike",
  "repeated_text",
  "same_device",
  "same_email_domain",
  "company_linked",
  "suspicious_reviewer",
  "escalated",
  "closed",
] as const;

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SeverityBadge({ severity }: { severity: Signal["severity"] }) {
  const tone = severity === "high" ? "bg-rose-100 text-rose-700" : severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{labelize(severity)}</span>;
}

export function ConfidenceBadge({ confidence }: { confidence: Signal["confidence"] | "low" | "medium" | "high" }) {
  return <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{labelize(confidence)}</span>;
}

export function ReviewStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{labelize(status)}</span>;
}

export function IntegritySignalBadge({ signalType }: { signalType: string }) {
  return <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">{labelize(signalType)}</span>;
}

export function ReviewIntegrityHeader() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Review Integrity</h1>
      <p className="text-sm text-slate-600">Detect suspicious review patterns, duplicate submissions, spam, coordinated activity, and review manipulation signals.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Open Suspicious Queue", "Export Integrity Report", "Create Integrity Rule", "Open Moderation Dashboard", "View Audit Log"].map((action) => (
          <button key={action} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{action}</button>
        ))}
      </div>
    </section>
  );
}

export function IntegrityStatsCards({ stats }: { stats: AdminReviewIntegrityData["stats"] }) {
  const metrics: Array<[string, number]> = [
    ["Suspicious reviews", stats.suspiciousReviews],
    ["Duplicate candidates", stats.duplicateCandidates],
    ["Spam candidates", stats.spamCandidates],
    ["Positive spike alerts", stats.positiveSpikeAlerts],
    ["Negative spike alerts", stats.negativeSpikeAlerts],
    ["Same-device patterns", stats.sameDevicePatterns],
    ["Same-text patterns", stats.sameTextPatterns],
    ["Company-linked signals", stats.companyLinkedSignals],
    ["Reviews held for integrity review", stats.reviewsHeldForIntegrity],
    ["Integrity cases closed today", stats.casesClosedToday],
  ];

  return <section className="grid grid-cols-2 gap-2 xl:grid-cols-5">{metrics.map(([label, value]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-[11px] uppercase text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-slate-900">{value}</p></article>)}</section>;
}

export function IntegrityQueueTabs({ active, onChange, counts }: { active: string; onChange: (value: string) => void; counts: Record<string, number> }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap gap-2">{queueTabs.map((tab) => <button key={tab} onClick={() => onChange(tab)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${active === tab ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>{labelize(tab)} <span className="ml-1 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700">{counts[tab] ?? 0}</span></button>)}</div></section>;
}

export function IntegritySearchFilters({ filters, onChange }: { filters: AdminReviewIntegrityData["filters"]; onChange: (next: AdminReviewIntegrityData["filters"]) => void }) {
  const patch = (key: keyof AdminReviewIntegrityData["filters"], value: string | boolean) => onChange({ ...filters, [key]: value });
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4 xl:grid-cols-6">
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Review ID, app, reviewer, signal ID" value={filters.query} onChange={(e) => patch("query", e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.signalType} onChange={(e) => patch("signalType", e.target.value)}><option value="">Signal type</option><option value="duplicate_review">Duplicate reviews</option><option value="spam_candidate">Spam candidates</option><option value="repeated_text">Repeated text</option><option value="positive_spike">Positive spike</option><option value="negative_spike">Negative spike</option></select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.severity} onChange={(e) => patch("severity", e.target.value)}><option value="">Severity</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.confidence} onChange={(e) => patch("confidence", e.target.value)}><option value="">Confidence</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.status} onChange={(e) => patch("status", e.target.value)}><option value="">Status</option><option value="new">New</option><option value="under_review">Under review</option><option value="needs_moderator_review">Needs moderator review</option><option value="needs_senior_review">Needs senior review</option><option value="closed">Closed</option></select>
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Assigned moderator" value={filters.assignedModerator} onChange={(e) => patch("assignedModerator", e.target.value)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-700">
        {[{ key: "companyResponseExists", label: "Company response exists" }, { key: "evidenceSubmitted", label: "Evidence submitted" }, { key: "sameTextDetected", label: "Same text detected" }, { key: "spikeDetected", label: "Spike detected" }, { key: "escalatedOnly", label: "Escalated only" }].map((item) => {
          const field = item.key as keyof AdminReviewIntegrityData["filters"];
          return <label key={item.key} className="inline-flex items-center gap-2"><input type="checkbox" checked={Boolean(filters[field])} onChange={(e) => patch(field, e.target.checked)} />{item.label}</label>;
        })}
      </div>
    </section>
  );
}

export function EmptyIntegrityState() {
  return <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="font-semibold text-slate-900">No review integrity signals match your filters.</p><div className="mt-3 flex justify-center gap-2"><button className="rounded border border-slate-300 px-3 py-2 text-xs">Clear filters</button><button className="rounded border border-slate-300 px-3 py-2 text-xs">Open moderation dashboard</button><button className="rounded border border-slate-300 px-3 py-2 text-xs">View integrity rules</button></div></section>;
}

export function IntegritySignalTable({ signals, selected, onSelect }: { signals: Signal[]; selected: string; onSelect: (id: string) => void }) {
  if (!signals.length) return <EmptyIntegrityState />;
  return (
    <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <table className="min-w-[1180px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            {["Signal ID", "Signal type", "Loan app", "Reviews involved", "Rating pattern", "Severity", "Confidence", "Detection reason", "First detected", "Last activity", "Status", "Assigned", "Action"].map((head) => <th key={head} className="py-2 pr-3 font-semibold">{head}</th>)}
          </tr>
        </thead>
        <tbody>
          {signals.map((signal) => (
            <tr key={signal.id} className={`border-b border-slate-100 ${selected === signal.id ? "bg-slate-50" : ""}`}>
              <td className="py-2 pr-3 font-medium">{signal.id}</td>
              <td className="py-2 pr-3"><IntegritySignalBadge signalType={signal.signalType} /></td>
              <td className="py-2 pr-3">{signal.appName}</td>
              <td className="py-2 pr-3">{signal.reviewCountInvolved}</td>
              <td className="py-2 pr-3">{signal.ratingPattern}</td>
              <td className="py-2 pr-3"><SeverityBadge severity={signal.severity} /></td>
              <td className="py-2 pr-3"><ConfidenceBadge confidence={signal.confidence} /></td>
              <td className="py-2 pr-3 max-w-[220px]">{signal.detectionReason}</td>
              <td className="py-2 pr-3">{signal.firstDetectedAt}</td>
              <td className="py-2 pr-3">{signal.lastActivityAt}</td>
              <td className="py-2 pr-3"><ReviewStatusBadge status={signal.status} /></td>
              <td className="py-2 pr-3">{signal.assignedReviewer || "Unassigned"}</td>
              <td className="py-2 pr-3"><button onClick={() => onSelect(signal.id)} className="rounded border border-slate-300 px-2 py-1 font-semibold">Investigate</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function DuplicateReviewComparison({ data }: { data: AdminReviewIntegrityData["selectedSignal"]["duplicateComparison"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold text-slate-900">Duplicate review detection</h3><p className="mt-1">Similarity: {data.similarityPercent}%</p><p>Same app: {data.sameApp ? "Yes" : "No"} | Same reviewer: {data.sameReviewer ? "Yes" : "No"}</p><p>Submission time difference: {data.submissionTimeDifferenceMinutes} minutes</p><div className="mt-2 flex flex-wrap gap-1">{data.sharedTextBlocks.map((t) => <span key={t} className="rounded bg-slate-100 px-2 py-1">{t}</span>)}</div><div className="mt-2 flex flex-wrap gap-1">{["Keep original, reject duplicates", "Merge duplicate report references", "Send to moderation", "Request clarification", "Mark not duplicate"].map((action) => <button key={action} className="rounded border border-slate-300 px-2 py-1">{action}</button>)}</div></section>;
}

export function RepeatedTextClusterPanel({ signal }: { signal: Signal }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold text-slate-900">Repeated text / template abuse</h3><p>Signal: {signal.id} | Type: {labelize(signal.signalType)}</p><p>Unusual repeated structure detected with confidence {labelize(signal.confidence)}.</p><button className="mt-2 rounded border border-slate-300 px-2 py-1">Review cluster</button></section>;
}

export function ReviewSpikeDetectionPanel({ spike }: { spike: AdminReviewIntegrityData["selectedSignal"]["spikeAnalysis"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold text-slate-900">Review spike detection</h3><p>Spike type: {labelize(spike.spikeType)}</p><p>Reviews before spike: {spike.reviewsBeforeSpike} | During spike: {spike.reviewsDuringSpike}</p><p>Verified ratio: {(spike.verifiedReviewerRatio * 100).toFixed(0)}% | Unverified ratio: {(spike.unverifiedReviewerRatio * 100).toFixed(0)}%</p><div className="mt-2 grid grid-cols-2 gap-2"><div className="rounded bg-slate-50 p-2"><p className="font-semibold">Before</p>{Object.entries(spike.ratingDistributionBefore).map(([k,v]) => <p key={k}>{k} star: {v}</p>)}</div><div className="rounded bg-slate-50 p-2"><p className="font-semibold">During</p>{Object.entries(spike.ratingDistributionDuring).map(([k,v]) => <p key={k}>{k} star: {v}</p>)}</div></div><div className="mt-2 flex flex-wrap gap-1">{["Temporarily hold spike reviews", "Send sample to moderation", "Require verification", "Mark spike reviewed", "Add app integrity note"].map((action) => <button key={action} className="rounded border border-slate-300 px-2 py-1">{action}</button>)}</div></section>;
}

export function ReviewerAccountIntegrityPanel({ data }: { data: AdminReviewIntegrityData["selectedSignal"]["reviewerIntegrity"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold text-slate-900">Reviewer account integrity</h3><p>Total submitted: {data.totalReviewsSubmitted}</p><p>Rejected reviews: {data.rejectedReviews}</p><p>Extreme rating ratio: {(data.extremeRatingRatio * 100).toFixed(0)}%</p><p>Repeated violations: {data.repeatedViolationCount}</p><p>Account status: {labelize(data.accountStatus)}</p><div className="mt-2 flex flex-wrap gap-1">{["Rate limit", "Require email verification", "Require phone verification", "Temporarily suspend review posting", "Send to user review", "Mark trusted after review"].map((action) => <button key={action} className="rounded border border-slate-300 px-2 py-1">{action}</button>)}</div></section>;
}

export function CompanyLinkedSignalsPanel({ data }: { data: AdminReviewIntegrityData["selectedSignal"]["companyLinkedSignal"] }) {
  if (!data.exists) return null;
  return <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><h3 className="font-semibold">Company-linked integrity signal</h3><p>{data.reason}</p><p>Claim: {data.companyClaimId} | Representative: {data.representativeAccountId} | Confidence: {labelize(data.confidence)}</p><div className="mt-2 flex flex-wrap gap-1">{["Escalate company account", "Limit response actions", "Require senior review", "Open company claim record", "Add internal note"].map((action) => <button key={action} className="rounded border border-amber-300 bg-white px-2 py-1">{action}</button>)}</div></section>;
}

export function AppIntegritySummary({ summary }: { summary: AdminReviewIntegrityData["selectedSignal"]["appIntegritySummary"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold text-slate-900">App-level integrity summary</h3><div className="mt-2 grid grid-cols-2 gap-2">{[["Total reviews", summary.totalReviews],["Under integrity review", summary.reviewsUnderIntegrityReview],["Duplicate candidates", summary.duplicateCandidates],["Spam candidates", summary.spamCandidates],["Spike alerts", summary.spikeAlerts],["Rejected reviews", summary.rejectedReviewCount],["Company responses", summary.companyResponses],["Correction/disputes", summary.correctionDisputeCount]].map(([k,v]) => <p key={String(k)}>{k}: <span className="font-semibold">{v}</span></p>)}</div><p className="mt-2">Verified borrower ratio: {(summary.verifiedBorrowerRatio * 100).toFixed(0)}%</p><p>Anonymous review ratio: {(summary.anonymousReviewRatio * 100).toFixed(0)}%</p><p className="mt-1 font-semibold">Overall integrity confidence: {labelize(summary.integrityConfidence)}</p></section>;
}

export function IntegrityRulesPreview({ rules }: { rules: AdminReviewIntegrityData["activeRules"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold text-slate-900">Integrity rules configuration preview</h3><div className="mt-2 space-y-2 text-xs">{rules.map((rule) => <div key={rule.id} className="rounded bg-slate-50 p-2"><p className="font-semibold">{rule.ruleName}</p><p>{rule.ruleType} | {rule.threshold}</p><p>Severity: <SeverityBadge severity={rule.severity} /> | Enabled: {rule.enabled ? "Yes" : "No"}</p><div className="mt-1 flex flex-wrap gap-1"><button className="rounded border border-slate-300 px-2 py-1">View rule</button><button className="rounded border border-slate-300 px-2 py-1">Edit in Platform Settings</button><button className="rounded border border-slate-300 px-2 py-1">Disable rule with approval</button><button className="rounded border border-slate-300 px-2 py-1">Create new rule</button></div></div>)}</div></section>;
}

export function IntegrityDecisionWorkflow({ decision, onChange }: { decision: AdminReviewIntegrityData["selectedSignal"]["decision"]; onChange: (next: AdminReviewIntegrityData["selectedSignal"]["decision"]) => void }) {
  const update = (key: keyof typeof decision, value: string | boolean) => onChange({ ...decision, [key]: value });
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold text-slate-900">Moderator decision workflow</h3><div className="mt-2 grid grid-cols-1 gap-2 text-xs"><select className="rounded border border-slate-300 px-2 py-2" value={decision.decisionType} onChange={(e) => update("decisionType", e.target.value)}><option value="">Decision</option>{["no_action_needed", "hold_reviews", "send_to_moderation", "reject_duplicate_reviews", "reject_spam_reviews", "request_user_verification", "rate_limit_account", "escalate", "close_signal"].map((d) => <option key={d} value={d}>{labelize(d)}</option>)}</select><input className="rounded border border-slate-300 px-2 py-2" placeholder="Decision reason" value={decision.reason} onChange={(e) => update("reason", e.target.value)} /><textarea className="rounded border border-slate-300 px-2 py-2" rows={3} placeholder="Internal note" value={decision.internalNote} onChange={(e) => update("internalNote", e.target.value)} /><label className="inline-flex items-center gap-2"><input type="checkbox" checked={decision.notifyAffectedUser} onChange={(e) => update("notifyAffectedUser", e.target.checked)} />Notify affected user</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={decision.recalculateAppScore} onChange={(e) => update("recalculateAppScore", e.target.checked)} />Recalculate app score</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={decision.reprocessPublicStats} onChange={(e) => update("reprocessPublicStats", e.target.checked)} />Reprocess public stats</label><button className="rounded bg-slate-900 px-3 py-2 font-semibold text-white">Apply decision</button></div></section>;
}

export function IntegrityAuditLog({ logs }: { logs: string[] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold text-slate-900">Audit log</h3><div className="mt-2 space-y-2 text-xs">{logs.map((log, idx) => <p key={`${log}-${idx}`} className="rounded bg-slate-50 p-2">{log}</p>)}</div></section>;
}

export function BulkIntegrityActionsBar() {
  return <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap gap-2">{["Assign reviewer", "Send to moderation", "Mark low priority", "Escalate", "Close no issue", "Export metadata"].map((a) => <button key={a} className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold">{a}</button>)}</div></section>;
}

export function IntegritySignalDetailPanel({ signal, selected, decision, onDecisionChange }: { signal: Signal | undefined; selected: AdminReviewIntegrityData["selectedSignal"]; decision: AdminReviewIntegrityData["selectedSignal"]["decision"]; onDecisionChange: (next: AdminReviewIntegrityData["selectedSignal"]["decision"]) => void }) {
  if (!signal) return null;
  return <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">Signal detail investigation</h2><p className="text-sm text-slate-600">{selected.summary}</p><div className="rounded bg-slate-50 p-3 text-xs"><p className="font-semibold">{selected.app.name}</p><p>Trust score: {selected.app.trustScore} | Risk level: {labelize(selected.app.riskLevel)}</p><p>Signal: {signal.id} ({labelize(signal.signalType)})</p></div><DuplicateReviewComparison data={selected.duplicateComparison} /><RepeatedTextClusterPanel signal={signal} /><ReviewSpikeDetectionPanel spike={selected.spikeAnalysis} /><ReviewerAccountIntegrityPanel data={selected.reviewerIntegrity} /><CompanyLinkedSignalsPanel data={selected.companyLinkedSignal} /><AppIntegritySummary summary={selected.appIntegritySummary} /><IntegrityDecisionWorkflow decision={decision} onChange={onDecisionChange} /><IntegrityAuditLog logs={selected.auditLog} /></section>;
}

export default function AdminReviewIntegrityPage({ data }: { data: AdminReviewIntegrityData }) {
  const [activeTab, setActiveTab] = useState<string>("all_signals");
  const [filters, setFilters] = useState<AdminReviewIntegrityData["filters"]>(data.filters);
  const [selectedId, setSelectedId] = useState(data.selectedSignal.id);
  const [decision, setDecision] = useState(data.selectedSignal.decision);

  const counts = useMemo(() => ({
    all_signals: data.signals.length,
    duplicate_review: data.signals.filter((s) => s.signalType === "duplicate_review").length,
    spam_candidate: data.signals.filter((s) => s.signalType === "spam_candidate").length,
    positive_spike: data.signals.filter((s) => s.signalType === "positive_spike").length,
    negative_spike: data.signals.filter((s) => s.signalType === "negative_spike").length,
    repeated_text: data.signals.filter((s) => s.signalType === "repeated_text").length,
    same_device: data.signals.filter((s) => s.signalType === "same_device").length,
    same_email_domain: data.signals.filter((s) => s.signalType === "same_email_domain").length,
    company_linked: data.signals.filter((s) => s.signalType === "company_linked").length,
    suspicious_reviewer: data.signals.filter((s) => s.signalType === "suspicious_reviewer").length,
    escalated: data.signals.filter((s) => s.status === "needs_senior_review").length,
    closed: data.signals.filter((s) => s.status === "closed").length,
  }), [data.signals]);

  const filteredSignals = useMemo(() => {
    return data.signals.filter((signal) => {
      if (activeTab !== "all_signals" && activeTab !== "escalated" && activeTab !== "closed" && signal.signalType !== activeTab) return false;
      if (activeTab === "escalated" && signal.status !== "needs_senior_review") return false;
      if (activeTab === "closed" && signal.status !== "closed") return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const bucket = [signal.id, signal.appName, signal.detectionReason, signal.assignedReviewer, signal.signalType].join(" ").toLowerCase();
        if (!bucket.includes(q)) return false;
      }
      if (filters.signalType && signal.signalType !== filters.signalType) return false;
      if (filters.severity && signal.severity !== filters.severity) return false;
      if (filters.confidence && signal.confidence !== filters.confidence) return false;
      if (filters.status && signal.status !== filters.status) return false;
      if (filters.assignedModerator && !signal.assignedReviewer.toLowerCase().includes(filters.assignedModerator.toLowerCase())) return false;
      if (filters.escalatedOnly && signal.status !== "needs_senior_review") return false;
      return true;
    });
  }, [activeTab, data.signals, filters]);

  const selectedSignal = data.signals.find((s) => s.id === selectedId) ?? filteredSignals[0];

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1800px] space-y-4">
        <ReviewIntegrityHeader />
        <IntegrityStatsCards stats={data.stats} />
        <IntegrityQueueTabs active={activeTab} onChange={setActiveTab} counts={counts} />
        <IntegritySearchFilters filters={filters} onChange={setFilters} />
        <BulkIntegrityActionsBar />
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <IntegritySignalTable signals={filteredSignals} selected={selectedId} onSelect={setSelectedId} />
            <IntegrityRulesPreview rules={data.activeRules} />
          </div>
          <IntegritySignalDetailPanel signal={selectedSignal} selected={data.selectedSignal} decision={decision} onDecisionChange={setDecision} />
        </div>
      </div>
    </main>
  );
}
