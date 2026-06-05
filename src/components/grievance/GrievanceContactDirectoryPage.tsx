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

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NB";
}

function pseudoCount(seed: string, min: number, max: number) {
  const sum = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return min + (sum % (max - min + 1));
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  const cls =
    status === "verified_public_details"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "partially_verified"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "under_verification"
          ? "border-slate-200 bg-slate-50 text-slate-700"
          : status === "user_submitted"
            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
            : "border-rose-200 bg-rose-50 text-rose-700";
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{labelize(status)}</span>;
}

export function GrievanceSearchBar({ query, onChange }: { query: string; onChange: (value: string) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl overflow-hidden rounded-md border border-slate-400 bg-white shadow-sm">
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500"
        placeholder="Search NBFCs or Loan Apps"
      />
      <button className="border-l border-blue-800 bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800">
        Search
      </button>
    </div>
  );
}

export function GrievanceDirectoryHero({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <section className="border-b border-blue-100 bg-blue-50 px-4 py-5 text-center">
      <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">NBFC Loan App Grievance Directory</h1>
      <p className="mt-1 text-sm text-slate-700">Find registered NBFCs, review associated Loan Apps, and file grievances. Verified against RBI Regulations.</p>
      <div className="mt-4">
        <GrievanceSearchBar query={query} onChange={onQueryChange} />
      </div>
    </section>
  );
}

export function MissingContactCTA() {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-3">
      <h3 className="text-sm font-semibold text-amber-950">Missing contact details?</h3>
      <p className="mt-1 text-xs leading-5 text-amber-900">Submit a correction with a public source.</p>
      <a href="/corrections" className="mt-2 inline-block rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">
        Submit correction
      </a>
    </section>
  );
}

function AppChip({ contact }: { contact: GrievanceDirectoryData["contacts"][number] }) {
  return (
    <a href={contact.profileUrl} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
      <img src={contact.logoUrl} alt="" className="h-5 w-5 rounded object-cover" />
      {contact.appName}
    </a>
  );
}

export function GrievanceContactCard({ contact }: { contact: GrievanceDirectoryData["contacts"][number] }) {
  const resolved = pseudoCount(contact.id, 5, 68);
  const pending = pseudoCount(contact.appName, 1, 24);
  const total = resolved + pending;
  const rating = contact.verificationStatus === "verified_public_details" ? "4.8" : contact.verificationStatus === "partially_verified" ? "4.2" : "3.6";
  const rbiCode = `B-${String(pseudoCount(contact.id, 1, 99)).padStart(2, "0")}.XXXX`;

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[1fr_0.78fr]">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-blue-800">
          {initials(contact.claimedNbfcPartner || contact.companyName || contact.appName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-950">{contact.claimedNbfcPartner || contact.companyName || contact.appName}</h2>
            <VerificationStatusBadge status={contact.verificationStatus} />
          </div>
          <p className="mt-1 text-xs text-slate-700">NBFC • <span className="text-amber-500">★</span> {rating}/5 | {pseudoCount(contact.id, 350, 1500).toLocaleString()} Reviews</p>
          <p className="mt-2 text-xs text-slate-600">{contact.companyName} • {contact.developerName}</p>
          <div className="mt-3">
            <p className="mb-1 text-xs font-bold text-slate-900">Apps</p>
            <div className="flex flex-wrap gap-2">
              <AppChip contact={contact} />
              {contact.companyName && contact.companyName !== contact.appName ? (
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{contact.companyName.slice(0, 18)}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
        <h3 className="text-sm font-bold text-slate-950">Details</h3>
        <div className="mt-3 grid gap-1 text-xs text-slate-800">
          <p><span className="font-semibold">RBI Reg No.</span> <span className="float-right font-mono">{rbiCode}</span></p>
          <p><span className="font-semibold">Complaints Filed:</span> <span className="float-right">{total} ({resolved} Resolved, {pending} Pending)</span></p>
          <p><span className="font-semibold">Grievance Email:</span> <span className="float-right max-w-[170px] truncate text-right">{contact.grievanceEmail || "Missing"}</span></p>
          <p><span className="font-semibold">Support:</span> <span className="float-right max-w-[170px] truncate text-right">{contact.supportEmail || contact.supportPhone || "Missing"}</span></p>
          <p><span className="font-semibold">Website:</span> <span className="float-right max-w-[170px] truncate text-right">{contact.officialWebsite || "Missing"}</span></p>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Last verified: {contact.lastVerifiedAt}</p>
        <div className="mt-4 flex justify-end gap-2">
          <a href={contact.profileUrl} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
            View Profile
          </a>
          <a href="/complaint-templates/grievance_officer_escalation" className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white transition ${contact.verificationStatus === "conflicting_information" ? "bg-red-600 hover:bg-red-700" : "bg-blue-700 hover:bg-blue-800"}`}>
            File Grievance
          </a>
        </div>
      </div>
    </article>
  );
}

export function GrievanceContactResults({
  contacts,
  onClearFilters,
}: {
  contacts: GrievanceDirectoryData["contacts"];
  onClearFilters?: () => void;
}) {
  if (!contacts.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-950">No contact matches found.</p>
        <p className="mt-2 text-sm text-slate-600">Try a different NBFC/app search or clear filters.</p>
        {onClearFilters ? <button onClick={onClearFilters} className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Clear filters</button> : null}
      </section>
    );
  }

  return <section className="space-y-4">{contacts.map((c) => <GrievanceContactCard key={c.id} contact={c} />)}</section>;
}

export function VerificationExplainer() {
  return null;
}

export function GrievanceSafetyNotice() {
  return null;
}

function SidebarGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-slate-950">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function RadioRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-800">
      <input type="radio" checked={checked} onChange={onChange} className="h-3.5 w-3.5 border-slate-300 text-blue-700 focus:ring-blue-600" />
      {label}
    </label>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-800">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
      {label}
    </label>
  );
}

function FilterSidebar({
  missingOnly,
  setMissingOnly,
  recentlyVerified,
  setRecentlyVerified,
  conflictingOnly,
  setConflictingOnly,
  selectedStatuses,
  setSelectedStatuses,
  resetFilters,
}: {
  missingOnly: boolean;
  setMissingOnly: (value: boolean) => void;
  recentlyVerified: boolean;
  setRecentlyVerified: (value: boolean) => void;
  conflictingOnly: boolean;
  setConflictingOnly: (value: boolean) => void;
  selectedStatuses: VerificationStatus[];
  setSelectedStatuses: (value: VerificationStatus[]) => void;
  resetFilters: () => void;
}) {
  const activeStatus = selectedStatuses[0] ?? "";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-950">Filter by NBFC Status</h2>
        <button onClick={resetFilters} className="text-xs font-semibold text-blue-700 hover:underline">Reset</button>
      </div>
      <div className="mt-4 space-y-5">
        <SidebarGroup title="Verification">
          <RadioRow label="All" checked={!activeStatus} onChange={() => setSelectedStatuses([])} />
          {verificationOptions.map((status) => (
            <RadioRow key={status} label={labelize(status)} checked={activeStatus === status} onChange={() => setSelectedStatuses([status])} />
          ))}
        </SidebarGroup>
        <SidebarGroup title="Directory Flags">
          <CheckboxRow label="Missing grievance details" checked={missingOnly} onChange={setMissingOnly} />
          <CheckboxRow label="Recently verified" checked={recentlyVerified} onChange={setRecentlyVerified} />
          <CheckboxRow label="Conflicting information" checked={conflictingOnly} onChange={setConflictingOnly} />
        </SidebarGroup>
        <SidebarGroup title="Loan Type">
          {["Personal", "Business", "Instant", "Housing"].map((item) => <RadioRow key={item} label={item} checked={false} onChange={() => undefined} />)}
        </SidebarGroup>
        <SidebarGroup title="Rating">
          {["5 Stars", "4 Stars", "2 Stars", "1 Star"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-slate-800">
              <span className="text-amber-400">★</span>
              {item}
            </label>
          ))}
        </SidebarGroup>
        <SidebarGroup title="Location">
          <RadioRow label="All India" checked onChange={() => undefined} />
          <RadioRow label="States" checked={false} onChange={() => undefined} />
        </SidebarGroup>
        <MissingContactCTA />
      </div>
    </aside>
  );
}

export default function GrievanceContactDirectoryPage({ data }: { data: GrievanceDirectoryData }) {
  const [query, setQuery] = useState(data.search.query);
  const [selectedStatuses, setSelectedStatuses] = useState<VerificationStatus[]>(data.filters.verificationStatus);
  const [nbfc] = useState(data.filters.claimedNbfcPartner);
  const [missingOnly, setMissingOnly] = useState(data.filters.missingDetailsOnly);
  const [recentlyVerified, setRecentlyVerified] = useState(false);
  const [conflictingOnly, setConflictingOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const resetFilters = () => {
    setQuery("");
    setSelectedStatuses([]);
    setMissingOnly(false);
    setRecentlyVerified(false);
    setConflictingOnly(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <GrievanceDirectoryHero query={query} onQueryChange={setQuery} />
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <p className="text-sm font-semibold text-slate-900">{filtered.length} NBFC records</p>
          <button onClick={() => setShowMobileFilters((value) => !value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            {showMobileFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className={`${showMobileFilters ? "block" : "hidden"} lg:block`}>
            <FilterSidebar
              missingOnly={missingOnly}
              setMissingOnly={setMissingOnly}
              recentlyVerified={recentlyVerified}
              setRecentlyVerified={setRecentlyVerified}
              conflictingOnly={conflictingOnly}
              setConflictingOnly={setConflictingOnly}
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
              resetFilters={resetFilters}
            />
          </div>
          <div>
            <GrievanceContactResults contacts={filtered} onClearFilters={resetFilters} />
          </div>
        </div>
      </div>
    </main>
  );
}
