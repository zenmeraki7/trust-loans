"use client";

import { useMemo, useState } from "react";
import type { OfficialStoreReportData } from "@/types/officialStoreReport";

export function StoreReportActionButtons({ primaryUrl, secondaryUrl, primaryLabel, secondaryLabel }: { primaryUrl: string; secondaryUrl?: string; primaryLabel: string; secondaryLabel?: string }) {
  const primaryDisabled = !primaryUrl;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {primaryDisabled ? (
        <button disabled className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-400">{primaryLabel}</button>
      ) : (
        <a href={primaryUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">{primaryLabel}</a>
      )}
      {secondaryLabel ? (
        secondaryUrl ? (
          <a href={secondaryUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">{secondaryLabel}</a>
        ) : (
          <button disabled className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-400">{secondaryLabel}</button>
        )
      ) : null}
    </div>
  );
}

export function GooglePlayReportCard({ app, links }: { app: OfficialStoreReportData["app"]; links: OfficialStoreReportData["officialLinks"] }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Report on Google Play</h3>
      <p className="mt-1 text-xs text-slate-600">Open the app's Play Store page, tap the three-dot menu, choose 'Flag as inappropriate', select a reason, and submit.</p>
      <StoreReportActionButtons
        primaryUrl={app.playStoreUrl}
        secondaryUrl={links.googlePlayHelp}
        primaryLabel="Open Play Store Page"
        secondaryLabel="How to report on Google Play"
      />
      <p className="mt-2 text-[11px] text-slate-500">Use the official app listing when available. Keep screenshots of the listing and your report for your records.</p>
    </article>
  );
}

export function AppleAppStoreReportCard({ app, links }: { app: OfficialStoreReportData["app"]; links: OfficialStoreReportData["officialLinks"] }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Report on Apple App Store</h3>
      <p className="mt-1 text-xs text-slate-600">Use Apple's Report a Problem page to report suspicious activity related to an app downloaded from the App Store.</p>
      <StoreReportActionButtons
        primaryUrl={links.appleReportProblem}
        secondaryUrl={app.appStoreUrl}
        primaryLabel="Open Apple Report a Problem"
        secondaryLabel="Open App Store Page"
      />
      <p className="mt-2 text-[11px] text-slate-500">You may need to sign in with your Apple Account.</p>
    </article>
  );
}

export function EvidenceReminderBox() {
  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
      Before reporting, save screenshots, payment proof, chat messages, app listing details, developer name, package name, and the date/time of the issue. Do not upload Aadhaar, PAN, OTPs, passwords, private photos, or bank details unless an official authority specifically requires it.
    </section>
  );
}

export function StoreReportReasonChips({ reasons, selected, onToggle }: { reasons: OfficialStoreReportData["reportReasons"]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Report reason suggestions</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <button key={reason.id} onClick={() => onToggle(reason.id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${selected.includes(reason.id) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
            {reason.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export function StoreReportSummaryBuilder({
  app,
  initial,
  selectedReasons,
  reasonMap,
}: {
  app: OfficialStoreReportData["app"];
  initial: OfficialStoreReportData["summaryBuilder"];
  selectedReasons: string[];
  reasonMap: Record<string, string>;
}) {
  const [appName, setAppName] = useState(app.name);
  const [developerName, setDeveloperName] = useState(app.developerName);
  const [storeLink, setStoreLink] = useState(app.playStoreUrl || app.appStoreUrl);
  const [issueType, setIssueType] = useState(initial.issueType);
  const [incidentDate, setIncidentDate] = useState(initial.incidentDate);
  const [factualSummary, setFactualSummary] = useState(initial.factualSummary);
  const [evidencePreserved, setEvidencePreserved] = useState(initial.evidencePreserved.join(", "));

  const selectedReasonLabels = selectedReasons.map((id) => reasonMap[id]).filter(Boolean);

  const output = useMemo(() => {
    const issue = issueType || selectedReasonLabels.join(", ") || "a user safety concern";
    const date = incidentDate || "[date]";
    const fact = factualSummary || "I observed concerning behavior and am reporting factual details for review.";
    const evidence = evidencePreserved || "screenshots/payment proof/chat messages";
    return `I am reporting this app based on my experience on ${date}. I observed ${issue}. ${fact} I have preserved ${evidence}. Please review the app listing, developer details, and user safety concerns.`;
  }, [evidencePreserved, factualSummary, incidentDate, issueType, selectedReasonLabels]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Safe report summary builder</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="App name" value={appName} onChange={(e) => setAppName(e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Developer name" value={developerName} onChange={(e) => setDeveloperName(e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs md:col-span-2" placeholder="Store link" value={storeLink} onChange={(e) => setStoreLink(e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="Issue type" value={issueType} onChange={(e) => setIssueType(e.target.value)} />
        <input type="date" className="rounded-lg border border-slate-300 px-2 py-2 text-xs" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
        <textarea className="rounded-lg border border-slate-300 px-2 py-2 text-xs md:col-span-2" rows={3} placeholder="Short factual summary" value={factualSummary} onChange={(e) => setFactualSummary(e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-2 py-2 text-xs md:col-span-2" placeholder="Evidence preserved" value={evidencePreserved} onChange={(e) => setEvidencePreserved(e.target.value)} />
      </div>
      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-semibold text-emerald-800">Generated summary</p>
        <p className="mt-1 text-sm text-emerald-900">{output}</p>
      </div>
      <button onClick={async () => { try { await navigator.clipboard.writeText(output); } catch {} }} className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Copy summary</button>
    </section>
  );
}

export default function OfficialStoreReportCard({ data }: { data: OfficialStoreReportData }) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const reasonMap = useMemo(() => Object.fromEntries(data.reportReasons.map((r) => [r.id, r.label])), [data.reportReasons]);
  const toggleReason = (id: string) => {
    setSelectedReasons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Report this app to the official store</h2>
      <p className="text-sm text-slate-600">If you believe this app violates store policies, misuses data, impersonates another service, threatens users, or behaves suspiciously, you may also report it directly to Google Play or Apple.</p>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <GooglePlayReportCard app={data.app} links={data.officialLinks} />
        <AppleAppStoreReportCard app={data.app} links={data.officialLinks} />
      </div>
      <EvidenceReminderBox />
      <StoreReportReasonChips reasons={data.reportReasons} selected={selectedReasons} onToggle={toggleReason} />
      <StoreReportSummaryBuilder app={data.app} initial={data.summaryBuilder} selectedReasons={selectedReasons} reasonMap={reasonMap} />
      <p className="text-xs text-slate-500">Safer wording reminder: share factual experience, avoid private information, and keep the report moderation-friendly. This is not legal advice.</p>
    </section>
  );
}
