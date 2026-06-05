//
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCompanies, type CompanyDirectoryItem } from "@/hooks/useCompanies";

function RiskBadge({ level }: { level: CompanyDirectoryItem["riskSignalLevel"] }) {
  const tone = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  }[level];
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{level === "severe" ? "Severe" : level}</span>;
}

function VerificationBadge({ status }: { status: CompanyDirectoryItem["verificationStatus"] }) {
  const tone =
    status === "verified_public_details"
      ? "bg-emerald-100 text-emerald-700"
      : status === "conflicting_information"
      ? "bg-rose-100 text-rose-700"
      : status === "partially_verified"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

export default function CompanyNbfcDirectoryPage() {
  const companies = useCompanies();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const items = companies.data?.items ?? [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      [item.displayName, item.name, item.slug, item.entityType].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [companies.data?.items, query]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies and NBFCs</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-4xl">Company / NBFC Profiles</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Browse company, developer, and claimed NBFC partner profiles generated from linked loan app records.
          </p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Search company, NBFC, developer, or slug"
            />
            <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700">
              View loan apps
            </Link>
            <Link href="/business/claim" className="rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white">
              Claim business profile
            </Link>
          </div>
        </section>

        {companies.isLoading && <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading company profiles...</section>}

        {companies.isError && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            Could not load company profiles. {(companies.error as Error).message}
          </section>
        )}

        {!companies.isLoading && !companies.isError && filteredItems.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No company or NBFC profiles match this search. Add loan app company/NBFC details in Admin Apps to create profile links.
          </section>
        )}

        {filteredItems.length > 0 && (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{item.displayName}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.entityType.replaceAll("_", " ")}</p>
                  </div>
                  <RiskBadge level={item.riskSignalLevel} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <VerificationBadge status={item.verificationStatus} />
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.totalLinkedApps} linked apps</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.totalReviewsAcrossApps} reviews</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/entities/${item.slug}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    View NBFC / Company Profile
                  </Link>
                  <Link href={`/loan-apps?q=${encodeURIComponent(item.displayName)}`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Linked loan apps
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
