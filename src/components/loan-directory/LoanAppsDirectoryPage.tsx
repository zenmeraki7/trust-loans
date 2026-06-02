"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RiskLevel } from "@/types/loanAppProfile";
import type { DirectoryStats, LoanAppDirectoryItem } from "@/types/loanAppsDirectory";
import { useMemo, useState } from "react";
import { useLoanApps } from "@/hooks/useLoanApps";

export function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rounded ? "text-amber-500" : "text-slate-300"}>
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
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[riskLevel]}`}>{label}</span>;
}

export function TrustScoreBadge({ score }: { score: number }) {
  const tone = score >= 70 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{score}/100 Trust Score</span>;
}

export function DirectoryHeroSearch({
  query,
  onQueryChange,
  onSearch,
  onQuickFilter,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onQuickFilter: (filter: string) => void;
}) {
  const quickFilters = [
    "High Risk Apps",
    "Most Reviewed",
    "Recently Reported",
    "Claimed NBFC Partner",
    "Apps With Harassment Reports",
    "Apps With Hidden Charge Reports",
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Search loan apps before you borrow</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
        Check user reviews, complaint patterns, claimed NBFC partners, trust scores, and risk signals before using any loan app.
      </p>
      <div className="mt-5 flex flex-col gap-2 md:flex-row">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400"
          placeholder="Search by app name, company, NBFC partner, or developer"
        />
        <button onClick={onSearch} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">Search</button>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700">
          Submit a Review
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button key={filter} onClick={() => onQuickFilter(filter)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

export function PlatformStatsCards({ stats }: { stats: DirectoryStats }) {
  const cards = [
    ["Total loan apps listed", stats.totalAppsListed.toLocaleString()],
    ["Total user reviews", stats.totalUserReviews.toLocaleString()],
    ["Apps under review", stats.appsUnderReview.toLocaleString()],
    ["High-risk complaint patterns detected", stats.highRiskPatternsDetected.toLocaleString()],
    ["Reviews submitted this month", stats.reviewsSubmittedThisMonth.toLocaleString()],
  ];
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </section>
  );
}

export function LoanAppFilterSidebar({
  values,
  onChange,
}: {
  values: { riskLevel: string; rating: string; complaintTag: string };
  onChange: (key: "riskLevel" | "rating" | "complaintTag", value: string) => void;
}) {
  const groups: Array<{ title: string; key: "riskLevel" | "rating" | "complaintTag"; options: Array<{ label: string; value: string }> }> = [
    { title: "Risk Level", key: "riskLevel", options: [{ label: "Low Risk", value: "LOW" }, { label: "Medium Risk", value: "MEDIUM" }, { label: "High Risk", value: "HIGH" }, { label: "Severe Complaints", value: "SEVERE_COMPLAINT_PATTERN" }] },
    { title: "Rating", key: "rating", options: [{ label: "4 stars and above", value: "4" }, { label: "3 stars and above", value: "3" }, { label: "Below 2 stars", value: "below_2" }] },
    {
      title: "Complaint Type",
      key: "complaintTag",
      options: ["Harassment", "Hidden Charges", "Contact List Abuse", "Threat Calls", "Photo Morphing", "Data Misuse", "Fake Legal Notice", "Payment Not Updated", "Loan Not Closed", "Good Support"].map((label) => ({ label, value: label })),
    },
  ];
  return (
    <aside className="hidden space-y-4 lg:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Filters</h3>
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</p>
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={values[group.key] === option.value}
                      onChange={(event) => onChange(group.key, event.target.checked ? option.value : "")}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function MobileFilterDrawer({ onClear }: { onClear: () => void }) {
  return (
    <div className="sticky top-0 z-20 mb-3 flex gap-2 bg-gradient-to-b from-slate-50 to-transparent py-2 lg:hidden">
      <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Filters</button>
      <button onClick={onClear} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Clear</button>
    </div>
  );
}

export function LoanAppSortBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const sorts = [
    ["trust_desc", "Highest Trust Score"],
    ["trust_asc", "Lowest Trust Score"],
    ["reviews_desc", "Most Reviewed"],
    ["recent", "Recently Added"],
    ["reported", "Most Reported"],
    ["updated", "Recently Updated"],
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="text-sm font-semibold text-slate-800">Sort by:</span>
      {sorts.map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)} className={`rounded-full border px-3 py-1 text-xs font-medium ${value === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function LoanAppResultCard({ app }: { app: LoanAppDirectoryItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <img src={app.logoUrl} alt={`${app.name} logo`} className="h-14 w-14 rounded-xl border border-slate-200" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
            <RiskBadge riskLevel={app.riskLevel} />
            <TrustScoreBadge score={app.trustScore} />
          </div>
          <p className="text-sm text-slate-600">{app.developerName} • {app.companyName}</p>
          <p className="mt-1 text-sm text-slate-600">Claimed partner: {app.claimedNbfcPartner}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <RatingStars rating={app.averageRating} />
            <span>{app.averageRating.toFixed(1)} ({app.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {app.topComplaintTags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-600">{app.summary}</p>
      <p className="mt-2 text-xs text-slate-500">Complaint pattern and summary are based on user-submitted reviews and public details. Last updated: {app.lastUpdated}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/loan-apps/${app.id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View Profile</Link>
        <Link href={`/loan-apps/${app.id}/submit-review`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Write Review</Link>
      </div>
    </article>
  );
}

export function CompareAppsBar({ selectedApps }: { selectedApps: LoanAppDirectoryItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Compare apps</h3>
          <p className="text-sm text-slate-600">Select up to 3 apps to compare trust score, ratings, complaint metrics, and response/grievance details.</p>
        </div>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Compare selected apps</button>
      </div>
      {selectedApps.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">App</th><th className="py-2 pr-3">Trust</th><th className="py-2 pr-3">Rating</th><th className="py-2 pr-3">Reviews</th><th className="py-2 pr-3">Harassment</th><th className="py-2 pr-3">Hidden Charges</th><th className="py-2 pr-3">Data Privacy</th><th className="py-2 pr-3">Company Response</th><th className="py-2">Grievance Details</th>
              </tr>
            </thead>
            <tbody>
              {selectedApps.map((app) => (
                <tr key={app.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-3 font-medium">{app.name}</td><td className="py-2 pr-3">{app.trustScore}</td><td className="py-2 pr-3">{app.averageRating.toFixed(1)}</td><td className="py-2 pr-3">{app.reviewCount}</td><td className="py-2 pr-3">{app.complaintCounts.harassment}</td><td className="py-2 pr-3">{app.complaintCounts.hiddenCharges}</td><td className="py-2 pr-3">{app.complaintCounts.dataPrivacy}</td><td className="py-2 pr-3">{app.status === "company_responded" ? "Responded" : "Pending"}</td><td className="py-2">{app.grievanceDetailsAvailable ? "Available" : "Missing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function EmptyDirectoryState({ onClear }: { onClear: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">No matching loan app found.</h3>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Suggest a loan app for review</button>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Submit your experience</Link>
        <button onClick={onClear} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Clear filters</button>
      </div>
    </section>
  );
}

export function DirectoryDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Scores and summaries are based on public information, app-provided details, and user-submitted reviews. We do not make final legal findings.
      Always verify lender and NBFC details independently before borrowing.
    </section>
  );
}

export default function LoanAppsDirectoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const riskLevel = searchParams.get("riskLevel") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const complaintTag = searchParams.get("complaintTag") ?? "";
  const sort = searchParams.get("sort") ?? "trust_desc";
  const [queryDraft, setQueryDraft] = useState(query);
  const { data, isLoading, isError, error, refetch } = useLoanApps({ q: query, riskLevel, sort });

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  };

  const clearFilters = () => {
    setQueryDraft("");
    router.push(pathname);
  };

  const apps = data?.items ?? [];
  const filteredApps = useMemo(() => {
    const filtered = apps.filter((app) => {
      const ratingMatch = !rating || (rating === "below_2" ? app.averageRating < 2 : app.averageRating >= Number(rating));
      const tagMatch = !complaintTag || app.topComplaintTags.some((tag) => tag.toLowerCase() === complaintTag.toLowerCase());
      return ratingMatch && tagMatch;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "trust_asc") return a.trustScore - b.trustScore;
      if (sort === "reviews_desc") return b.reviewCount - a.reviewCount;
      if (sort === "reported") return (b.complaintCounts.harassment + b.complaintCounts.hiddenCharges + b.complaintCounts.dataPrivacy) - (a.complaintCounts.harassment + a.complaintCounts.hiddenCharges + a.complaintCounts.dataPrivacy);
      if (sort === "recent" || sort === "updated") return String(b.lastUpdated).localeCompare(String(a.lastUpdated));
      return b.trustScore - a.trustScore;
    });
  }, [apps, rating, complaintTag, sort]);

  const stats: DirectoryStats = {
    totalAppsListed: data?.meta.total ?? apps.length,
    totalUserReviews: apps.reduce((sum, app) => sum + app.reviewCount, 0),
    appsUnderReview: apps.filter((app) => app.status === "under_review").length,
    highRiskPatternsDetected: apps.filter((app) => app.riskLevel === "high" || app.riskLevel === "severe").length,
    reviewsSubmittedThisMonth: 0,
  };

  const selectedForCompare = filteredApps.slice(0, 2);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <DirectoryHeroSearch
          query={queryDraft}
          onQueryChange={setQueryDraft}
          onSearch={() => updateParam("q", queryDraft)}
          onQuickFilter={(filter) => {
            if (filter === "High Risk Apps") updateParam("riskLevel", "HIGH");
            if (filter === "Most Reviewed") updateParam("sort", "reviews_desc");
            if (filter === "Apps With Harassment Reports") updateParam("complaintTag", "Harassment");
            if (filter === "Apps With Hidden Charge Reports") updateParam("complaintTag", "Hidden Charges");
          }}
        />
        <PlatformStatsCards stats={stats} />
        <CompareAppsBar selectedApps={selectedForCompare.slice(0, 3)} />
        <MobileFilterDrawer onClear={clearFilters} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <LoanAppFilterSidebar values={{ riskLevel, rating, complaintTag }} onChange={updateParam} />
          <section className="space-y-4">
            <LoanAppSortBar value={sort} onChange={(value) => updateParam("sort", value)} />
            {isLoading && <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading loan apps...</section>}
            {isError && (
              <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
                <p>Could not load loan apps. {(error as Error).message}</p>
                <button onClick={() => refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
              </section>
            )}
            {!isLoading && !isError && (filteredApps.length === 0 ? <EmptyDirectoryState onClear={clearFilters} /> : filteredApps.map((app) => <LoanAppResultCard key={app.id} app={app} />))}
          </section>
        </div>
        <DirectoryDisclaimerBox />
      </div>
    </main>
  );
}
