"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RiskLevel } from "@/types/loanAppProfile";
import type { EvidenceStatus, ReportStatus, UserDashboardData } from "@/types/userDashboard";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { userDashboardFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";
import SavedDraftsSection from "@/components/complaints/SavedDraftsSection";
import { useEvidenceMetadata } from "@/hooks/useEvidence";
import { useUserDashboard } from "@/hooks/useUserDashboard";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  };
  const label = riskLevel === "severe" ? "Severe Complaints" : `${riskLevel[0].toUpperCase()}${riskLevel.slice(1)} Risk`;
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${map[riskLevel]}`}>{label}</span>;
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  const map: Record<ReportStatus, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-slate-100 text-slate-700" },
    submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-700" },
    under_moderation: { label: "Under Moderation", cls: "bg-amber-100 text-amber-700" },
    needs_more_info: { label: "Needs More Info", cls: "bg-orange-100 text-orange-700" },
    published: { label: "Published", cls: "bg-emerald-100 text-emerald-700" },
    partially_published: { label: "Partially Published", cls: "bg-teal-100 text-teal-700" },
    rejected: { label: "Rejected", cls: "bg-rose-100 text-rose-700" },
    removed_by_user: { label: "Removed by User", cls: "bg-slate-200 text-slate-700" },
  };
  const cfg = map[status];
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cfg.cls}`}>{cfg.label}</span>;
}

function evidenceLabel(status: EvidenceStatus) {
  const labels: Record<EvidenceStatus, string> = {
    none: "No evidence uploaded",
    private: "Evidence private",
    under_review: "Evidence under review",
    accepted_for_verification: "Evidence accepted for verification",
    rejected_for_safety: "Evidence rejected for safety reasons",
  };
  return labels[status];
}

export function DashboardHeader({ data }: { data: UserDashboardData }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">My reports and reviews</h1>
      <p className="mt-2 text-sm text-slate-600">
        Track your submitted reviews, moderation status, saved drafts, and safety actions.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">User: {data.user.displayName}</div>
        <div className="rounded-xl bg-slate-50 p-3">Email: {data.user.email}</div>
        <div className="rounded-xl bg-slate-50 p-3">
          Verification: {data.user.emailVerified ? "Verified" : "Pending"}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Submit New Review
        </Link>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Browse Loan Apps
        </Link>
        <Link href="/legal-action-guide" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Legal Action Guide
        </Link>
      </div>
    </section>
  );
}

export function DashboardStatusCards({
  summary,
  onFilter,
}: {
  summary: UserDashboardData["summary"];
  onFilter: (status: ReportStatus | "all") => void;
}) {
  const cards = [
    ["Published Reviews", summary.published, "Visible publicly with privacy controls", "published"],
    ["Under Moderation", summary.underModeration, "Being reviewed for safety and policy", "under_moderation"],
    ["Needs More Info", summary.needsMoreInfo, "Action needed to clarify or redact data", "needs_more_info"],
    ["Rejected / Not Published", summary.rejected, "Could not publish due to policy reasons", "rejected"],
    ["Drafts", summary.drafts, "Saved but not submitted yet", "draft"],
    ["Private Evidence Files", summary.evidenceFiles, "Stored privately for moderation or verification", "all"],
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([title, count, description, status]) => (
        <button
          key={title}
          type="button"
          onClick={() => onFilter(status as ReportStatus | "all")}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{count}</p>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </button>
      ))}
    </section>
  );
}

export function ReportCard({
  report,
  onView,
}: {
  report: UserDashboardData["reports"][number];
  onView: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img src={report.appLogoUrl} alt={`${report.appName} logo`} className="h-10 w-10 rounded-lg border border-slate-200" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{report.appName}</h3>
            <StatusBadge status={report.status} />
          </div>
          <p className="text-sm text-slate-700">{report.reviewTitle}</p>
          <p className="text-xs text-slate-500">{report.reviewType} • Submitted: {report.submittedAt}</p>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={report.rating} />
            <span className="text-xs text-slate-500">{evidenceLabel(report.evidenceStatus)}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {report.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onView} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">View Details</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Edit Draft</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Add Evidence</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Withdraw Review</button>
        <Link href={report.publicUrl} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">View Public Review</Link>
      </div>
    </article>
  );
}

export function ReportDetailDrawer({
  report,
  onClose,
}: {
  report: UserDashboardData["reports"][number] | null;
  onClose: () => void;
}) {
  const [evidenceId, setEvidenceId] = useState("");
  const evidenceQuery = useEvidenceMetadata(evidenceId);
  if (!report) return null;
  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Report details</h3>
        <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1 text-sm">Close</button>
      </div>
      <p className="font-semibold text-slate-900">{report.reviewTitle}</p>
      <p className="mt-1 text-sm text-slate-600">Full review body is visible only to you and moderation team until published.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">Incident date: {report.updatedAt}</div>
        <div className="rounded-lg bg-slate-50 p-3">Loan amount range: Rs 5,000 - Rs 25,000</div>
        <div className="rounded-lg bg-slate-50 p-3">Privacy: {report.privacy.displayMode}, evidence private: {report.privacy.evidencePrivate ? "Yes" : "No"}</div>
        <div className="rounded-lg bg-slate-50 p-3">Public visibility: {report.status === "published" ? "Visible publicly" : "Not public yet"}</div>
        <div className="rounded-lg bg-slate-50 p-3">Company response: Not available</div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-900">Evidence files (masked)</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {report.evidenceFiles.length ? report.evidenceFiles.map((f) => <span key={f} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{f}</span>) : <span className="text-xs text-slate-500">No evidence files linked to this review.</span>}
        </div>
        <div className="mt-2 space-y-2">
          <input value={evidenceId} onChange={(e) => setEvidenceId(e.target.value)} placeholder="Enter evidence ID to fetch private metadata" className="w-full rounded border border-slate-300 px-2 py-1 text-xs" />
          {evidenceQuery.data && (
            <div className="rounded bg-slate-50 p-2 text-xs text-slate-700">
              <p>{evidenceQuery.data.maskedFileName} • {evidenceQuery.data.mimeType}</p>
              <p>Status: {evidenceQuery.data.status} • {evidenceQuery.data.fileSizeBytes} bytes</p>
              <p>Sensitive flags: {evidenceQuery.data.sensitiveFlags.join(", ") || "none"}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-900">Moderation notes</p>
        {report.moderationNotes.map((note) => (
          <p key={note} className="mt-1 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">{note}</p>
        ))}
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-900">Timeline</p>
        <div className="mt-1 space-y-1">
          {report.timeline.map((t) => (
            <div key={t.label + t.date} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-700">
              <p className="font-medium">{t.label} • {t.date}</p>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function MyReportsList({
  reports,
  onView,
}: {
  reports: UserDashboardData["reports"];
  onView: (report: UserDashboardData["reports"][number]) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">My reports list</h2>
      <div className="space-y-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} onView={() => onView(report)} />
        ))}
      </div>
    </section>
  );
}

export function HarassmentCaseFolderSection({ folder }: { folder: UserDashboardData["harassmentCaseFolder"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">My Harassment Case Folder</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 text-sm">Review/report: {folder.reportTitle} ({folder.reportId})</div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">Status: <StatusBadge status={folder.reportStatus} /></div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          Evidence files:
          <div className="mt-1 flex flex-wrap gap-1">{folder.evidenceFiles.map((f) => <span key={f} className="rounded-full bg-white px-2 py-1 text-xs">{f}</span>)}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          Complaint templates used:
          <ul className="mt-1 list-disc pl-5 text-xs">{folder.complaintTemplatesUsed.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          Grievance officer email sent: {folder.grievanceOfficerEmailSent.sent ? "Yes" : "No"}
          {folder.grievanceOfficerEmailSent.sent ? <p className="mt-1 text-xs">{folder.grievanceOfficerEmailSent.sentAt} | {folder.grievanceOfficerEmailSent.subject}</p> : null}
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          Complaint numbers:
          <p className="mt-1 text-xs">Cybercrime: {folder.cybercrimeComplaintNumber || "Not added"}</p>
          <p className="text-xs">RBI CMS: {folder.rbiCmsComplaintNumber || "Not added"}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        <article className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-slate-900">Call log timeline</p>
          <div className="mt-1 space-y-1 text-xs">{folder.callLogTimeline.map((c) => <p key={c.date + c.detail}>{c.date} | {c.detail}</p>)}</div>
        </article>
        <article className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-slate-900">Company response</p>
          <p className="mt-1 text-xs">{folder.companyResponse.summary}</p>
          {folder.companyResponse.respondedAt ? <p className="text-xs">Responded: {folder.companyResponse.respondedAt}</p> : null}
        </article>
        <article className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-slate-900">Next actions</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">{folder.nextActions.map((n) => <li key={n}>{n}</li>)}</ul>
        </article>
      </div>
      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
        <p className="font-semibold text-slate-900">Status timeline</p>
        <div className="mt-1 space-y-1 text-xs">{folder.statusTimeline.map((s) => <p key={s.label + s.date}>{s.date} | {s.label} | {s.note}</p>)}</div>
      </div>
    </section>
  );
}

export function ModerationStatusHelp() {
  const items = [
    ["Under Moderation", "Being reviewed for safety and policy."],
    ["Needs More Info", "Please clarify details or remove sensitive data."],
    ["Published", "Visible publicly."],
    ["Partially Published", "Sensitive details removed before publishing."],
    ["Rejected", "Could not publish due to policy or safety issue."],
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Moderation status explanation</h2>
      <div className="space-y-2 text-sm">
        {items.map(([title, desc]) => (
          <div key={title} className="rounded-lg bg-slate-50 p-2 text-slate-700">
            <span className="font-semibold">{title}:</span> {desc}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EvidenceVaultSection({ vault }: { vault: UserDashboardData["evidenceVault"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Evidence vault</h2>
      <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-3">Total files: {vault.totalFiles}</div>
        <div className="rounded-lg bg-slate-50 p-3">Pending review: {vault.pendingReview}</div>
        <div className="rounded-lg bg-slate-50 p-3">Accepted: {vault.acceptedForVerification}</div>
        <div className="rounded-lg bg-slate-50 p-3">Rejected: {vault.rejectedForSafety}</div>
      </div>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Evidence is private by default and may be used only for moderation or verification. Do not upload Aadhaar, PAN, OTPs, passwords, or
        private images.
      </p>
    </section>
  );
}

export function SavedLoanAppsSection({ savedApps }: { savedApps: UserDashboardData["savedApps"] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Saved loan apps</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {savedApps.map((app) => (
          <article key={app.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={app.logoUrl} alt={`${app.name} logo`} className="h-10 w-10 rounded-lg border border-slate-200" />
              <div>
                <p className="font-semibold text-slate-900">{app.name}</p>
                <p className="text-xs text-slate-600">{app.trustScore}/100 trust score</p>
              </div>
              <div className="ml-auto">
                <RiskBadge riskLevel={app.riskLevel} />
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{app.latestTrend}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/loan-apps/${app.id}`} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">View Profile</Link>
              <Link href={`/loan-apps/${app.id}/submit-review`} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Write Review</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RecommendedNextActions() {
  const actions = [
    "Preserve evidence",
    "Contact grievance officer",
    "File cybercrime complaint",
    "File RBI or consumer complaint",
    "Use complaint template",
    "Speak to an advocate",
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Recommended next actions</h2>
      <p className="mb-3 text-sm text-slate-600">You may consider these next steps.</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <span key={a} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{a}</span>
        ))}
      </div>
    </section>
  );
}

export function PrivacySettingsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Privacy settings</h2>
      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        {[
          "Display reviews anonymously",
          "Show first name only",
          "Hide review from profile",
          "Keep evidence private",
          "Delete draft",
          "Withdraw published review request",
        ].map((item) => (
          <label key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-slate-700">
            <input type="checkbox" className="h-4 w-4" />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}

export function EmptyDashboardState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">You have not submitted any reviews yet.</h3>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Search loan apps</Link>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Submit your first review</Link>
        <Link href="/legal-action-guide" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Read legal action guide</Link>
      </div>
    </section>
  );
}

export default function UserDashboardPage() {
  const dashboardQuery = useUserDashboard();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [selectedReport, setSelectedReport] = useState<UserDashboardData["reports"][number] | null>(null);
  const [filters, setFilters] = useState({});

  const data = dashboardQuery.data;
  const filteredReports = useMemo(() => {
    const reports = data?.reports ?? [];
    const scoped = statusFilter === "all" ? reports : reports.filter((r) => r.status === statusFilter);
    return applyGlobalFilters(scoped, userDashboardFilterSchema, filters);
  }, [data?.reports, statusFilter, filters]);

  if (dashboardQuery.isLoading) {
    return <main className="min-h-screen bg-slate-50 p-6"><section className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 text-center text-sm text-slate-600">Loading dashboard data...</section></main>;
  }

  if (dashboardQuery.isError || !data) {
    return <main className="min-h-screen bg-slate-50 p-6"><section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">Could not load dashboard data. {(dashboardQuery.error as Error | null)?.message}</section></main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <DashboardHeader data={data} />
        <DashboardStatusCards summary={data.summary} onFilter={setStatusFilter} />
        <GlobalFilterPanel schema={userDashboardFilterSchema} state={filters} onChange={setFilters} />
        {data.reports.length === 0 ? (
          <EmptyDashboardState />
        ) : (
          <MyReportsList reports={filteredReports} onView={setSelectedReport} />
        )}
        <HarassmentCaseFolderSection folder={data.harassmentCaseFolder} />
        <ModerationStatusHelp />
        <EvidenceVaultSection vault={data.evidenceVault} />
        <SavedDraftsSection />
        <SavedLoanAppsSection savedApps={data.savedApps} />
        <RecommendedNextActions />
        <PrivacySettingsPanel />
      </div>
      <ReportDetailDrawer report={selectedReport} onClose={() => setSelectedReport(null)} />
    </main>
  );
}
