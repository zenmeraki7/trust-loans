"use client";

import { useMemo, useState } from "react";
import type { ModerationDashboardData, ModerationStatus, QueueKey } from "@/types/adminModeration";
import { useEvidenceDecisionActions, useSecureOpenEvidence } from "@/hooks/useEvidence";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { adminModerationFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";

export function AdminStatusBadge({ status }: { status: ModerationStatus }) {
  const map: Record<ModerationStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    in_review: "bg-blue-100 text-blue-700",
    needs_redaction: "bg-orange-100 text-orange-700",
    needs_more_info: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    partially_approved: "bg-teal-100 text-teal-700",
    rejected: "bg-rose-100 text-rose-700",
    escalated: "bg-purple-100 text-purple-700",
    removed: "bg-slate-200 text-slate-700",
  };
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${map[status]}`}>{status.replaceAll("_", " ")}</span>;
}

export function RiskFlagBadge({ flag }: { flag: string }) {
  return <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">{flag}</span>;
}

export function AdminModerationHeader() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Moderation Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Review user reports, evidence, company responses, and correction requests before publication.</p>
    </section>
  );
}

export function ModerationStatsCards({ stats }: { stats: ModerationDashboardData["stats"] }) {
  const items = [
    ["Pending reviews", stats.pendingReviews],
    ["Pending evidence files", stats.pendingEvidence],
    ["Company responses pending", stats.pendingCompanyResponses],
    ["Business claims pending", stats.pendingBusinessClaims],
    ["Correction requests pending", stats.pendingCorrectionRequests],
    ["High-risk submissions", stats.highRiskSubmissions],
    ["Rejected today", stats.rejectedToday],
    ["Published today", stats.publishedToday],
  ];
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </section>
  );
}

export function ModerationQueueTabs({
  queues,
  active,
  onChange,
}: {
  queues: ModerationDashboardData["queues"];
  active: QueueKey;
  onChange: (key: QueueKey) => void;
}) {
  const labels: Array<[QueueKey, string]> = [
    ["reviews", "Reviews"],
    ["evidence", "Evidence"],
    ["companyResponses", "Company Responses"],
    ["businessClaims", "Business Claims"],
    ["correctionRequests", "Correction Requests"],
    ["flaggedContent", "Flagged Content"],
    ["duplicateReports", "Duplicate Reports"],
    ["appeals", "Appeals"],
  ];
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {labels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${active === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}
          >
            {label} ({queues[key].length})
          </button>
        ))}
      </div>
    </section>
  );
}

export function ModerationFilters() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
        {[
          "Submission type",
          "Status",
          "Risk level",
          "Loan app name",
          "Complaint tag",
          "Date range",
          "Reviewer verification status",
          "Evidence attached",
          "Contains sensitive data",
          "Contains legal accusation",
          "Contains private phone number",
          "Contains image/video",
          "Assigned moderator",
        ].map((field) => (
          <input key={field} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" placeholder={field} />
        ))}
      </div>
      <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Search by app name, review title, user email, report ID, or company name" />
    </section>
  );
}

export function ReviewModerationQueue({
  reviews,
  onSelect,
}: {
  reviews: ModerationDashboardData["queues"]["reviews"];
  onSelect: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Review moderation queue</h2>
      <div className="space-y-2">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900">{r.id}</p>
              <p className="text-sm text-slate-700">{r.appName}</p>
              <AdminStatusBadge status={r.status} />
              <span className="text-xs text-slate-500">Moderator: {r.assignedModerator}</span>
            </div>
            <p className="text-sm text-slate-700">{r.title}</p>
            <p className="text-xs text-slate-500">{r.displayMode} • rating {r.rating} • submitted {r.submittedAt}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {r.tags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {r.riskFlags.map((f) => <RiskFlagBadge key={f} flag={f} />)}
            </div>
            <button onClick={() => onSelect(r.id)} className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Review</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SensitiveDataWarnings({ flags }: { flags: string[] }) {
  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-rose-900">Sensitive data detection warnings</h3>
      <div className="flex flex-wrap gap-1">
        {flags.map((f) => <RiskFlagBadge key={f} flag={f} />)}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Auto-redact sensitive data</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Manually edit redaction</button>
        <button className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700">Reject due to unsafe content</button>
      </div>
    </section>
  );
}

export function EvidenceReviewPanel({ files }: { files: ModerationDashboardData["selectedReview"]["evidenceFiles"] }) {
  const secureOpen = useSecureOpenEvidence();
  const actions = useEvidenceDecisionActions();
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Evidence storage disabled</h3>
      <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        Trust Loans does not collect, store, preview, scan, redact, transcribe, share, or provide download links for evidence.
      </p>
      <div className="space-y-2">
        {files.map((f) => (
          <div key={f.id} className="rounded-lg border border-slate-200 p-2 text-xs">
            <p>{f.nameMasked} • {f.fileType} • uploaded {f.uploadDate}</p>
            <p>Safety scan: {f.safetyScanStatus}</p>
            <AdminStatusBadge status={f.status} />
            <div className="hidden">
              <button onClick={() => secureOpen.mutate({ id: f.id, reasonForAccess: "Moderation evidence review" })} className="rounded border border-slate-300 px-2 py-1">Open securely</button>
              <button onClick={() => void actions.accept(f.id)} className="rounded border border-slate-300 px-2 py-1">Accept for verification</button>
              <button onClick={() => void actions.reject(f.id, "Unsafe content in evidence")} className="rounded border border-slate-300 px-2 py-1">Reject unsafe</button>
              <button onClick={() => void actions.privateOnly(f.id)} className="rounded border border-slate-300 px-2 py-1">Mark private only</button>
            </div>
            {secureOpen.data?.downloadUrl && <p className="mt-1 text-[11px] text-slate-500">Secure URL issued (logged): {secureOpen.data.downloadUrl}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompanyResponseModeration() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Company response moderation</h3>
      <p className="text-xs text-slate-600">Check for threats, borrower detail exposure, legal intimidation, abusive language, and forced review-removal demands.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Approve response</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Request edit</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Reject response</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Escalate</button>
      </div>
    </section>
  );
}

export function BusinessClaimReview() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Business claim review</h3>
      <p className="text-xs text-slate-600">Validate representative details, website, documents, claimed NBFC relationship, and grievance details.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Approve claim</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Reject claim</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Request more documents</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Mark disputed</button>
      </div>
    </section>
  );
}

export function CorrectionRequestReview() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Correction request review</h3>
      <p className="text-xs text-slate-600">Verify current value, proposed correction, and proof before applying public updates.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Approve correction</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Reject correction</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Request more proof</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Apply partial correction</button>
      </div>
    </section>
  );
}

export function ModerationRulesSidebar() {
  const rules = [
    "Remove private personal data",
    "Do not publish Aadhaar, PAN, or bank info",
    "Do not publish private phone numbers",
    "Avoid direct criminal labels unless legally verified",
    "Convert unsafe claims into safer wording",
    "Keep evidence private by default",
    "Allow factual user experience",
    "Reject threats, abuse, revenge, and doxxing",
  ];
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Moderation rules</h3>
      <div className="space-y-1 text-xs text-slate-700">
        {rules.map((r) => <p key={r}>• {r}</p>)}
      </div>
    </aside>
  );
}

export function ModerationAuditLog({
  history,
}: {
  history: ModerationDashboardData["selectedReview"]["moderationHistory"];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Audit log</h3>
      <div className="space-y-2">
        {history.map((h) => (
          <div key={h.timestamp + h.action} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-700">
            <p><span className="font-semibold">{h.moderator}</span> • {h.timestamp}</p>
            <p>{h.action}: {h.previousStatus} → {h.newStatus}</p>
            <p>Note: {h.note}</p>
            <p>Redaction: {h.redactionDetails}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewDetailPanel({ review }: { review: ModerationDashboardData["selectedReview"] }) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Review detail panel</h2>
      <p className="text-sm text-slate-700">{review.id} • {review.appName} • {review.title}</p>
      <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{review.body}</p>
      <div className="flex flex-wrap gap-1">
        {review.tags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}
      </div>
      <p className="text-xs text-slate-600">Reviewer mode: {review.reviewer.displayMode} • email: {review.reviewer.emailMasked}</p>
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
        <button className="rounded bg-teal-600 px-3 py-2 text-xs font-semibold text-white">Approve with redactions</button>
        <button className="rounded bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
        <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">Request more info</button>
        <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">Escalate</button>
        <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">Mark duplicate</button>
      </div>
      <SensitiveDataWarnings flags={review.sensitiveDataFlags} />
      <EvidenceReviewPanel files={review.evidenceFiles} />
      <CompanyResponseModeration />
      <BusinessClaimReview />
      <CorrectionRequestReview />
      <ModerationAuditLog history={review.moderationHistory} />
    </section>
  );
}

export default function AdminModerationDashboardPage({ data }: { data: ModerationDashboardData }) {
  const [activeTab, setActiveTab] = useState<QueueKey>("reviews");
  const [selectedReviewId, setSelectedReviewId] = useState(data.selectedReview.id);
  const [filters, setFilters] = useState({});

  const selectedReview = useMemo(() => {
    if (selectedReviewId === data.selectedReview.id) return data.selectedReview;
    return data.selectedReview;
  }, [selectedReviewId, data.selectedReview]);
  const filteredReviews = useMemo(() => applyGlobalFilters(data.queues.reviews, adminModerationFilterSchema, filters), [data.queues.reviews, filters]);

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <AdminModerationHeader />
        <ModerationStatsCards stats={data.stats} />
        <ModerationQueueTabs queues={data.queues} active={activeTab} onChange={setActiveTab} />
        <GlobalFilterPanel schema={adminModerationFilterSchema} state={filters} onChange={setFilters} />
        <ModerationFilters />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <ReviewModerationQueue reviews={filteredReviews} onSelect={setSelectedReviewId} />
            <ReviewDetailPanel review={selectedReview} />
          </div>
          <ModerationRulesSidebar />
        </div>
      </div>
    </main>
  );
}
