"use client";

import Link from "next/link";
import type { AppProfile, CompanyResponse, Review, RiskLevel, SimilarApp } from "@/types/loanAppProfile";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";
import { useLoanAppProfile } from "@/hooks/useLoanAppProfile";
import { useAppReviews } from "@/hooks/useAppReviews";

const statusMap: Record<AppProfile["status"], { label: string; classes: string }> = {
  claimed: { label: "Claimed", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  unclaimed: { label: "Unclaimed", classes: "bg-slate-100 text-slate-700 border-slate-200" },
  under_review: { label: "Under Review", classes: "bg-amber-100 text-amber-700 border-amber-200" },
  reported_by_users: { label: "Reported by Users", classes: "bg-rose-100 text-rose-700 border-rose-200" },
};

const riskMap: Record<RiskLevel, { label: string; classes: string }> = {
  low: { label: "Low Risk", classes: "bg-emerald-100 text-emerald-700" },
  medium: { label: "Medium Risk", classes: "bg-amber-100 text-amber-700" },
  high: { label: "High Risk", classes: "bg-orange-100 text-orange-700" },
  severe: { label: "Severe Complaints", classes: "bg-rose-100 text-rose-700" },
};

function scoreColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

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

export function StatusBadge({ status }: { status: AppProfile["status"] }) {
  const config = statusMap[status];
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.classes}`}>{config.label}</span>;
}

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const config = riskMap[riskLevel];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>{config.label}</span>;
}

export function ProfileHero({ app }: { app: AppProfile }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <img src={app.logoUrl} alt={`${app.name} logo`} className="h-16 w-16 rounded-2xl border border-slate-200 object-cover" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{app.name}</h1>
              <StatusBadge status={app.status} />
              <RiskBadge riskLevel={app.riskLevel} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Public Review and Risk-Awareness Profile
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{app.trustScore}/100 Trust Score</span>
              <RatingStars rating={app.averageRating} />
              <span>{app.averageRating.toFixed(1)} ({app.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">{app.summaryLine}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Browse All Apps
          </Link>
          <Link href={`/loan-apps/${app.id}/submit-review`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Write a Review</Link>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Report an Issue</button>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Compare Apps</button>
        </div>
      </div>
    </section>
  );
}

export function TrustScoreCard({ label, score, explanation }: { label: string; score: number; explanation: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        <span className="text-sm font-semibold text-slate-900">{score}/100</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${scoreColor(score)}`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-600">{explanation}</p>
    </article>
  );
}

export function ScoreBreakdown({ app }: { app: AppProfile }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Trust Score Breakdown</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {app.scoreBreakdown.map((metric) => (
          <TrustScoreCard key={metric.key} label={metric.label} score={metric.score} explanation={metric.explanation} />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        This section summarizes what users are reporting, what details are claimed by the app, and what information may still be unverified.
      </p>
    </section>
  );
}

export function AppDetailsCard({ app }: { app: AppProfile }) {
  const rows: Array<[string, string]> = [
    ["App Name", app.name],
    ["Developer / Company Name", `${app.developerName} / ${app.companyName}`],
    ["Website", app.website],
    ["Play Store Link", app.playStoreUrl],
    ["App Store Link", app.appStoreUrl],
    ["Claimed NBFC Partner", app.claimedNbfcPartner],
    ["RBI Registration Claim", app.rbiRegistrationClaim],
    ["Grievance Officer Details", `${app.grievanceOfficer.name} | ${app.grievanceOfficer.email} | ${app.grievanceOfficer.phone}`],
    ["Support", `${app.support.email} | ${app.support.phone}`],
    ["Registered Address", app.grievanceOfficer.address],
    ["Last Updated Date", app.lastUpdated],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">App Details</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 break-all text-sm text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{review.reviewerName}</p>
          <p className="text-xs text-slate-500">{review.isVerifiedBorrower ? "Verified borrower" : "Unverified review"}</p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{review.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{review.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{review.createdAt}</span>
        <div className="flex items-center gap-3">
          <button className="font-medium text-slate-700">Helpful ({review.helpfulCount})</button>
          <button className="font-medium text-rose-600">Report review</button>
        </div>
      </div>
    </article>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Community Reviews</h2>
      <p className="text-xs text-slate-500">
        Reviews are moderated and displayed as user-submitted experiences to help borrowers understand risk signals and app behavior patterns.
      </p>
      <div className="grid gap-3">
        {reviews.length === 0 ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            No public reviews are available yet. Submitted reviews may still be under moderation.
          </article>
        ) : reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

export function ComplaintPatternSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length || 1;
  const percentage = (tag: string) => Math.round((reviews.filter((r) => r.tags.includes(tag)).length / total) * 100);
  const topIssue = ["Harassment", "Hidden Charges", "Data Misuse", "Threat Calls", "Contact List Abuse"].reduce((best, tag) =>
    percentage(tag) > percentage(best) ? tag : best,
  "Harassment");

  const cards = [
    { label: "Most Reported Issue", value: topIssue },
    { label: "Harassment Mentions", value: `${percentage("Harassment")}%` },
    { label: "Hidden Charges Mentions", value: `${percentage("Hidden Charges")}%` },
    { label: "Data Privacy Mentions", value: `${percentage("Data Misuse")}%` },
    { label: "Recovery Abuse Mentions", value: `${percentage("Threat Calls")}%` },
    { label: "Complaint Volume Trend", value: "Increasing (sample trend)" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Complaint Pattern Summary</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UserActionGuide() {
  const actions = [
    "File complaint with app grievance officer",
    "File complaint with RBI CMS",
    "Report cyber harassment",
    "Preserve screenshots and call recordings where legally allowed",
    "Send legal notice through an advocate",
    "Report impersonation or photo morphing to cybercrime portal",
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">What users can do next</h2>
      <p className="mb-4 text-sm text-slate-600">
        These are practical safety actions users can consider. This page is for public review and risk awareness, not final legal findings.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <div key={action} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
            {action}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompanyResponseBox({ response }: { response: CompanyResponse }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Company response</h2>
        <span className="text-xs text-slate-500">{response.responseDate}</span>
      </div>
      <p className="text-sm text-slate-700">{response.body}</p>
      <p className="mt-2 text-xs text-slate-500">
        Verification status: {response.verificationStatus === "verified_company" ? "Verified company representative" : "Pending verification"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Claim this profile</button>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Respond to reviews</button>
      </div>
    </section>
  );
}

export function SimilarAppsGrid({ apps }: { apps: SimilarApp[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Similar Apps</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {apps.map((app) => (
          <article key={app.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <img src={app.logoUrl} alt={`${app.name} logo`} className="h-10 w-10 rounded-xl border border-slate-200" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{app.name}</h3>
                <p className="text-xs text-slate-500">{app.reviewCount.toLocaleString()} reviews</p>
              </div>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">{app.trustScore}/100</span>
              <RiskBadge riskLevel={app.riskLevel} />
            </div>
            <button className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">View Profile</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl gap-2">
        <button className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Write Review</button>
        <button className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Report Issue</button>
      </div>
    </div>
  );
}

const emptyCompanyResponse: CompanyResponse = {
  body: "No approved public company response is available for this profile yet.",
  responseDate: "",
  verificationStatus: "pending_verification",
};

export default function LoanAppProfilePage({ slug }: { slug: string }) {
  const profileQuery = useLoanAppProfile(slug);
  const app = profileQuery.data?.app;
  const reviewsQuery = useAppReviews(app?.id ?? "", {});
  const reviews = reviewsQuery.data?.items ?? [];
  const companyResponse = emptyCompanyResponse;
  const similarApps: SimilarApp[] = [];

  if (profileQuery.isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading app profile...</section>
      </main>
    );
  }

  if (profileQuery.isError || !app) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load this app profile. {(profileQuery.error as Error | null)?.message}</p>
          <button onClick={() => profileQuery.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
        </section>
      </main>
    );
  }

  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      id: app.id,
      name: app.name,
      developerName: app.developerName,
      playStoreUrl: app.playStoreUrl,
      appStoreUrl: app.appStoreUrl,
    },
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <ProfileHero app={app} />
        <ScoreBreakdown app={app} />
        <AppDetailsCard app={app} />
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This page is a public review, risk-awareness, and user-safety profile. Information is based on public records, app-provided details,
          and user-submitted reviews. We do not make final legal findings. Users should independently verify lender and NBFC details before
          borrowing.
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-900">How to read this page</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>What people are reporting in moderated community reviews</li>
            <li>What details the app or company claims publicly</li>
            <li>What information is marked as verified or unverified</li>
            <li>What risk signals users may want to consider before borrowing</li>
            <li>What safe actions users can take next</li>
          </ul>
        </section>
        {reviewsQuery.isLoading && <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Loading public reviews...</section>}
        {reviewsQuery.isError && <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">Could not load public reviews. {(reviewsQuery.error as Error).message}</section>}
        <ComplaintPatternSummary reviews={reviews} />
        <ReviewsList reviews={reviews} />
        <UserActionGuide />
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Report this app outside our platform</h2>
          <OfficialStoreReportCard data={storeReportData} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Report to grievance officer</h3>
              <p className="mt-1 text-xs text-slate-600">Use official grievance contact details and keep your complaint factual with evidence references.</p>
              <a href={`mailto:${app.grievanceOfficer.email}`} className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Email grievance officer</a>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Report cyber harassment</h3>
              <p className="mt-1 text-xs text-slate-600">For threats, image abuse, or digital coercion, you may consider reporting through official cyber channels.</p>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open cybercrime portal</a>
            </article>
          </div>
        </section>
        {reviews.some((review) => review.body) ? <CompanyResponseBox response={companyResponse} /> : null}
        {similarApps.length > 0 ? <SimilarAppsGrid apps={similarApps} /> : null}
      </div>
      <MobileStickyCTA />
    </main>
  );
}
