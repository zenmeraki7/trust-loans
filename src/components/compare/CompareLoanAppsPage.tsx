import Link from "next/link";
import type { CompareLoanApp } from "@/types/compareLoanApps";
import type { RiskLevel } from "@/types/loanAppProfile";

export function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const tone: Record<RiskLevel, string> = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  };
  const label = riskLevel === "severe" ? "Severe Complaints" : `${riskLevel[0].toUpperCase()}${riskLevel.slice(1)} Risk`;
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone[riskLevel]}`}>{label}</span>;
}

export function TrustScoreBadge({ score }: { score: number }) {
  const tone = score >= 70 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{score}/100</span>;
}

export function AppCompareSelector() {
  return (
    <div className="mt-4 flex flex-col gap-2 md:flex-row">
      <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm placeholder:text-slate-400" placeholder="Search and select up to 3 loan apps" />
      <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Add App</button>
      <Link href="/loan-apps" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
        Browse All Loan Apps
      </Link>
    </div>
  );
}

const filterFields = [
  ["q", "App or lender name", "Search app, lender, developer"],
  ["legalEntity", "Legal entity", "Company/legal name"],
  ["nbfc", "NBFC", "NBFC or regulated entity"],
  ["interestRate", "Interest rate", "e.g. 18-36%"],
  ["processingFee", "Processing fee", "e.g. 2%, ₹499"],
  ["loanTenure", "Loan tenure", "e.g. 30 days"],
  ["complaintCategory", "Complaint category", "Hidden charges, harassment"],
  ["recoveryConcern", "Recovery concern", "Threat calls, contact abuse"],
] as const;

const selectFilters = [
  { key: "complaintVolume", label: "Complaint volume", options: [["any", "Any"], ["has_complaints", "Has complaints"], ["high_volume", "High volume"]] },
  { key: "regulatoryStatus", label: "Regulatory verification", options: [["all", "Any"], ["verified", "Verified"], ["claimed", "Claimed"], ["under_verification", "Under verification"]] },
  { key: "appStoreAvailability", label: "App-store availability", options: [["any", "Any"], ["play_store", "Play Store"], ["app_store", "App Store"], ["both", "Both"], ["store_available", "Any store"]] },
  { key: "safetyLevel", label: "Safety level", options: [["all", "Any"], ["low", "Low"], ["medium", "Medium"], ["high", "High"], ["severe", "Severe"]] },
] as const;

type CompareFilters = Record<string, string>;

export function CompareFilterPanel({ filters, onChange, onClear }: { filters: CompareFilters; onChange: (key: string, value: string) => void; onClear: () => void }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Filter comparison candidates</p>
        <button type="button" onClick={onClear} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Clear filters</button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filterFields.map(([key, label, placeholder]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            <input value={filters[key] ?? ""} onChange={(event) => onChange(key, event.target.value)} placeholder={placeholder} className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Min complaint volume</span>
          <input type="number" min={0} value={filters.minComplaintVolume ?? ""} onChange={(event) => onChange("minComplaintVolume", event.target.value)} placeholder="e.g. 100" className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
        </label>
        {selectFilters.map((filter) => (
          <label key={filter.key} className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{filter.label}</span>
            <select value={filters[filter.key] ?? ""} onChange={(event) => onChange(filter.key, event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
              {filter.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

export function CompareHeader({ filters, onFilterChange, onClearFilters }: { filters: CompareFilters; onFilterChange: (key: string, value: string) => void; onClearFilters: () => void }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Compare loan apps before you borrow</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
        Review trust scores, complaint patterns, claimed NBFC partners, and user experiences side by side.
      </p>
      <AppCompareSelector />
      <CompareFilterPanel filters={filters} onChange={onFilterChange} onClear={onClearFilters} />
    </section>
  );
}

export function SelectedCompareCards({ apps }: { apps: CompareLoanApp[] }) {
  return (
    <section className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="flex gap-3 overflow-x-auto">
        {apps.map((app) => (
          <article key={app.id} className="w-[min(280px,calc(100vw-4rem))] shrink-0 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-3">
              <img src={app.logoUrl} alt={`${app.name} logo`} className="h-10 w-10 rounded-xl border border-slate-200" />
              <div>
                <h3 className="font-semibold text-slate-900">{app.name}</h3>
                <p className="text-xs text-slate-500">{app.developerName}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">Claimed NBFC partner: {app.claimedNbfcPartner}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RiskBadge riskLevel={app.riskLevel} />
              <TrustScoreBadge score={app.trustScore} />
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <RatingStars rating={app.averageRating} />
              <span>{app.averageRating.toFixed(1)} ({app.reviewCount} reviews)</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={app.profileUrl} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Profile</Link>
              <Link href={`${app.profileUrl}/submit-review`} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Write review</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function metricTone(value: number) {
  if (value >= 70) return "text-emerald-700";
  if (value >= 40) return "text-amber-700";
  return "text-rose-700";
}

export function CompareMetricTable({ apps }: { apps: CompareLoanApp[] }) {
  const rows: Array<{ label: string; get: (app: CompareLoanApp) => string | number; isNumeric?: boolean }> = [
    { label: "Overall Trust Score", get: (a) => a.trustScore, isNumeric: true },
    { label: "Average Rating", get: (a) => a.averageRating.toFixed(1) },
    { label: "Total Reviews", get: (a) => a.reviewCount.toLocaleString() },
    { label: "Harassment Complaint Score", get: (a) => a.scores.harassment, isNumeric: true },
    { label: "Hidden Charges Score", get: (a) => a.scores.hiddenCharges, isNumeric: true },
    { label: "Data Privacy Concern Score", get: (a) => a.scores.dataPrivacy, isNumeric: true },
    { label: "Recovery Behaviour Score", get: (a) => a.scores.recoveryBehaviour, isNumeric: true },
    { label: "Customer Support Score", get: (a) => a.scores.customerSupport, isNumeric: true },
    { label: "Transparency Score", get: (a) => a.scores.transparency, isNumeric: true },
    { label: "Grievance Response Score", get: (a) => a.scores.grievanceResponse, isNumeric: true },
    { label: "Company Response Status", get: (a) => (a.publicDetails.companyResponded ? "Available" : "Not available") },
    { label: "Claimed NBFC Partner Available", get: (a) => (a.publicDetails.nbfcPartnerAvailable ? "Available" : "Under verification") },
    { label: "Legal entity", get: (a) => a.legalEntityName },
    { label: "Associated NBFC / regulated entity", get: (a) => a.associatedRegulatedEntity },
    { label: "Interest-rate range", get: (a) => a.interestRateRange },
    { label: "Processing fee", get: (a) => a.processingFees },
    { label: "Loan tenure", get: (a) => a.loanTenure },
    { label: "Regulatory verification", get: (a) => a.regulatoryVerificationStatus.replaceAll("_", " ") },
    { label: "App-store availability", get: (a) => a.appStoreAvailability.replaceAll("_", " ") },
    { label: "Known complaint categories", get: (a) => a.knownComplaintCategories.join(", ") || "Not listed" },
    { label: "Public warning labels", get: (a) => a.publicWarningLabels.join(", ") || "Not listed" },
    { label: "Recovery-practice information", get: (a) => a.recoveryPracticeInfo },
    { label: "Grievance Officer Details Available", get: (a) => (a.publicDetails.grievanceOfficerAvailable ? "Available" : "Unavailable") },
    { label: "Last Updated Date", get: (a) => a.publicDetails.lastUpdated },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Score comparison</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-3">Metric</th>
              {apps.map((app) => (
                <th key={app.id} className="py-2 pr-3">{app.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium text-slate-700">{row.label}</td>
                {apps.map((app) => {
                  const val = row.get(app);
                  const cls = typeof val === "number" && row.isNumeric ? metricTone(val) : "text-slate-700";
                  return <td key={app.id + row.label} className={`py-2 pr-3 ${cls}`}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ComplaintPatternCompare({ apps }: { apps: CompareLoanApp[] }) {
  const metrics = [
    ["Harassment reports", "harassmentReportsPercent"],
    ["Contact list abuse reports", "contactListAbusePercent"],
    ["Hidden charges reports", "hiddenChargesPercent"],
    ["Data misuse reports", "dataMisusePercent"],
    ["Fake legal notice reports", "fakeLegalNoticePercent"],
    ["Photo morphing reports", "photoMorphingPercent"],
    ["Payment not updated reports", "paymentNotUpdatedPercent"],
    ["Loan not closed reports", "loanNotClosedPercent"],
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Complaint pattern comparison</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <article key={app.id} className="rounded-xl border border-slate-200 p-3">
            <h3 className="mb-2 font-semibold text-slate-900">{app.name}</h3>
            <div className="space-y-2">
              {metrics.map(([label, key]) => {
                const value = app.complaintPatterns[key];
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-orange-400" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RatingDistributionCompare({ apps }: { apps: CompareLoanApp[] }) {
  const stars = [
    ["5 star", "fiveStar"],
    ["4 star", "fourStar"],
    ["3 star", "threeStar"],
    ["2 star", "twoStar"],
    ["1 star", "oneStar"],
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Rating distribution</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {apps.map((app) => (
          <article key={app.id} className="rounded-xl border border-slate-200 p-3">
            <h3 className="mb-2 font-semibold text-slate-900">{app.name}</h3>
            <div className="space-y-2">
              {stars.map(([label, key]) => {
                const value = app.ratingDistribution[key];
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-slate-600" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ComparisonSummaryInsights({ apps }: { apps: CompareLoanApp[] }) {
  const highestTrust = apps.reduce((a, b) => (a.trustScore >= b.trustScore ? a : b));
  const highestHiddenCharges = apps.reduce((a, b) =>
    a.complaintPatterns.hiddenChargesPercent >= b.complaintPatterns.hiddenChargesPercent ? a : b,
  );
  const leastGrievanceDetails = apps.find((a) => !a.publicDetails.grievanceOfficerAvailable);
  const companyResponseApp = apps.find((a) => a.publicDetails.companyResponded);

  const insights = [
    `${highestTrust.name} has the highest trust score among selected apps.`,
    `${highestHiddenCharges.name} has more user reports mentioning hidden charges.`,
    leastGrievanceDetails
      ? `${leastGrievanceDetails.name} has fewer public grievance details available.`
      : "Public grievance detail availability appears consistent across selected apps.",
    companyResponseApp
      ? `Company response information is available for ${companyResponseApp.name}.`
      : "Company response information is currently limited across selected apps.",
    "Review complaint patterns carefully and verify lender or NBFC claims independently before borrowing.",
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Comparison summary</h2>
      <div className="space-y-2">
        {insights.map((insight) => (
          <p key={insight} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            {insight}
          </p>
        ))}
      </div>
    </section>
  );
}

export function CompareDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Comparison data is based on public information, app-provided details, and user-submitted reviews. We do not make final legal findings.
      Users should independently verify lender, NBFC, and grievance details before borrowing.
    </section>
  );
}

export function EmptyCompareState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Select loan apps to compare.</h2>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Search loan apps</button>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Browse directory</Link>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View highest reviewed apps</button>
      </div>
    </section>
  );
}

export default function CompareLoanAppsPage({ apps, filters, onFilterChange, onClearFilters }: { apps: CompareLoanApp[]; filters: CompareFilters; onFilterChange: (key: string, value: string) => void; onClearFilters: () => void }) {
  if (apps.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <CompareHeader filters={filters} onFilterChange={onFilterChange} onClearFilters={onClearFilters} />
          <EmptyCompareState />
          <CompareDisclaimerBox />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <CompareHeader filters={filters} onFilterChange={onFilterChange} onClearFilters={onClearFilters} />
        <SelectedCompareCards apps={apps.slice(0, 3)} />
        <CompareMetricTable apps={apps.slice(0, 3)} />
        <ComplaintPatternCompare apps={apps.slice(0, 3)} />
        <RatingDistributionCompare apps={apps.slice(0, 3)} />
        <ComparisonSummaryInsights apps={apps.slice(0, 3)} />
        <CompareDisclaimerBox />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Add App</button>
      </div>
    </main>
  );
}
