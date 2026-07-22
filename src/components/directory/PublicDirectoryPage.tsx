"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePublicDirectory } from "@/hooks/usePublicDirectory";
import type { PublicDirectoryItem, PublicDirectoryType } from "@/types/publicDirectory";

const typeLabels: Record<PublicDirectoryType | "all", string> = {
  all: "All",
  loan_app: "Loan apps",
  nbfc: "NBFCs",
  bank: "Banks",
  digital_lender: "Digital lenders",
};

const typeDescriptions: Record<PublicDirectoryType, string> = {
  loan_app: "App profile",
  nbfc: "NBFC profile",
  bank: "Bank profile",
  digital_lender: "Digital lender",
};

const riskTone: Record<PublicDirectoryItem["riskLevel"], string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  severe: "bg-rose-100 text-rose-700",
};

const filterFields = [
  ["legalEntity", "Legal entity", "Company/legal entity"],
  ["nbfc", "NBFC / regulated entity", "NBFC, bank, lender"],
  ["interestRate", "Interest rate", "e.g. 24%, 18-36%"],
  ["processingFee", "Processing fee", "e.g. 2%, ₹499"],
  ["loanTenure", "Loan tenure", "e.g. 7 days, 12 months"],
  ["complaintCategory", "Complaint category", "Harassment, hidden charges"],
  ["recoveryConcern", "Recovery concern", "Threat calls, contact abuse"],
] as const;

const selectFilters = [
  { key: "complaintVolume", label: "Complaint volume", options: [["any", "Any"], ["has_complaints", "Has complaints"], ["high_volume", "High volume"]] },
  { key: "regulatoryStatus", label: "Regulatory verification", options: [["all", "Any"], ["verified", "Verified"], ["claimed", "Claimed"], ["under_verification", "Under verification"]] },
  { key: "appStoreAvailability", label: "App-store availability", options: [["any", "Any"], ["play_store", "Play Store"], ["app_store", "App Store"], ["both", "Both stores"], ["store_available", "Any store"]] },
  { key: "safetyLevel", label: "Safety level", options: [["all", "Any"], ["low", "Low"], ["medium", "Medium"], ["high", "High"], ["severe", "Severe"]] },
] as const;

function DirectoryTypeTabs({
  value,
  facets,
  onChange,
}: {
  value: string;
  facets?: Record<PublicDirectoryType, number>;
  onChange: (value: string) => void;
}) {
  const tabs: Array<PublicDirectoryType | "all"> = ["all", "loan_app", "nbfc", "bank", "digital_lender"];
  const total = facets ? Object.values(facets).reduce((sum, count) => sum + count, 0) : 0;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Directory category filters">
      {tabs.map((tab) => {
        const active = value === tab || (!value && tab === "all");
        const count = tab === "all" ? total : facets?.[tab] ?? 0;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
              active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            {typeLabels[tab]} <span className="opacity-75">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

function DirectoryResultCard({ item }: { item: PublicDirectoryItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {item.logoUrl ? (
            <img src={item.logoUrl} alt={`${item.name} logo`} className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="text-sm font-bold text-slate-500">{item.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-semibold text-slate-950">{item.name}</p>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{typeDescriptions[item.type]}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskTone[item.riskLevel]}`}>{item.riskLevel} signal</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">Verification: {item.verificationStatus}</span>
            {item.legalEntityName ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Legal: {item.legalEntityName}</span> : null}
            {item.associatedRegulatedEntity ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Regulated entity: {item.associatedRegulatedEntity}</span> : null}
            {item.interestRateRange ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Interest: {item.interestRateRange}</span> : null}
            {item.processingFees ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Fee: {item.processingFees}</span> : null}
            {item.loanTenure ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Tenure: {item.loanTenure}</span> : null}
            <span className="rounded-full bg-slate-100 px-2.5 py-1">Store: {item.appStoreAvailability.replaceAll("_", " ")}</span>
            {item.trustScore !== null ? <span className="rounded-full bg-slate-100 px-2.5 py-1">Trust score: {item.trustScore}/100</span> : null}
            {item.reviewCount > 0 ? <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.reviewCount.toLocaleString()} reviews</span> : null}
            {item.linkedAppsCount > 0 ? <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.linkedAppsCount} linked profile{item.linkedAppsCount === 1 ? "" : "s"}</span> : null}
          </div>
          {[...item.complaintCategories, ...item.publicWarningLabels].length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[...item.complaintCategories, ...item.publicWarningLabels].slice(0, 6).map((label) => (
                <span key={label} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">{label}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={item.href} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          View profile
        </Link>
        <Link href={`/complaint-wizard?entity=${encodeURIComponent(item.name)}`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Prepare complaint
        </Link>
      </div>
    </article>
  );
}

export default function PublicDirectoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "all";
  const [draft, setDraft] = useState(q);
  const filters = {
    q,
    type,
    legalEntity: searchParams.get("legalEntity") ?? "",
    nbfc: searchParams.get("nbfc") ?? "",
    interestRate: searchParams.get("interestRate") ?? "",
    processingFee: searchParams.get("processingFee") ?? "",
    loanTenure: searchParams.get("loanTenure") ?? "",
    complaintVolume: searchParams.get("complaintVolume") ?? "any",
    minComplaintVolume: searchParams.get("minComplaintVolume") ?? "",
    complaintCategory: searchParams.get("complaintCategory") ?? "",
    recoveryConcern: searchParams.get("recoveryConcern") ?? "",
    regulatoryStatus: searchParams.get("regulatoryStatus") ?? "all",
    appStoreAvailability: searchParams.get("appStoreAvailability") ?? "any",
    safetyLevel: searchParams.get("safetyLevel") ?? "all",
    limit: 50,
  };
  const directory = usePublicDirectory(filters);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}${next.toString() ? `?${next.toString()}` : ""}`);
  };

  const submitSearch = () => updateParam("q", draft.trim());

  const clearFilters = () => {
    setDraft("");
    router.push(pathname);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Public lender directory</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Search loan apps, NBFCs, banks, and digital lenders.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Find public profiles, linked app records, verification signals, grievance details, and complaint-preparation paths from one searchable directory.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <label htmlFor="public-directory-search" className="sr-only">Search public directory</label>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <input
                  id="public-directory-search"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Search name, app, NBFC, bank, domain"
                />
                <button type="button" onClick={submitSearch} className="min-h-12 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <DirectoryTypeTabs value={type} facets={directory.data?.facets} onChange={(value) => updateParam("type", value)} />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Search and filter</h2>
                <p className="mt-1 text-xs text-slate-500">Filter by entity identity, NBFC, pricing, complaint signals, verification, store availability, and safety level.</p>
              </div>
              <button type="button" onClick={clearFilters} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Clear all</button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {filterFields.map(([key, label, placeholder]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                  <input
                    value={String(filters[key] ?? "")}
                    onChange={(event) => updateParam(key, event.target.value)}
                    placeholder={placeholder}
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Min complaint volume</span>
                <input
                  type="number"
                  min={0}
                  value={String(filters.minComplaintVolume ?? "")}
                  onChange={(event) => updateParam("minComplaintVolume", event.target.value)}
                  placeholder="e.g. 100"
                  className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              {selectFilters.map((filter) => (
                <label key={filter.key} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{filter.label}</span>
                  <select
                    value={String(filters[filter.key] ?? "")}
                    onChange={(event) => updateParam(filter.key, event.target.value)}
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {filter.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </div>

          {directory.isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading directory...</div>
          ) : null}

          {directory.isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
              Could not load the public directory. {(directory.error as Error).message}
              <button type="button" onClick={() => directory.refetch()} className="mt-3 block rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
                Try again
              </button>
            </div>
          ) : null}

          {!directory.isLoading && !directory.isError && directory.data?.items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">No matching public profile found.</h2>
              <p className="mt-2 text-sm text-slate-600">Try a different name, app package, bank/NBFC name, or official domain.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/suggest-app" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Suggest a loan app</Link>
                <Link href="/business/claim" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Claim or create business profile</Link>
              </div>
            </div>
          ) : null}

          {directory.data?.items.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {directory.data.items.map((item) => <DirectoryResultCard key={item.id} item={item} />)}
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Directory records are consumer-awareness signals, not final legal findings. Always verify registration and grievance contacts with official sources before borrowing or paying.
        </section>
      </div>
    </main>
  );
}
