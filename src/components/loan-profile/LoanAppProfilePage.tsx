"use client";

import Link from "next/link";
import { useAppReviews } from "@/hooks/useAppReviews";
import { useLoanAppProfile } from "@/hooks/useLoanAppProfile";
import type { AppProfile, Review, RiskLevel, ScoreMetric } from "@/types/loanAppProfile";

const riskMap: Record<RiskLevel, { label: string; classes: string }> = {
  low: { label: "Low risk", classes: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  medium: { label: "Medium risk", classes: "bg-amber-50 text-amber-700 ring-amber-200" },
  high: { label: "High risk", classes: "bg-orange-50 text-orange-700 ring-orange-200" },
  severe: { label: "Severe complaints", classes: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const statusMap: Record<AppProfile["status"], { label: string; classes: string }> = {
  claimed: { label: "Claimed profile", classes: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  unclaimed: { label: "Unclaimed", classes: "bg-slate-100 text-slate-700 ring-slate-200" },
  under_review: { label: "Under review", classes: "bg-amber-50 text-amber-700 ring-amber-200" },
  reported_by_users: { label: "Reported by users", classes: "bg-rose-50 text-rose-700 ring-rose-200" },
};

function RatingStars({ rating, size = "text-base" }: { rating: number; size?: string }) {
  const safeRating = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
  const rounded = Math.round(safeRating);
  return (
    <div className={`flex items-center gap-0.5 ${size}`} aria-label={`${safeRating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rounded ? "text-amber-400" : "text-slate-300"} aria-hidden="true">
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const risk = riskMap[riskLevel];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${risk.classes}`}>{risk.label}</span>;
}

function StatusBadge({ status }: { status: AppProfile["status"] }) {
  const profileStatus = statusMap[status];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${profileStatus.classes}`}>{profileStatus.label}</span>;
}

function scoreTone(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function AppSummaryCard({ app }: { app: AppProfile }) {
  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-center">
        <img src={app.logoUrl} alt={`${app.name} logo`} className="mx-auto h-20 w-20 rounded-2xl border border-slate-200 bg-white p-2 object-contain" />
        <h2 className="mt-4 text-2xl font-bold text-slate-950">{app.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{app.companyName || app.developerName}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <RatingStars rating={app.averageRating} />
          <span className="text-sm font-semibold text-slate-950">{app.averageRating.toFixed(1)}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{app.reviewCount.toLocaleString()} reviews</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 border-y border-slate-100 py-4">
        <StatusBadge status={app.status} />
        <RiskBadge riskLevel={app.riskLevel} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-950">{app.reviewCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Reviews</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-950">{app.averageRating.toFixed(1)}</p>
          <p className="text-[11px] text-slate-500">Rating</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-950">{app.trustScore}</p>
          <p className="text-[11px] text-slate-500">Trust</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-950">TrustScore</span>
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{app.trustScore}/100</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className={`h-2 rounded-full ${scoreTone(app.trustScore)}`} style={{ width: `${app.trustScore}%` }} />
        </div>
      </div>

      <dl className="space-y-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</dt>
          <dd className="mt-1 break-all text-slate-800">{app.website || "Not listed"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
          <dd className="mt-1 break-all text-slate-800">{app.support.email || app.grievanceOfficer.email || "Not listed"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</dt>
          <dd className="mt-1 text-slate-800">{app.support.phone || app.grievanceOfficer.phone || "Not listed"}</dd>
        </div>
      </dl>

      <Link href={`/loan-apps/${app.id}/submit-review`} className="block rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800">
        Write a Review
      </Link>
      <Link href="/loan-apps" className="block rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
        Back to directory
      </Link>
    </aside>
  );
}

function RatingsOverview({ app }: { app: AppProfile }) {
  return (
    <section className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-bold text-slate-950">{app.averageRating.toFixed(1)}</p>
            <RatingStars rating={app.averageRating} size="text-xl" />
            <p className="mt-2 text-sm text-slate-500">{app.reviewCount.toLocaleString()} borrower reviews</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-3xl font-bold text-slate-950">{app.trustScore}</p>
            <p className="text-xs text-slate-500">TrustScore</p>
          </div>
        </div>
        <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          Star distribution is hidden until all public review counts are available from the backend. The reviews below are moderated public reviews only.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Summary</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">{app.summaryLine}</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Claimed NBFC</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{app.claimedNbfcPartner || "Not listed"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">RBI claim</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{app.rbiRegistrationClaim || "Not listed"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreBreakdown({ metrics }: { metrics: ScoreMetric[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-slate-950">Score breakdown</h2>
        <Link href="/review-policy" className="text-xs font-semibold text-blue-700">How is this calculated?</Link>
      </div>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.key}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{metric.label}</span>
              <span className="font-semibold text-slate-950">{Math.round(metric.score / 10)}/10</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div className={`h-2.5 rounded-full ${scoreTone(metric.score)}`} style={{ width: `${metric.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border-b border-slate-200 bg-white p-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {review.reviewerName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-950">{review.reviewerName}</p>
              <p className="text-xs text-slate-500">{review.isVerifiedBorrower ? "Verified reviewer" : "Community reviewer"}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={review.rating} />
            <h3 className="font-bold text-slate-950">{review.title}</h3>
          </div>
        </div>
        <p className="shrink-0 text-xs text-slate-500">{review.createdAt}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <button className="font-medium text-slate-700">Helpful ({review.helpfulCount})</button>
        <button className="font-medium text-slate-700">Share</button>
        <button className="ml-auto font-medium text-rose-600">Report</button>
      </div>
    </article>
  );
}

function ReviewsPanel({ reviews, isLoading, isError, error }: { reviews: Review[]; isLoading: boolean; isError: boolean; error: unknown }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950">Borrower reviews</h2>
          <p className="text-xs text-slate-500">Moderated user-submitted experiences. Not legal findings.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            <option>Most Recent</option>
            <option>Highest Rating</option>
            <option>Lowest Rating</option>
          </select>
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            <option>All ratings</option>
            <option>5 star</option>
            <option>1 star</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="p-5 text-sm text-slate-600">Loading public reviews...</div>
      ) : isError ? (
        <div className="p-5 text-sm text-rose-700">Could not load reviews. {(error as Error).message}</div>
      ) : reviews.length === 0 ? (
        <div className="p-5 text-sm text-slate-600">No public reviews are available yet. Submitted reviews may still be under moderation.</div>
      ) : (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </section>
  );
}

function ContactInfo({ app }: { app: AppProfile }) {
  const rows = [
    ["Operating entity", app.companyName || app.developerName],
    ["Claimed NBFC partner", app.claimedNbfcPartner || "Not listed"],
    ["Grievance email", app.grievanceOfficer.email || "Not listed"],
    ["Support phone", app.support.phone || app.grievanceOfficer.phone || "Not listed"],
    ["Registered address", app.grievanceOfficer.address || "Not listed"],
    ["Last updated", app.lastUpdated],
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">Company and contact info</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 break-words font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function IssueTiles({ reviews }: { reviews: Review[] }) {
  const allTags = reviews.flatMap((review) => review.tags);
  const issueNames = ["Harassment", "Hidden Charges", "Data Misuse", "Threat Calls", "Contact List Abuse", "Poor Support"];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">Common reported issues</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {issueNames.map((issue) => {
          const count = allTags.filter((tag) => tag.toLowerCase().includes(issue.toLowerCase().split(" ")[0])).length;
          return (
            <Link key={issue} href="/patterns" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-slate-300 hover:bg-white">
              <p className="text-sm font-semibold text-slate-950">{issue}</p>
              <p className="mt-1 text-xs text-slate-500">{count || 0} mentions</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function MobileStickyCTA({ appId }: { appId: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl gap-2">
        <Link href={`/loan-apps/${appId}/submit-review`} className="flex-1 rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white">Write Review</Link>
        <Link href="/emergency-help" className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Emergency Help</Link>
      </div>
    </div>
  );
}

export default function LoanAppProfilePage({ slug }: { slug: string }) {
  const profileQuery = useLoanAppProfile(slug);
  const app = profileQuery.data?.app;
  const reviewsQuery = useAppReviews(app?.id ?? "", {});
  const reviews = reviewsQuery.data?.items ?? [];

  if (profileQuery.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading app profile...</section>
      </main>
    );
  }

  if (profileQuery.isError || !app) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load this app profile. {(profileQuery.error as Error | null)?.message}</p>
          <button onClick={() => profileQuery.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <section className="border-b border-slate-200 bg-blue-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <span className="px-2">/</span>
            <Link href="/loan-apps" className="hover:text-slate-950">Loan Apps</Link>
            <span className="px-2">/</span>
            <span>{app.name}</span>
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{app.name} Loan App Reviews</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{app.summaryLine}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/loan-apps/${app.id}/submit-review`} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">Write a Review</Link>
              <Link href="/compare" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Compare Apps</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <AppSummaryCard app={app} />
        <div className="space-y-5">
          <RatingsOverview app={app} />
          <ScoreBreakdown metrics={app.scoreBreakdown} />
          <ContactInfo app={app} />
          <IssueTiles reviews={reviews} />
          <ReviewsPanel reviews={reviews} isLoading={reviewsQuery.isLoading} isError={reviewsQuery.isError} error={reviewsQuery.error} />
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            This profile summarizes public details, app-provided claims, and moderated borrower reviews. It is for awareness and safer decision-making, not a final legal finding.
          </section>
        </div>
      </div>

      <MobileStickyCTA appId={app.id} />
    </main>
  );
}
