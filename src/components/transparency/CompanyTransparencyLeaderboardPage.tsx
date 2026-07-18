"use client";

import { useMemo, useState } from "react";
import type { TransparencyLeaderboardData } from "@/types/transparencyLeaderboard";

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TransparencyScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "bg-emerald-100 text-emerald-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{score}</span>;
}

export function TransparencyHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Company transparency leaderboard</h1>
      <p className="mt-1 text-sm text-slate-600">See which loan apps and companies provide clearer public details, grievance channels, and user response activity.</p>
    </section>
  );
}

export function TransparencyFilters({ filters, onChange }: { filters: TransparencyLeaderboardData["filters"]; onChange: (next: TransparencyLeaderboardData["filters"]) => void }) {
  const patch = (key: keyof TransparencyLeaderboardData["filters"], value: string) => onChange({ ...filters, [key]: value });
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.entityType} onChange={(e) => patch("entityType", e.target.value)}>
          <option value="">Entity type</option>
          <option value="loan_app">Loan app</option>
          <option value="company">Company</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="App/company" value={filters.query} onChange={(e) => patch("query", e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.riskLevel} onChange={(e) => patch("riskLevel", e.target.value)}>
          <option value="">Risk level</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Verification status" value={filters.verificationStatus} onChange={(e) => patch("verificationStatus", e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.claimedProfile} onChange={(e) => patch("claimedProfile", e.target.value)}>
          <option value="">Claimed profile</option><option value="claimed">Claimed</option><option value="unclaimed">Unclaimed</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={filters.responseAvailable} onChange={(e) => patch("responseAvailable", e.target.value)}>
          <option value="">Response available</option><option value="yes">Yes</option><option value="no">No</option>
        </select>
      </div>
    </section>
  );
}

export function TransparencyLeaderboardTable({ rows }: { rows: TransparencyLeaderboardData["leaderboard"] }) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <table className="min-w-[1200px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            {["Rank", "App/company", "Transparency score", "Grievance details", "Claimed NBFC clarity", "Company response rate", "Public details verification", "Unresolved complaint ratio", "Last updated", "Action"].map((h) => (
              <th key={h} className="py-2 pr-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="py-2 pr-3 font-semibold">{row.rank}</td>
              <td className="py-2 pr-3">
                <div className="flex items-center gap-2">
                  <img src={row.logoUrl} alt={row.name} className="h-8 w-8 rounded border border-slate-200" />
                  <div>
                    <p className="font-semibold text-slate-900">{row.name}</p>
                    <p className="text-[11px] text-slate-500">{labelize(row.type)}</p>
                  </div>
                </div>
              </td>
              <td className="py-2 pr-3"><TransparencyScoreBadge score={row.transparencyScore} /></td>
              <td className="py-2 pr-3">{row.grievanceDetailsAvailable ? "Yes" : "No"}</td>
              <td className="py-2 pr-3">{labelize(row.nbfcDetailsClarity)}</td>
              <td className="py-2 pr-3">{row.companyResponseRate}%</td>
              <td className="py-2 pr-3">{labelize(row.publicDetailsVerification)}</td>
              <td className="py-2 pr-3">{Math.round(row.unresolvedComplaintRatio * 100)}%</td>
              <td className="py-2 pr-3">{row.lastUpdatedAt}</td>
              <td className="py-2 pr-3"><a href={row.profileUrl} className="rounded border border-slate-300 px-2 py-1 font-semibold">View profile</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function TransparencyScoreBreakdown({ items }: { items: TransparencyLeaderboardData["scoreComponents"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Transparency Score Breakdown</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TransparencyDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      Transparency score reflects available public and platform data. It is not a guarantee of safety or legal compliance.
    </section>
  );
}

export default function CompanyTransparencyLeaderboardPage({ data }: { data: TransparencyLeaderboardData }) {
  const [filters, setFilters] = useState(data.filters);

  const filtered = useMemo(() => {
    return data.leaderboard.filter((row) => {
      if (filters.entityType && row.type !== filters.entityType) return false;
      if (filters.query && !row.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.riskLevel && row.riskLevel !== filters.riskLevel) return false;
      if (filters.verificationStatus && !row.verificationStatus.toLowerCase().includes(filters.verificationStatus.toLowerCase())) return false;
      if (filters.claimedProfile && row.claimedProfile !== filters.claimedProfile) return false;
      if (filters.responseAvailable === "yes" && row.companyResponseRate <= 0) return false;
      if (filters.responseAvailable === "no" && row.companyResponseRate > 0) return false;
      return true;
    });
  }, [data.leaderboard, filters]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <TransparencyHero />
        <TransparencyFilters filters={filters} onChange={setFilters} />
        <TransparencyLeaderboardTable rows={filtered} />
        <TransparencyScoreBreakdown items={data.scoreComponents} />
        <TransparencyDisclaimerBox />
      </div>
    </main>
  );
}
