"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CorrectionDisputeRequestData } from "@/types/correctionDisputeRequest";

export function RequestTypeBadge({ label }: { label: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{label}</span>;
}

export function RequestStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">{status}</span>;
}

export function CorrectionHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Request a correction or report a policy concern</h1>
      <p className="mt-2 text-sm text-slate-600">
        Help us keep app profiles, company details, reviews, and public information accurate, safe, and privacy-protective.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Start Correction Request</button>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Report Privacy Issue</button>
        <Link href="/review-policy" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">View Review Policy</Link>
        <Link href="/business/claim" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Company Claim Page</Link>
      </div>
    </section>
  );
}

export function RequestTypeSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  const types = [
    "Correct app details",
    "Correct company/entity details",
    "Correct claimed NBFC partner details",
    "Correct grievance/support details",
    "Report duplicate app profile",
    "Report wrong app/entity relationship",
    "Report review containing private information",
    "Report abusive or unsafe review content",
    "Dispute a review as company representative",
    "Request removal of my own review",
    "Report impersonation or fake company response",
    "Other policy concern",
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Request type</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {types.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => onSelect(t)}
            className={`rounded-xl border p-3 text-left text-sm ${selected === t ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}

export function PublicItemLookup({
  item,
}: {
  item: CorrectionDisputeRequestData["selectedPublicItem"];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Public item lookup</h2>
      <input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Search app name, review URL, company/entity, NBFC partner, profile URL, review ID, app package name" />
      <SelectedPublicItemSummary item={item} />
    </section>
  );
}

export function SelectedPublicItemSummary({ item }: { item: CorrectionDisputeRequestData["selectedPublicItem"] }) {
  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
      <p>Type: {item.type.replaceAll("_", " ")}</p>
      <p>Title: {item.title}</p>
      <p>Status: {item.currentStatus}</p>
      <Link href={item.publicUrl} className="text-xs font-semibold underline">Open public page</Link>
    </div>
  );
}

export function CorrectionRequestForm({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Correction request form</h2>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input value={data.correction.currentDisplayedValue} onChange={(e) => setData({ ...data, correction: { ...data.correction, currentDisplayedValue: e.target.value } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Current displayed value" />
        <input value={data.correction.proposedCorrectedValue} onChange={(e) => setData({ ...data, correction: { ...data.correction, proposedCorrectedValue: e.target.value } })} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Proposed corrected value" />
      </div>
      <textarea value={data.correction.explanation} onChange={(e) => setData({ ...data, correction: { ...data.correction, explanation: e.target.value } })} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Explanation" />
      <input value={data.correction.sourceUrl} onChange={(e) => setData({ ...data, correction: { ...data.correction, sourceUrl: e.target.value } })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Source/proof URL" />
      <select value={data.correction.urgency} onChange={(e) => setData({ ...data, correction: { ...data.correction, urgency: e.target.value as CorrectionDisputeRequestData["correction"]["urgency"] } })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
        <option value="normal">Normal</option><option value="privacy_concern">Privacy concern</option><option value="safety_concern">Safety concern</option><option value="legal_concern">Legal concern</option>
      </select>
      <div className="mt-2 flex flex-wrap gap-3 text-sm">
        <label><input type="checkbox" checked={data.correction.isOwnContent} onChange={(e) => setData({ ...data, correction: { ...data.correction, isOwnContent: e.target.checked } })} className="mr-2" />Is this about your own content?</label>
        <label><input type="checkbox" checked={data.correction.isCompanyProfile} onChange={(e) => setData({ ...data, correction: { ...data.correction, isCompanyProfile: e.target.checked } })} className="mr-2" />Is this about your company/profile?</label>
        <label><input type="checkbox" checked={data.correction.temporaryHideRequested} onChange={(e) => setData({ ...data, correction: { ...data.correction, temporaryHideRequested: e.target.checked } })} className="mr-2" />Temporary hide requested (request only)</label>
      </div>
    </section>
  );
}

export function PrivacyViolationReportForm({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  const issueTypes = ["Aadhaar/PAN exposed","Bank details exposed","Phone number exposed","Address exposed","Private photo exposed","Child image exposed","Contact list exposed","OTP/password exposed","Private evidence displayed","Reviewer identity exposed","Other sensitive data"];
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h2 className="text-lg font-semibold text-amber-900">Privacy violation report form</h2>
      <div className="mt-2 flex flex-wrap gap-1">
        {issueTypes.map((x)=><button key={x} type="button" onClick={()=>setData({...data,privacyViolation:{...data.privacyViolation,issueTypes:data.privacyViolation.issueTypes.includes(x)?data.privacyViolation.issueTypes.filter(i=>i!==x):[...data.privacyViolation.issueTypes,x]}})} className="rounded-full border border-amber-300 bg-white px-2 py-1 text-xs text-amber-900">{x}</button>)}
      </div>
      <textarea value={data.privacyViolation.locationDescription} onChange={(e)=>setData({...data,privacyViolation:{...data.privacyViolation,locationDescription:e.target.value}})} rows={2} className="mt-2 w-full rounded-xl border border-amber-300 px-3 py-2 text-sm" placeholder="Where is the private information shown?" />
      <input value={data.privacyViolation.whoseInformation} onChange={(e)=>setData({...data,privacyViolation:{...data.privacyViolation,whoseInformation:e.target.value}})} className="mt-2 w-full rounded-xl border border-amber-300 px-3 py-2 text-sm" placeholder="Whose information is exposed?" />
      <input value={data.privacyViolation.publicUrl} onChange={(e)=>setData({...data,privacyViolation:{...data.privacyViolation,publicUrl:e.target.value}})} className="mt-2 w-full rounded-xl border border-amber-300 px-3 py-2 text-sm" placeholder="Public URL" />
      <p className="mt-2 text-xs text-amber-900">Do not upload more sensitive information to prove the issue. Describe the location and type of private data instead.</p>
    </section>
  );
}

export function ReviewDisputeForm({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  const reasons = ["Not based on personal experience","Contains private information","Contains abusive language","Contains false or misleading factual details","Duplicate/spam","Conflict of interest","Company response issue","Legal/privacy concern"];
  const actions = ["Redact private information","Request user clarification","Add company response","Review for policy violation","Correct factual detail","Remove only if policy violation is confirmed"];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Review dispute form</h2>
      <input value={data.reviewDispute.reviewUrl} onChange={(e)=>setData({...data,reviewDispute:{...data.reviewDispute,reviewUrl:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Review URL / ID" />
      <select value={data.reviewDispute.disputeReason} onChange={(e)=>setData({...data,reviewDispute:{...data.reviewDispute,disputeReason:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"><option value="">Dispute reason</option>{reasons.map((r)=><option key={r} value={r}>{r}</option>)}</select>
      <textarea value={data.reviewDispute.explanation} onChange={(e)=>setData({...data,reviewDispute:{...data.reviewDispute,explanation:e.target.value}})} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Explanation" />
      <select value={data.reviewDispute.requestedAction} onChange={(e)=>setData({...data,reviewDispute:{...data.reviewDispute,requestedAction:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"><option value="">Requested action</option>{actions.map((a)=><option key={a} value={a}>{a}</option>)}</select>
      <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">Negative reviews are not removed only because a company disagrees with them.</p>
    </section>
  );
}

export function DuplicateRelationshipReportForm({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Duplicate / wrong relationship report</h2>
      <input value={data.duplicateRelationship.existingProfileUrl} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,existingProfileUrl:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Existing app/entity profile URL" />
      <input value={data.duplicateRelationship.duplicateProfileUrl} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,duplicateProfileUrl:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Duplicate profile URL" />
      <textarea value={data.duplicateRelationship.explanation} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,explanation:e.target.value}})} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Why do you believe these are duplicates?" />
      <input value={data.duplicateRelationship.relationshipIssue} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,relationshipIssue:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Relationship issue" />
      <input value={data.duplicateRelationship.suggestedAction} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,suggestedAction:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Suggested action" />
      <input value={data.duplicateRelationship.sourceUrl} onChange={(e)=>setData({...data,duplicateRelationship:{...data.duplicateRelationship,sourceUrl:e.target.value}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Supporting source/proof URL" />
    </section>
  );
}

export function RequesterDetailsCard({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Requester details</h2>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input value={data.requester.name} onChange={(e)=>setData({...data,requester:{...data.requester,name:e.target.value}})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Name" />
        <input value={data.requester.email} onChange={(e)=>setData({...data,requester:{...data.requester,email:e.target.value}})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Email" />
        <input value={data.requester.phone} onChange={(e)=>setData({...data,requester:{...data.requester,phone:e.target.value}})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Phone optional" />
        <input value={data.requester.organizationName} onChange={(e)=>setData({...data,requester:{...data.requester,organizationName:e.target.value}})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Organization/company name" />
      </div>
      <select value={data.requester.role} onChange={(e)=>setData({...data,requester:{...data.requester,role:e.target.value as CorrectionDisputeRequestData["requester"]["role"]}})} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
        <option value="user">User/reviewer</option><option value="company_representative">Company representative</option><option value="nbfc_representative">NBFC representative</option><option value="app_developer">App developer</option><option value="advocate">Advocate/legal representative</option><option value="researcher">Researcher/journalist</option><option value="other">Other</option>
      </select>
      <label className="mt-2 block text-sm"><input type="checkbox" checked={data.requester.authorizedRepresentative} onChange={(e)=>setData({...data,requester:{...data.requester,authorizedRepresentative:e.target.checked}})} className="mr-2" />Authorization confirmation if acting for a company</label>
      <p className="mt-1 text-xs text-slate-500">We may contact you for clarification. Your contact details will not be displayed publicly.</p>
    </section>
  );
}

export function CorrectionEvidenceUploader({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Supporting evidence upload</h2>
      <input type="file" multiple onChange={(e)=>setData({...data,evidence:{...data.evidence,files:Array.from(e.target.files??[]).map(f=>f.name)}})} className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" />
      <div className="mt-2 flex flex-wrap gap-1">{data.evidence.files.map((f)=><span key={f} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{f}</span>)}</div>
      <label className="mt-2 block text-sm"><input type="checkbox" checked={data.evidence.evidencePrivate} onChange={(e)=>setData({...data,evidence:{...data.evidence,evidencePrivate:e.target.checked}})} className="mr-2" />Evidence private by default</label>
      <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Do not upload borrower documents, Aadhaar, PAN, bank statements, OTPs, passwords, private photos, or unrelated personal data.</p>
    </section>
  );
}

export function ReviewProcessTimeline() {
  const steps = ["Request submitted","Safety/privacy triage","Moderator review","Additional verification if needed","Correction/redaction/rejection/escalation","Requester notified where possible"];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Review process timeline</h2><div className="mt-2 space-y-1 text-sm">{steps.map((s,i)=><p key={s}>Step {i+1}: {s}</p>)}</div><div className="mt-2 flex flex-wrap gap-1 text-xs">{["Submitted","Under Review","More Information Needed","Accepted","Partially Accepted","Rejected","Escalated","Closed"].map((s)=><RequestStatusBadge key={s} status={s} />)}</div></section>;
}

export function CorrectionConfirmationBox({ data, setData }: { data: CorrectionDisputeRequestData; setData: (d: CorrectionDisputeRequestData) => void }) {
  const items: Array<[keyof CorrectionDisputeRequestData["confirmations"], string]> = [
    ["goodFaith","I am submitting this request in good faith."],
    ["accurateToKnowledge","The information I provided is accurate to the best of my knowledge."],
    ["reviewAndVerificationAccepted","I understand this request may require review and verification."],
    ["disagreementDoesNotGuaranteeRemoval","I understand negative reviews are not removed only because of disagreement."],
    ["noUnnecessarySensitiveData","I have not uploaded sensitive personal data unnecessarily."],
    ["representativeAuthorized","I am authorized to act for the company/entity if I selected representative role."],
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{items.map(([k,t])=><label key={k} className="mb-1 block text-sm"><input type="checkbox" checked={data.confirmations[k]} onChange={(e)=>setData({...data,confirmations:{...data.confirmations,[k]:e.target.checked}})} className="mr-2" />{t}</label>)}</section>;
}

export function CorrectionSuccessState() {
  return <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"><h3 className="text-xl font-semibold text-emerald-900">Request submitted for review</h3><p className="mt-1 text-sm text-emerald-900">Your correction or dispute request has been received. Our moderation team may review the issue, request more information, redact sensitive details, correct public records, or close the request based on platform policy.</p><div className="mt-3 flex flex-wrap gap-2"><Link href="/review-policy" className="rounded border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">View Review Policy</Link><button className="rounded border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Submit another request</button><Link href="/loan-apps" className="rounded border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Browse loan apps</Link><Link href="/dashboard" className="rounded border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Go to dashboard</Link></div></section>;
}

export function CorrectionFAQ() {
  const items = [
    ["Can a company remove a negative review?","No. Negative reviews are not removed only due to disagreement. Requests are reviewed against policy."],
    ["What if my Aadhaar/PAN is visible?","Submit a privacy concern immediately. Sensitive data may be triaged urgently for review/redaction."],
    ["Can I report duplicate app profiles?","Yes, you can submit duplicate or wrong relationship reports with supporting information."],
  ];
  return <section className="space-y-2">{items.map(([q,a])=><details key={q} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><summary className="cursor-pointer text-sm font-semibold">{q}</summary><p className="mt-2 text-sm text-slate-600">{a}</p></details>)}</section>;
}

export function CorrectionDisclaimerBox() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">Submitting a correction or dispute request does not guarantee removal, correction, or hiding of content. Requests are reviewed according to platform policy, privacy requirements, public interest, and available supporting information.</section>;
}

export function MobileCorrectionSubmitBar({ canSubmit, onSubmit }: { canSubmit: boolean; onSubmit: () => void }) {
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden"><button onClick={onSubmit} disabled={!canSubmit} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Submit Request</button></div>;
}

export default function CorrectionDisputeRequestPage({ initial }: { initial: CorrectionDisputeRequestData }) {
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    const c = data.confirmations;
    return Boolean(data.requestType && data.requester.email && c.goodFaith && c.accurateToKnowledge && c.reviewAndVerificationAccepted && c.disagreementDoesNotGuaranteeRemoval && c.noUnnecessarySensitiveData && c.representativeAuthorized);
  }, [data]);

  const showPrivacy = data.requestType.toLowerCase().includes("privacy");
  const showReviewDispute = data.requestType.toLowerCase().includes("dispute");
  const showDuplicate = data.requestType.toLowerCase().includes("duplicate") || data.requestType.toLowerCase().includes("relationship");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <CorrectionHero />
        {submitted ? (
          <CorrectionSuccessState />
        ) : (
          <>
            <RequestTypeSelector selected={data.requestType} onSelect={(v) => setData({ ...data, requestType: v })} />
            <PublicItemLookup item={data.selectedPublicItem} />
            <CorrectionRequestForm data={data} setData={setData} />
            {showPrivacy && <PrivacyViolationReportForm data={data} setData={setData} />}
            {showReviewDispute && <ReviewDisputeForm data={data} setData={setData} />}
            {showDuplicate && <DuplicateRelationshipReportForm data={data} setData={setData} />}
            <RequesterDetailsCard data={data} setData={setData} />
            <CorrectionEvidenceUploader data={data} setData={setData} />
            <ReviewProcessTimeline />
            <CorrectionConfirmationBox data={data} setData={setData} />
            <button onClick={() => canSubmit && setSubmitted(true)} disabled={!canSubmit} className="hidden rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 md:inline-flex">Submit Request</button>
            <CorrectionFAQ />
            <CorrectionDisclaimerBox />
          </>
        )}
      </div>
      {!submitted && <MobileCorrectionSubmitBar canSubmit={canSubmit} onSubmit={() => canSubmit && setSubmitted(true)} />}
    </main>
  );
}
