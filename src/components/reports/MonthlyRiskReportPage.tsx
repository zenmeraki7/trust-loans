import type { MonthlyRiskReportData } from "@/types/monthlyRiskReport";

export function RiskReportHero({ month, lastUpdatedAt }: { month: string; lastUpdatedAt: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Monthly Loan App Risk Report</h1>
      <p className="mt-1 text-sm text-slate-600">Aggregated user-reported trends, complaint categories, moderation transparency, and safety insights.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold">Month: {month}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold">Last updated: {lastUpdatedAt}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Download report</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Share report</button>
      </div>
    </section>
  );
}

export function MonthlyKeyMetrics({ metrics }: { metrics: MonthlyRiskReportData["metrics"] }) {
  const rows: Array<[string, number]> = [
    ["Total reviews", metrics.totalReviews],
    ["New complaint reports", metrics.newComplaintReports],
    ["Apps newly listed", metrics.appsNewlyListed],
    ["Reviews moderated", metrics.reviewsModerated],
    ["Company responses", metrics.companyResponses],
    ["Privacy redactions", metrics.privacyRedactions],
    ["Correction requests resolved", metrics.correctionRequestsResolved],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Key Metrics</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
        {rows.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{value.toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ComplaintBreakdownCharts({ items }: { items: MonthlyRiskReportData["complaintBreakdown"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Complaint Category Breakdown</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.category} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{item.category}</p>
            <p className="mt-1 text-xs text-slate-600">Reports: {item.count.toLocaleString()}</p>
            <p className="text-xs text-slate-600">Change: {item.changePercent >= 0 ? "+" : ""}{item.changePercent}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-slate-700" style={{ width: `${Math.min(100, Math.max(15, Math.floor(item.count / 20)))}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RisingPatternsSection({ items }: { items: MonthlyRiskReportData["risingPatterns"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Rising Patterns</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-700">{item.insight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CompanyResponseActivity({ activity }: { activity: MonthlyRiskReportData["companyActivity"] }) {
  const rows: Array<[string, number]> = [
    ["Profiles claimed", activity.profilesClaimed],
    ["Responses submitted", activity.responsesSubmitted],
    ["Grievance details updated", activity.grievanceDetailsUpdated],
    ["Correction requests accepted", activity.correctionRequestsAccepted],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Company Response Activity</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {rows.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ModerationTransparencySection({ data }: { data: MonthlyRiskReportData["moderationTransparency"] }) {
  const rows: Array<[string, number]> = [
    ["Reviews approved", data.reviewsApproved],
    ["Partially redacted", data.partiallyRedacted],
    ["Rejected for privacy/safety", data.rejectedForPrivacySafety],
    ["Evidence kept private", data.evidenceKeptPrivate],
    ["Sensitive data removals", data.sensitiveDataRemovals],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Moderation Transparency</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MonthlySafetyTips({ tips }: { tips: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">User Safety Tips</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}

export function RiskReportDisclaimer() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This report is based on aggregated public data and user-submitted reviews. It is not a legal or regulatory finding.
    </section>
  );
}

export default function MonthlyRiskReportPage({ data }: { data: MonthlyRiskReportData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] space-y-4">
        <RiskReportHero month={data.month} lastUpdatedAt={data.lastUpdatedAt} />
        <MonthlyKeyMetrics metrics={data.metrics} />
        <ComplaintBreakdownCharts items={data.complaintBreakdown} />
        <RisingPatternsSection items={data.risingPatterns} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CompanyResponseActivity activity={data.companyActivity} />
          <ModerationTransparencySection data={data.moderationTransparency} />
        </div>
        <MonthlySafetyTips tips={data.safetyTips} />
        <RiskReportDisclaimer />
      </div>
    </main>
  );
}
