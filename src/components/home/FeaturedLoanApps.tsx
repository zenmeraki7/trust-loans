"use client";

import Link from "next/link";
import { useLoanApps } from "@/hooks/useLoanApps";
import type { RiskLevel } from "@/types/loanAppProfile";

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  severe: "bg-rose-50 text-rose-700 ring-rose-200",
};

function riskLabel(risk: RiskLevel) {
  return risk === "severe" ? "Severe complaints" : `${risk[0].toUpperCase()}${risk.slice(1)} risk`;
}

export default function FeaturedLoanApps() {
  const loanApps = useLoanApps({ limit: 3, sort: "trust_desc" });
  const apps = loanApps.data?.items.slice(0, 3) ?? [];

  if (loanApps.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-slate-100" />
            <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (loanApps.isError || apps.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Featured loan apps will appear here after apps are added to the directory.
        <Link href="/admin/apps" className="ml-2 font-semibold text-slate-950 underline underline-offset-4">
          Add an app
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {apps.map((app) => (
        <article key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <img src={app.logoUrl} alt={`${app.name} logo`} className="h-12 w-12 rounded-xl border border-slate-200 object-cover" />
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${riskStyles[app.riskLevel]}`}>{riskLabel(app.riskLevel)}</span>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-950">{app.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{app.companyName || app.developerName}</p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
            <span className="font-semibold text-slate-950">{app.trustScore}/100 trust</span>
            <span className="text-slate-500">{app.reviewCount.toLocaleString()} reviews</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href={`/loan-apps/${app.id}`} className="flex-1 rounded-xl bg-slate-950 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
              View profile
            </Link>
            <Link href={`/loan-apps/${app.id}/submit-review`} className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Review
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
