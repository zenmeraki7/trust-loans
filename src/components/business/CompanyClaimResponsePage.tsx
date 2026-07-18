"use client";

import { useState } from "react";
import type { BusinessClaimData, ClaimStatus } from "@/types/businessClaim";
import type { RiskLevel } from "@/types/loanAppProfile";

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const tone: Record<RiskLevel, string> = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  };
  const label = riskLevel === "severe" ? "Severe Complaints" : `${riskLevel[0].toUpperCase()}${riskLevel.slice(1)} Risk`;
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone[riskLevel]}`}>{label}</span>;
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const map: Record<ClaimStatus, { label: string; cls: string }> = {
    unclaimed: { label: "Unclaimed", cls: "bg-slate-100 text-slate-700" },
    claim_pending: { label: "Claim Pending", cls: "bg-amber-100 text-amber-700" },
    claimed: { label: "Verified company", cls: "bg-emerald-100 text-emerald-700" },
    disputed_claim: { label: "Disputed Claim", cls: "bg-rose-100 text-rose-700" },
  };
  const c = map[status];
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${c.cls}`}>{c.label}</span>;
}

export function BusinessHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Claim and manage your loan app profile</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Verify your company details, respond to reviews, update grievance information, and help users access accurate support channels.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Claim a Profile</button>
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Respond to Reviews</button>
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Update Grievance Details</button>
      </div>
      <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        NBFCs and loan-app companies can submit their own claim. Trust Loans reviews the evidence and approves access before any company management tools are enabled.
      </p>
    </section>
  );
}

export function BusinessProfileSearch({ results }: { results: BusinessClaimData["searchResults"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Profile search</h2>
      <input className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Search by app, developer, company, website, Play Store URL, or claimed NBFC partner" />
      <div className="space-y-2">
        {results.map((r) => (
          <article key={r.appId} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <img src={r.logoUrl} alt={`${r.appName} logo`} className="h-10 w-10 rounded-lg border border-slate-200" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{r.appName}</p>
                <p className="text-xs text-slate-600">{r.developerName} • {r.companyName}</p>
                <p className="text-xs text-slate-600">Claimed NBFC partner: {r.claimedNbfcPartner}</p>
              </div>
              <ClaimStatusBadge status={r.claimStatus} />
              <RiskBadge riskLevel={r.riskLevel} />
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Start Claim</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BusinessAccountSetup() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Create an institutional account</h2>
      <p className="mt-1 text-sm leading-6 text-slate-700">NBFCs, banks, and authorized loan-app operators can create a verified organization handle. If we already created your profile, use the claim flow below instead.</p>
      {submitted ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Organization account request received. Trust Loans will verify the institution and its representative before activating the handle.</p>
      ) : (
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <select required className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"><option value="">Institution type</option><option>NBFC</option><option>Bank</option><option>Loan app operator</option></select>
          <input required className="rounded-xl border border-slate-300 px-3 py-3 text-sm" placeholder="Organization name" />
          <input required pattern="[a-z0-9-]+" className="rounded-xl border border-slate-300 px-3 py-3 text-sm" placeholder="Desired handle (e.g. acme-finance)" />
          <input required type="email" autoComplete="email" className="rounded-xl border border-slate-300 px-3 py-3 text-sm" placeholder="Official business email" />
          <input required type="password" minLength={8} autoComplete="new-password" className="rounded-xl border border-slate-300 px-3 py-3 text-sm" placeholder="Account password" />
          <input required className="rounded-xl border border-slate-300 px-3 py-3 text-sm" placeholder="Representative name and designation" />
          <button type="submit" className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white sm:col-span-2">Request organization account</button>
        </form>
      )}
    </section>
  );
}

export function ClaimVerificationForm({ form }: { form: BusinessClaimData["claimForm"] }) {
  const [local, setLocal] = useState(form);
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Claim verification form</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {[
          ["Representative full name", "representativeName"],
          ["Business email", "businessEmail"],
          ["Phone number", "phone"],
          ["Company name", "companyName"],
          ["Designation", "designation"],
          ["Official website", "website"],
          ["App name", "appName"],
          ["Play Store URL", "playStoreUrl"],
          ["App Store URL", "appStoreUrl"],
          ["Company CIN / registration number", "companyRegistrationNumber"],
          ["Claimed NBFC partner name", "claimedNbfcPartner"],
          ["RBI registration claim", "rbiRegistrationClaim"],
          ["Grievance officer name", "grievanceName"],
          ["Grievance email", "grievanceEmail"],
          ["Grievance phone", "grievancePhone"],
          ["Registered business address", "grievanceAddress"],
        ].map(([label, key]) => (
          <input key={key} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={label} />
        ))}
      </div>
      <input type="file" multiple className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" onChange={(e) => setLocal({ ...local, supportingDocuments: Array.from(e.target.files ?? []).map((f) => f.name) })} />
      {local.supportingDocuments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {local.supportingDocuments.map((d) => <span key={d} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{d}</span>)}
        </div>
      )}
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Do not upload private customer data, borrower documents, Aadhaar, PAN, bank statements, or unrelated personal information.
      </p>
      {submitted ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Claim submitted for approval. Your profile remains unverified until Trust Loans completes email, ownership, and document checks.
        </div>
      ) : (
        <button type="button" onClick={() => setSubmitted(true)} className="mt-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Submit claim for approval</button>
      )}
    </section>
  );
}

export function VerificationStepTracker({ steps }: { steps: BusinessClaimData["verificationSteps"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Verification steps</h2>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={s.key} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            Step {i + 1}: {s.label} • {s.status.replace("_", " ")}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompanyDashboardPreview() {
  const can = [
    "Respond publicly to reviews",
    "Update official grievance details",
    "Add company statement",
    "Request correction of inaccurate public business details",
    "Flag policy-violating reviews",
    "View complaint category analytics",
  ];
  const cannot = [
    "Delete negative reviews directly",
    "View private evidence",
    "Access reviewer contact details",
    "Retaliate against reviewers",
    "Post private information",
  ];
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <h3 className="mb-2 font-semibold text-emerald-900">After verification, companies can</h3>
        {can.map((item) => <p key={item} className="text-sm text-emerald-900">• {item}</p>)}
      </article>
      <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <h3 className="mb-2 font-semibold text-rose-900">Companies cannot</h3>
        {cannot.map((item) => <p key={item} className="text-sm text-rose-900">• {item}</p>)}
      </article>
    </section>
  );
}

export function ReviewResponseComposer({ form, enabled = false }: { form: BusinessClaimData["responseForm"]; enabled?: boolean }) {
  const [local, setLocal] = useState(form);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Respond to review</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <select value={local.reviewId} onChange={(e) => setLocal({ ...local, reviewId: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select review</option>
          <option value="r1">Review #r1</option>
          <option value="r2">Review #r2</option>
        </select>
        <select value={local.responseCategory} onChange={(e) => setLocal({ ...local, responseCategory: e.target.value as BusinessClaimData["responseForm"]["responseCategory"] })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="clarification">Clarification</option>
          <option value="apology">Apology</option>
          <option value="support_offered">Support Offered</option>
          <option value="dispute">Dispute</option>
          <option value="general_statement">General Statement</option>
        </select>
      </div>
      <textarea disabled={!enabled} value={local.responseBody} onChange={(e) => setLocal({ ...local, responseBody: e.target.value })} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100" placeholder="Public response body" />
      <input disabled={!enabled} value={local.officialContactChannel} onChange={(e) => setLocal({ ...local, officialContactChannel: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100" placeholder="Official grievance email / ticket URL / customer care number" />
      <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        Response rules: be professional, do not reveal borrower personal details, do not threaten reviewer, do not include private loan account details, and do not demand review removal.
      </p>
      {!enabled && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Company responses unlock only after a claim is approved by Trust Loans.</p>}
      <button disabled={!enabled} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Submit Response for Moderation</button>
    </section>
  );
}

export function CorrectionRequestForm({ form }: { form: BusinessClaimData["correctionRequest"] }) {
  const [local, setLocal] = useState(form);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Correction request</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <input value={local.fieldName} onChange={(e) => setLocal({ ...local, fieldName: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Field to correct" />
        <input value={local.currentValue} onChange={(e) => setLocal({ ...local, currentValue: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Current displayed value" />
        <input value={local.proposedValue} onChange={(e) => setLocal({ ...local, proposedValue: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Proposed correction" />
      </div>
      <textarea value={local.explanation} onChange={(e) => setLocal({ ...local, explanation: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Explanation" />
      <input type="file" multiple onChange={(e) => setLocal({ ...local, supportingProof: Array.from(e.target.files ?? []).map((f) => f.name) })} className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" />
      <button className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Submit Correction Request</button>
    </section>
  );
}

export function BusinessPolicyNotice() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Claiming a profile does not give a company control over user reviews. Reviews are moderated according to platform policy. Companies may
      respond, provide corrections, and flag policy violations, but cannot directly remove user experiences.
    </section>
  );
}

export function BusinessFAQ() {
  const items = [
    ["Who can claim a profile?", "Authorized company representatives, developers, or partners with verifiable business authority."],
    ["How is company ownership verified?", "Through business details, official email checks, domain or app ownership checks, and document review."],
    ["Can a company delete reviews?", "No, companies cannot directly remove user reviews."],
    ["Can companies see user evidence?", "No, private user evidence remains restricted for moderation or verification workflows."],
    ["How do company responses appear publicly?", "Responses are reviewed and then published under the verified company profile."],
    ["How can grievance details be updated?", "Submit updated official contacts through the correction or grievance update workflow."],
    ["What happens if there are multiple claimants?", "Claims may be placed under dispute and reviewed with additional verification."],
    ["Can NBFC partners respond separately?", "Where supported, verified NBFC partners may be given separate response channels."],
  ];
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
      {items.map(([q, a]) => (
        <details key={q} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">{q}</summary>
          <p className="mt-2 text-sm text-slate-600">{a}</p>
        </details>
      ))}
    </section>
  );
}

export default function CompanyClaimResponsePage({ data }: { data: BusinessClaimData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <BusinessHero />
        <BusinessAccountSetup />
        <BusinessProfileSearch results={data.searchResults} />
        <ClaimVerificationForm form={data.claimForm} />
        <VerificationStepTracker steps={data.verificationSteps} />
        <CompanyDashboardPreview />
        <ReviewResponseComposer form={data.responseForm} enabled={data.searchResults.some((result) => result.claimStatus === "claimed")} />
        <CorrectionRequestForm form={data.correctionRequest} />
        <BusinessPolicyNotice />
        <BusinessFAQ />
      </div>
    </main>
  );
}
