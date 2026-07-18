"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MissingLoanAppSubmissionData } from "@/types/missingLoanAppSubmission";

function RiskBadge({ level }: { level: "low" | "medium" | "high" | "severe" }) {
  const cls = level === "low" ? "bg-emerald-100 text-emerald-700" : level === "medium" ? "bg-amber-100 text-amber-700" : level === "high" ? "bg-orange-100 text-orange-700" : "bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{level}</span>;
}

export function MissingAppHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Can’t find a loan app?</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Suggest a loan app for review. Our team may verify public details, create a profile, and allow users to share experiences safely.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Suggest Loan App</button>
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Search Again</button>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Browse Listed Apps</Link>
      </div>
    </section>
  );
}

export function PossibleMatchCard({ match }: { match: MissingLoanAppSubmissionData["search"]["possibleMatches"][number] }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={match.logoUrl} alt={match.name} className="h-10 w-10 rounded border border-slate-200" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{match.name}</p>
          <p className="text-xs text-slate-600">{match.developerName} • {match.companyName}</p>
          <p className="text-xs text-slate-600">Claimed NBFC partner: {match.claimedNbfcPartner}</p>
        </div>
        <RiskBadge level={match.riskLevel} />
      </div>
      <div className="mt-2 flex gap-2">
        <Link href={match.profileUrl} className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold">View Profile</Link>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold">This is not the app</button>
      </div>
    </article>
  );
}

export function SearchBeforeSubmit({
  query,
  matches,
  onQuery,
}: {
  query: string;
  matches: MissingLoanAppSubmissionData["search"]["possibleMatches"];
  onQuery: (v: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-slate-900">Search before submit</h2>
      <input value={query} onChange={(e) => onQuery(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Search app name, company, developer, package name, or NBFC partner" />
      <div className="mt-3 space-y-2">{matches.map((m) => <PossibleMatchCard key={m.id} match={m} />)}</div>
    </section>
  );
}

export function AppPublicDetailsFields({
  details,
  onChange,
}: {
  details: MissingLoanAppSubmissionData["appDetails"];
  onChange: (k: keyof MissingLoanAppSubmissionData["appDetails"], v: string) => void;
}) {
  const fields: Array<[keyof MissingLoanAppSubmissionData["appDetails"], string]> = [
    ["appName", "App name"], ["logoUrl", "App logo URL"], ["playStoreUrl", "Play Store URL"], ["appStoreUrl", "App Store URL"], ["websiteUrl", "Website URL"], ["packageName", "Package name"], ["developerName", "Developer name"], ["companyName", "Company name"], ["claimedNbfcPartner", "Claimed NBFC partner"], ["supportEmail", "Support email"], ["supportPhone", "Support phone"], ["grievanceOfficerEmail", "Grievance officer email"], ["registeredAddress", "Registered address"],
  ];
  return <div className="grid grid-cols-1 gap-2 md:grid-cols-2">{fields.map(([k, l]) => <input key={k} value={details[k]} onChange={(e) => onChange(k, e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={l} />)}</div>;
}

export function UserExperienceOptionalSection({
  data,
  onSetBool,
  onToggleReviewLater,
  onNote,
}: {
  data: MissingLoanAppSubmissionData["userExperience"];
  onSetBool: (k: "hasUsedApp" | "tookLoan", v: boolean | null) => void;
  onToggleReviewLater: (v: boolean) => void;
  onNote: (v: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">User experience (optional)</h3>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <button onClick={() => onSetBool("hasUsedApp", true)} className="rounded border px-2 py-1">Used app: Yes</button>
        <button onClick={() => onSetBool("hasUsedApp", false)} className="rounded border px-2 py-1">Used app: No</button>
        <button onClick={() => onSetBool("tookLoan", true)} className="rounded border px-2 py-1">Took loan: Yes</button>
        <button onClick={() => onSetBool("tookLoan", false)} className="rounded border px-2 py-1">Took loan: No</button>
      </div>
      <label className="mt-2 block text-sm"><input type="checkbox" checked={data.wantsToReviewLater} onChange={(e) => onToggleReviewLater(e.target.checked)} className="mr-2" />Do you want to submit a review after the app is listed?</label>
      <textarea value={data.privateModeratorNote} onChange={(e) => onNote(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Private note for moderation" />
    </section>
  );
}

export function SourceEvidenceUploader({
  evidence,
  onFiles,
  onPrivate,
}: {
  evidence: MissingLoanAppSubmissionData["evidence"];
  onFiles: (files: string[]) => void;
  onPrivate: (v: boolean) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Evidence / source upload</h3>
      <input type="file" multiple onChange={(e) => onFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" />
      <div className="mt-2 flex flex-wrap gap-1">{evidence.files.map((f) => <span key={f} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{f}</span>)}</div>
      <label className="mt-2 block text-sm"><input type="checkbox" checked={evidence.evidencePrivate} onChange={(e) => onPrivate(e.target.checked)} className="mr-2" />Evidence private by default</label>
      <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Do not upload Aadhaar, PAN, OTPs, passwords, bank statements, private photos, or contact list screenshots.</p>
    </section>
  );
}

export function VerificationStepsExplainer() {
  const steps = ["Duplicate check", "Public details review", "Claims marked unverified or under verification", "Profile created as draft", "Admin moderation review", "Public profile may be published"];
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="mb-2 text-sm font-semibold text-slate-900">What happens after submission</h3><div className="space-y-1 text-sm text-slate-700">{steps.map((s, i) => <p key={s}>Step {i + 1}: {s}</p>)}</div></section>;
}

export function PrivacyNoticeBox() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">User details are not shown publicly. Submitted app details may be reviewed before publication. Evidence is private by default. Unsafe or private information may be edited or rejected.</section>;
}

export function SubmitterDetailsCard({
  submitter,
  onChange,
  onAnon,
}: {
  submitter: MissingLoanAppSubmissionData["submitter"];
  onChange: (k: keyof MissingLoanAppSubmissionData["submitter"], v: string) => void;
  onAnon: (v: boolean) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Submitter details</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input value={submitter.displayName} onChange={(e) => onChange("displayName", e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Display name" />
        <input value={submitter.email} onChange={(e) => onChange("email", e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Email" />
        <input value={submitter.phone} onChange={(e) => onChange("phone", e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Phone (optional)" />
      </div>
      <label className="mt-2 block text-sm"><input type="checkbox" checked={submitter.submitAnonymously} onChange={(e) => onAnon(e.target.checked)} className="mr-2" />Submit anonymously</label>
      <p className="mt-1 text-xs text-slate-500">We may contact you only if we need clarification. Your contact details will not appear publicly.</p>
    </section>
  );
}

export function SubmissionConfirmationBox({
  confirmations,
  onToggle,
}: {
  confirmations: MissingLoanAppSubmissionData["confirmations"];
  onToggle: (k: keyof MissingLoanAppSubmissionData["confirmations"], v: boolean) => void;
}) {
  const items: Array<[keyof MissingLoanAppSubmissionData["confirmations"], string]> = [
    ["goodFaith", "I am submitting information in good faith"],
    ["reviewBeforePublication", "I understand this may be reviewed before publication"],
    ["noSensitivePersonalData", "I have not uploaded private documents or sensitive personal data"],
    ["notLegalComplaint", "I understand this is not a legal complaint"],
    ["noFalseInfo", "I agree not to submit false or misleading information"],
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{items.map(([k, t]) => <label key={k} className="mb-1 block text-sm"><input type="checkbox" checked={confirmations[k]} onChange={(e) => onToggle(k, e.target.checked)} className="mr-2" />{t}</label>)}</section>;
}

export function MissingAppSuccessState() {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <h3 className="text-xl font-semibold text-emerald-900">App suggestion submitted</h3>
      <p className="mt-1 text-sm text-emerald-900">Thank you. Your submission has been sent for review. If approved for listing, a public profile may be created.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Submit a review later</button>
        <Link href="/loan-apps" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Browse loan apps</Link>
        <Link href="/legal-action-guide" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Open safety checklist</Link>
      </div>
    </section>
  );
}

export function DuplicateAppState() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
      <p className="font-semibold">This app may already be listed.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="rounded border border-amber-300 bg-white px-2 py-1 text-xs font-semibold">View existing profile</button>
        <button className="rounded border border-amber-300 bg-white px-2 py-1 text-xs font-semibold">Write a review</button>
        <button className="rounded border border-amber-300 bg-white px-2 py-1 text-xs font-semibold">Report an issue</button>
        <button className="rounded border border-amber-300 bg-white px-2 py-1 text-xs font-semibold">Continue as different app</button>
      </div>
    </section>
  );
}

export function MissingAppSubmissionForm({
  data,
  setData,
}: {
  data: MissingLoanAppSubmissionData;
  setData: (v: MissingLoanAppSubmissionData) => void;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Missing app submission form</h2>
      <AppPublicDetailsFields details={data.appDetails} onChange={(k, v) => setData({ ...data, appDetails: { ...data.appDetails, [k]: v } })} />
      <select value={data.appDetails.sourceFound} onChange={(e) => setData({ ...data, appDetails: { ...data.appDetails, sourceFound: e.target.value } })} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
        <option value="">Source where user found the app</option>
        {["Play Store", "App Store", "Website", "WhatsApp", "SMS", "Advertisement", "Social media", "Friend/family referral", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </section>
  );
}

export function MobileSubmitAppBar({ canSubmit, onSubmit }: { canSubmit: boolean; onSubmit: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <button onClick={onSubmit} disabled={!canSubmit} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Submit App Suggestion</button>
    </div>
  );
}

export default function SubmitMissingLoanAppPage({ initial }: { initial: MissingLoanAppSubmissionData }) {
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const canSubmit = useMemo(() => {
    const c = data.confirmations;
    return Boolean(data.appDetails.appName.trim() && data.submitter.email.trim() && c.goodFaith && c.reviewBeforePublication && c.noSensitivePersonalData && c.notLegalComplaint && c.noFalseInfo);
  }, [data]);

  const doSubmit = () => {
    if (!canSubmit) return;
    if (data.search.possibleMatches.length > 0 && data.search.query.toLowerCase().includes("swift")) {
      setShowDuplicate(true);
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <MissingAppHero />
        {submitted ? (
          <MissingAppSuccessState />
        ) : (
          <>
            <SearchBeforeSubmit query={data.search.query} matches={data.search.possibleMatches} onQuery={(v) => setData({ ...data, search: { ...data.search, query: v } })} />
            {showDuplicate && <DuplicateAppState />}
            <MissingAppSubmissionForm data={data} setData={setData} />
            <UserExperienceOptionalSection
              data={data.userExperience}
              onSetBool={(k, v) => setData({ ...data, userExperience: { ...data.userExperience, [k]: v } })}
              onToggleReviewLater={(v) => setData({ ...data, userExperience: { ...data.userExperience, wantsToReviewLater: v } })}
              onNote={(v) => setData({ ...data, userExperience: { ...data.userExperience, privateModeratorNote: v } })}
            />
            <SourceEvidenceUploader
              evidence={data.evidence}
              onFiles={(files) => setData({ ...data, evidence: { ...data.evidence, files } })}
              onPrivate={(v) => setData({ ...data, evidence: { ...data.evidence, evidencePrivate: v } })}
            />
            <VerificationStepsExplainer />
            <PrivacyNoticeBox />
            <SubmitterDetailsCard
              submitter={data.submitter}
              onChange={(k, v) => setData({ ...data, submitter: { ...data.submitter, [k]: v } })}
              onAnon={(v) => setData({ ...data, submitter: { ...data.submitter, submitAnonymously: v } })}
            />
            <SubmissionConfirmationBox confirmations={data.confirmations} onToggle={(k, v) => setData({ ...data, confirmations: { ...data.confirmations, [k]: v } })} />
            <button onClick={doSubmit} disabled={!canSubmit} className="hidden rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 md:inline-flex">Submit App Suggestion</button>
          </>
        )}
      </div>
      {!submitted && <MobileSubmitAppBar canSubmit={canSubmit} onSubmit={doSubmit} />}
    </main>
  );
}
