"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { isHighRiskPaydayApp, paydayLoanApps } from "@/data/paydayLoanApps";
import { getPaydayLoanLogo } from "@/data/paydayLoanLogos";
import {
  LoanAppResultCard,
  LoanAppSortBar,
} from "@/components/loan-directory/LoanAppsDirectoryPage";
import type { LoanAppDirectoryItem } from "@/types/loanAppsDirectory";

const logoColors = [
  "bg-blue-700",
  "bg-teal-700",
  "bg-violet-700",
  "bg-rose-700",
  "bg-amber-700",
  "bg-sky-700",
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3);

const logoDataUrl = (name: string, index: number) => {
  const colors = [
    "#1d4ed8",
    "#0f766e",
    "#7c3aed",
    "#be123c",
    "#b45309",
    "#0369a1",
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="18" fill="${colors[index % colors.length]}"/><text x="48" y="56" fill="white" font-family="Arial" font-size="24" font-weight="700" text-anchor="middle">${initials(name)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export default function PaydayLoanAppsDirectoryPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredApps = useMemo(
    () =>
      paydayLoanApps.filter(
        (app) =>
          !normalizedQuery ||
          app.name.toLowerCase().includes(normalizedQuery) ||
          app.nbfcName?.toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );
  const directoryItems: LoanAppDirectoryItem[] = useMemo(
    () =>
      filteredApps.map((app, index) => ({
        id: app.id,
        name: app.name,
        logoUrl: getPaydayLoanLogo(app.id) ?? logoDataUrl(app.name, index),
        developerName: "Under verification",
        companyName: "Under verification",
        claimedNbfcPartner: app.nbfcName ?? "Under verification",
        trustScore: 0,
        averageRating: 0,
        reviewCount: 0,
        riskLevel: isHighRiskPaydayApp(app) ? "high" : "medium",
        status: "under_review",
        topComplaintTags: isHighRiskPaydayApp(app)
          ? ["Harassment reports", "Contact-list misuse", "Threat calls"]
          : [],
        summary: isHighRiskPaydayApp(app)
          ? "Elevated caution indicators are associated with this claimed NBFC relationship and require independent verification."
          : "Scores and labels are awareness indicators based on available public details and user-submitted reviews.",
        platform: ["website"],
        lastUpdated: "Profile under verification",
        complaintCounts: { harassment: 0, hiddenCharges: 0, dataPrivacy: 0 },
        grievanceDetailsAvailable: false,
      })),
    [filteredApps],
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Payday loan directory
          </p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Research Payday Loan Apps
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Browse the payday loan app names supplied for review and check
                the available NBFC relationship details before borrowing.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/learn/payday-loans"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Payday loans guide
                </Link>
                <Link
                  href="/loan-apps"
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  All loan apps
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label
                htmlFor="payday-app-search"
                className="text-sm font-semibold text-slate-900"
              >
                Find a payday loan app
              </label>
              <input
                id="payday-app-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search app or NBFC name"
                className="mt-3 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-3 text-sm text-slate-600">
                {filteredApps.length} of {paydayLoanApps.length} apps shown
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Payday apps listed</p>
            <p className="mt-2 text-3xl font-semibold">
              {paydayLoanApps.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">NBFC details available</p>
            <p className="mt-2 text-3xl font-semibold">
              {paydayLoanApps.filter((app) => app.nbfcName).length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Under verification</p>
            <p className="mt-2 text-3xl font-semibold">
              {paydayLoanApps.filter((app) => !app.nbfcName).length}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Directory results
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Payday loan apps
            </h2>
          </div>
          <LoanAppSortBar value="trust_desc" onChange={() => undefined} />
          {directoryItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
              No matching payday loan app found.
            </div>
          ) : (
            <div className="grid items-start gap-4 xl:grid-cols-2">
              {directoryItems.map((app) => (
                <LoanAppResultCard
                  key={app.id}
                  app={app}
                  basePath="/payday-loan-apps"
                  reviewHref={`/payday-loan-apps/${app.id}#reviews`}
                  showRiskWarning
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Listing an app or a claimed NBFC relationship does not confirm
          approval, registration, safety, or suitability. Verify lender details
          independently before borrowing.
        </section>
      </div>
    </main>
  );
}
