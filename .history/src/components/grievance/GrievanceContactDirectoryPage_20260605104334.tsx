//src/app/components/grievance/GrievanceContactDirectoryPage.tsx
"use client";

import { useMemo, useState } from "react";
import type { GrievanceDirectoryData, VerificationStatus } from "@/types/grievanceDirectory";

const verificationOptions: VerificationStatus[] = [
  "verified_public_details",
  "partially_verified",
  "under_verification",
  "user_submitted",
  "conflicting_information",
];

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  const cls =
    status === "verified_public_details"
      ? "bg-emerald-100 text-emerald-700"
      : status === "partially_verified"
      ? "bg-amber-100 text-amber-700"
      : status === "under_verification"
      ? "bg-slate-100 text-slate-700"
      : status === "user_submitted"
      ? "bg-blue-100 text-blue-700"
      : "bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{labelize(status)}</span>;
}

export function GrievanceSearchBar({ query, onChange }: { query: string; onChange: (value: string) => void }) {
  return (
    <input
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
      placeholder="Search app name, company, NBFC partner, or website"
    />
  );
}

export function GrievanceDirectoryHero({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Find grievance contacts for loan apps</h1>
      <p className="mt-1 text-sm text-slate-600">Search official support and grievance details before sharing personal information or making repayments.</p>
      <div className="mt-3">
        <GrievanceSearchBar query={query} onChange={onQueryChange} />
      </div>
    </section>
  );
}

export function MissingContactCTA() {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <h3 className="text-sm font-semibold text-amber-900">Missing or outdated contact details?</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <a href="/corrections" className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">Suggest correction</a>
        <a href="/corrections" className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">Submit public source</a>
        <a href="/corrections" className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">Report outdated details</a>
      </div>
    </section>
  );
}

export function GrievanceContactCard({ contact }: { contact: GrievanceDirectoryData["contacts"][number] }) {
  const missing = !contact.grievanceEmail || !contact.supportEmail || !contact.supportPhone;
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img src={contact.logoUrl} alt={contact.appName} className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{contact.appName}</h3>
            <VerificationStatusBadge status={contact.verificationStatus} />
          </div>
          <p className="mt-1 text-xs text-slate-600">{contact.companyName} • {contact.developerName}</p>
          <p className="mt-1 text-xs text-slate-600">Claimed NBFC partner: {contact.claimedNbfcPartner || "Not available"}</p>
          <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-700 sm:grid-cols-2">
            <p>Grievance email: {contact.grievanceEmail || "Missing"}</p>
            <p>Support email: {contact.supportEmail || "Missing"}</p>
            <p>Customer care: {contact.supportPhone || "Missing"}</p>
            <p>
              Website: <a href={contact.officialWebsite} className="text-slate-900 underline" target="_blank" rel="noreferrer">{contact.officialWebsite}</a>
            </p>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Last verified: {contact.lastVerifiedAt}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a href={contact.profileUrl} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">View app profile</a>
            <a href="/corrections" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Submit correction</a>
          </div>
          {missing ? <p className="mt-2 text-xs text-amber-700">Some public grievance/support details are missing. You may submit a correction with a public source.</p> : null}
        </div>
      </div>
    </article>
  );
}

export function GrievanceContactResults({ contacts }: { contacts: GrievanceDirectoryData["contacts"] }) {
  if (!contacts.length) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No contact matches found.</p>
        <p className="mt-1 text-sm text-slate-600">Try a different app/company search or clear filters.</p>
      </section>
    );
  }

  return <section className="space-y-3">{contacts.map((c) => <GrievanceContactCard key={c.id} contact={c} />)}</section>;
}

export function VerificationExplainer() {
  const rows = [
    ["Verified public details", "Details verified from official/public business sources."],
    ["Partially verified", "Some fields verified; some details still pending checks."],
    ["Under verification", "Details collected but verification is still in progress."],
    ["User submitted", "Details shared by users and pending source confirmation."],
    ["Conflicting information", "Different public sources show mismatched details."],
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Verification status explanation</h2>
      <div className="mt-2 space-y-2 text-xs text-slate-700">
        {rows.map(([title, desc]) => (
          <p key={title}><span className="font-semibold">{title}:</span> {desc}</p>
        ))}
      </div>
    </section>
  );
}

export function GrievanceSafetyNotice() {
  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
      Always verify contact details from the official website, app, or loan agreement before sharing personal information or making payment.
    </section>
  );
}

export default function GrievanceContactDirectoryPage({ data }: { data: GrievanceDirectoryData }) {
  const [query, setQuery] = useState(data.search.query);
  const [selectedStatuses, setSelectedStatuses] = useState<VerificationStatus[]>(data.filters.verificationStatus);
  const [nbfc, setNbfc] = useState(data.filters.claimedNbfcPartner);
  const [missingOnly, setMissingOnly] = useState(data.filters.missingDetailsOnly);
  const [recentlyVerified, setRecentlyVerified] = useState(false);
  const [conflictingOnly, setConflictingOnly] = useState(false);

  const filtered = useMemo(() => {
    return data.contacts.filter((contact) => {
      const text = [contact.appName, contact.companyName, contact.developerName, contact.claimedNbfcPartner, contact.officialWebsite].join(" ").toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(contact.verificationStatus)) return false;
      if (nbfc && !contact.claimedNbfcPartner.toLowerCase().includes(nbfc.toLowerCase())) return false;
      if (missingOnly) {
        const missing = !contact.grievanceEmail || !contact.supportEmail || !contact.supportPhone;
        if (!missing) return false;
      }
      if (recentlyVerified && contact.lastVerifiedAt < "2026-05-24") return false;
      if (conflictingOnly && contact.verificationStatus !== "conflicting_information") return false;
      return true;
    });
  }, [conflictingOnly, data.contacts, missingOnly, nbfc, query, recentlyVerified, selectedStatuses]);

  const toggleStatus = (status: VerificationStatus) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] space-y-4">
        <GrievanceDirectoryHero query={query} onQueryChange={setQuery} />

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            <input value={nbfc} onChange={(e) => setNbfc(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Claimed NBFC partner" />
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-2 text-xs"><input type="checkbox" checked={missingOnly} onChange={(e) => setMissingOnly(e.target.checked)} />Missing grievance details</label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-2 text-xs"><input type="checkbox" checked={recentlyVerified} onChange={(e) => setRecentlyVerified(e.target.checked)} />Recently verified</label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-2 text-xs"><input type="checkbox" checked={conflictingOnly} onChange={(e) => setConflictingOnly(e.target.checked)} />Conflicting information</label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {verificationOptions.map((status) => (
              <button key={status} onClick={() => toggleStatus(status)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${selectedStatuses.includes(status) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>
                {labelize(status)}
              </button>
            ))}
          </div>
        </section>

        <GrievanceSafetyNotice />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.7fr]">
          <div className="space-y-4">
            <GrievanceContactResults contacts={filtered} />
            <MissingContactCTA />
          </div>
          <VerificationExplainer />
        </div>
      </div>
    </main>
  );
}
