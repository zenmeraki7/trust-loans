"use client";

import { useState } from "react";
import type { AdminCorrectionDisputeQueueData, QueueStatus, RequestType, Urgency } from "@/types/adminCorrectionDisputeQueue";
import { useMemo } from "react";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { correctionQueueFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";

export function RequestStatusBadge({ status }: { status: QueueStatus }) {
  const cls = status === "accepted" || status === "partially_accepted" ? "bg-emerald-100 text-emerald-700" : status === "rejected" ? "bg-rose-100 text-rose-700" : status === "escalated" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_", " ")}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const cls = urgency === "privacy" || urgency === "safety" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{urgency}</span>;
}

export function PrivacyFlagBadge({ flag }: { flag: string }) {
  return <span className="rounded-full bg-rose-100 px-2 py-1 text-xs text-rose-700">{flag}</span>;
}

export function CorrectionQueueHeader() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h1 className="text-2xl font-semibold">Corrections & Disputes</h1><p className="text-sm text-slate-600">Review correction requests, privacy concerns, duplicate reports, review disputes, and entity relationship issues.</p><div className="mt-2 flex flex-wrap gap-2">{["Export Queue","Open Review Policy","Open Moderation Dashboard","Assign Cases"].map((x)=><button key={x} className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">{x}</button>)}</div></section>;
}

export function CorrectionQueueStatsCards({ s }: { s: AdminCorrectionDisputeQueueData["stats"] }) {
  const items = [["New requests",s.newRequests],["Privacy urgent",s.privacyUrgent],["Review disputes",s.reviewDisputes],["App/company corrections",s.appCompanyCorrections],["Duplicate reports",s.duplicateReports],["NBFC relationship disputes",s.nbfcRelationshipDisputes],["Escalated",s.escalatedCases],["Resolved today",s.resolvedToday]];
  return <section className="grid grid-cols-2 gap-2 xl:grid-cols-4">{items.map(([k,v])=><div key={String(k)} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-[11px] uppercase text-slate-500">{k}</p><p className="text-xl font-semibold">{v}</p></div>)}</section>;
}

export function CorrectionQueueTabs({ active, onSet }: { active: string; onSet: (v: string)=>void }) {
  const tabs = ["All Requests","Privacy Concerns","Review Disputes","App Detail Corrections","Company / Entity Corrections","NBFC Relationship Disputes","Duplicate App Reports","Own Review Removal Requests","Escalated","Closed"];
  return <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap gap-2">{tabs.map((t)=><button key={t} onClick={()=>onSet(t)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${active===t?"border-slate-900 bg-slate-900 text-white":"border-slate-300 text-slate-700"}`}>{t}</button>)}</div></section>;
}

export function CorrectionQueueFilters() {
  const f = ["Request type","Status","Urgency","Assigned moderator","Submitted date range","Public item type","App name","Company/entity name","Requester role","Has supporting evidence","Needs senior review","Privacy-sensitive"];
  return <section className="sticky top-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">{f.map((x)=><input key={x} className="rounded border border-slate-300 px-2 py-2 text-xs" placeholder={x} />)}</div><input className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Search request ID, URL, app, company, email, package, entity" /></section>;
}

export function CorrectionRequestTable({ items, onSelect }: { items: AdminCorrectionDisputeQueueData["requests"]; onSelect: (id: string)=>void }) {
  if (!items.length) return <EmptyCorrectionQueueState />;
  return <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><table className="min-w-[1100px] text-left text-xs"><thead><tr className="border-b">{["Request ID","Type","Public item","Requester role","Urgency","Status","Submitted","Assigned","Evidence","Privacy","Last activity","Action"].map((h)=><th key={h} className="py-2 pr-2">{h}</th>)}</tr></thead><tbody>{items.map((r)=><tr key={r.id} className="border-b"><td className="py-2 pr-2">{r.id}</td><td className="py-2 pr-2">{r.requestType.replaceAll("_"," ")}</td><td className="py-2 pr-2">{r.publicItem.title}</td><td className="py-2 pr-2">{r.requester.role}</td><td className="py-2 pr-2"><UrgencyBadge urgency={r.urgency} /></td><td className="py-2 pr-2"><RequestStatusBadge status={r.status} /></td><td className="py-2 pr-2">{r.submittedAt}</td><td className="py-2 pr-2">{r.assignedModerator}</td><td className="py-2 pr-2">{r.evidenceCount}</td><td className="py-2 pr-2">{r.privacyFlags.map((f)=><PrivacyFlagBadge key={f} flag={f} />)}</td><td className="py-2 pr-2">{r.lastActivityAt}</td><td className="py-2 pr-2"><button onClick={()=>onSelect(r.id)} className="rounded border px-2 py-1">Review</button></td></tr>)}</tbody></table></section>;
}

export function PrivacyConcernReviewPanel({ flags }: { flags: string[] }) {
  if (!flags.length) return null;
  return <section className="rounded-xl border border-rose-200 bg-rose-50 p-4"><h3 className="font-semibold text-rose-900">Privacy concern review</h3><div className="mt-2 flex flex-wrap gap-1">{flags.map((f)=><PrivacyFlagBadge key={f} flag={f} />)}</div><div className="mt-2 flex flex-wrap gap-1">{["Temporarily hide content","Redact sensitive data","Remove evidence from public view","Notify user","Escalate immediately","Close after remediation"].map((a)=><button key={a} className="rounded border border-rose-300 bg-white px-2 py-1 text-xs text-rose-800">{a}</button>)}</div></section>;
}

export function ReviewDisputeWorkflow({ data }: { data: AdminCorrectionDisputeQueueData["selectedRequest"]["reviewDispute"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Review dispute workflow</h3><p className="text-xs text-slate-600">{data.reviewTitle} • {data.disputeReason}</p><p className="mt-1 text-sm">{data.reviewBody}</p><p className="mt-2 rounded bg-slate-50 p-2 text-xs">Negative reviews are not removed only because a company disagrees with the user’s experience.</p></section>;
}

export function FieldCorrectionWorkflow({ data }: { data: AdminCorrectionDisputeQueueData["selectedRequest"]["requestedCorrection"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">App / company detail correction workflow</h3><div className="mt-2 grid grid-cols-1 gap-2 text-xs md:grid-cols-2"><div className="rounded bg-slate-50 p-2">Current: {data.currentValue}</div><div className="rounded bg-slate-50 p-2">Proposed: {data.proposedValue}</div><div className="rounded bg-slate-50 p-2 md:col-span-2">Explanation: {data.explanation}</div></div><div className="mt-2 flex flex-wrap gap-1">{["Apply correction","Apply partial correction","Reject field","Mark under verification","Request more source proof"].map((x)=><button key={x} className="rounded border px-2 py-1 text-xs">{x}</button>)}</div></section>;
}

export function DuplicateAppComparison({ data }: { data: AdminCorrectionDisputeQueueData["selectedRequest"]["duplicateReport"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Duplicate app report workflow</h3><div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 text-xs"><div className="rounded bg-slate-50 p-2">{Object.entries(data.leftRecord).map(([k,v])=><p key={k}>{k}: {v}</p>)}</div><div className="rounded bg-slate-50 p-2">{Object.entries(data.rightRecord).map(([k,v])=><p key={k}>{k}: {v}</p>)}</div></div><p className="mt-2 text-xs">{data.mergeRecommendation}</p><div className="mt-2 flex flex-wrap gap-1">{["Merge records","Link as related apps","Mark not duplicate","Archive duplicate","Escalate"].map((x)=><button key={x} className="rounded border px-2 py-1 text-xs">{x}</button>)}</div></section>;
}

export function EntityRelationshipDisputeWorkflow({ data }: { data: AdminCorrectionDisputeQueueData["selectedRequest"]["relationshipDispute"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Entity / NBFC relationship dispute workflow</h3><p className="text-xs">Current: {data.currentRelationshipType} • Proposed: {data.proposedRelationshipType}</p><p className="text-xs">Verification status: {data.verificationStatus} • Confidence: {data.confidence}</p><p className="text-xs">Source: {data.sourceUrl}</p><div className="mt-2 flex flex-wrap gap-1">{["Verify relationship","Mark as claimed only","Mark under verification","Mark disputed","Remove relationship","Add public note","Request more evidence"].map((x)=><button key={x} className="rounded border px-2 py-1 text-xs">{x}</button>)}</div><p className="mt-2 rounded bg-slate-50 p-2 text-xs">Public label: Claimed relationship under verification.</p></section>;
}

export function RequesterCommunicationPanel() {
  const templates = ["More information needed","Correction accepted","Correction partially accepted","Correction rejected","Privacy issue resolved","Review retained after policy review","Duplicate report resolved","Relationship marked under verification"];
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Requester communication</h3><select className="mt-2 w-full rounded border border-slate-300 px-2 py-2 text-xs"><option>Template</option>{templates.map((t)=><option key={t}>{t}</option>)}</select><textarea rows={3} className="mt-2 w-full rounded border border-slate-300 px-2 py-2 text-xs" placeholder="Message body" /><textarea rows={2} className="mt-2 w-full rounded border border-slate-300 px-2 py-2 text-xs" placeholder="Internal note" /><label className="mt-2 block text-xs"><input type="checkbox" className="mr-2" />Notify requester</label></section>;
}

export function CorrectionPolicySidebar() {
  const rules = ["Remove or redact private personal data","Do not publish Aadhaar/PAN/bank details","Do not remove reviews only because they are negative","Companies may respond but not access private evidence","Corrections require source confidence","Duplicate merges require audit trail","Relationship claims must be labeled by verification status","Preserve public transparency where safe"];
  return <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Policy sidebar</h3>{rules.map((r)=><p key={r} className="text-xs text-slate-700">• {r}</p>)}</aside>;
}

export function CorrectionAuditLog({ items }: { items: AdminCorrectionDisputeQueueData["selectedRequest"]["auditLog"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Audit log</h3><div className="mt-2 space-y-2">{items.map((a,i)=><div key={i} className="rounded bg-slate-50 p-2 text-xs"><p>{a.moderator} • {a.timestamp}</p><p>{a.action} • {a.statusChange}</p><p>{a.previousValue} → {a.newValue}</p><p>Notification sent: {a.notificationSent?"Yes":"No"}</p></div>)}</div></section>;
}

export function BulkCorrectionActionsBar() {
  return <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap gap-2">{["Assign moderator","Change status","Mark low priority","Export selected","Escalate","Close duplicates"].map((x)=><button key={x} className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold">{x}</button>)}</div></section>;
}

export function EmptyCorrectionQueueState() {
  return <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"><p className="font-semibold">No correction or dispute requests found.</p><div className="mt-2 flex justify-center gap-2"><button className="rounded border px-3 py-2 text-xs">Clear filters</button><button className="rounded border px-3 py-2 text-xs">Open moderation dashboard</button><button className="rounded border px-3 py-2 text-xs">View review policy</button></div></section>;
}

export function CorrectionRequestDetailPanel({ data }: { data: AdminCorrectionDisputeQueueData["selectedRequest"] }) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Request detail panel</h2>
      <div className="rounded bg-slate-50 p-3 text-xs">
        <p>ID: {data.id}</p>
        <p>Type: {data.requestType.replaceAll("_"," ")}</p>
        <p>Public item: {data.publicItem.title}</p>
        <p>Requester: {data.requester.role} • {data.requester.emailMasked}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {["Accept","Partially accept","Reject","Request more info","Escalate","Assign moderator","Mark duplicate","Close as resolved","Add internal note"].map((x)=><button key={x} className="rounded border border-slate-300 px-2 py-1 text-xs">{x}</button>)}
      </div>
      <PrivacyConcernReviewPanel flags={data.privacyConcern.flags} />
      <ReviewDisputeWorkflow data={data.reviewDispute} />
      <FieldCorrectionWorkflow data={data.requestedCorrection} />
      <DuplicateAppComparison data={data.duplicateReport} />
      <EntityRelationshipDisputeWorkflow data={data.relationshipDispute} />
      <RequesterCommunicationPanel />
      <CorrectionAuditLog items={data.auditLog} />
    </section>
  );
}

export default function AdminCorrectionDisputeQueuePage({ data }: { data: AdminCorrectionDisputeQueueData }) {
  const [activeTab, setActiveTab] = useState("All Requests");
  const [selectedId, setSelectedId] = useState(data.selectedRequest.id);
  const [filters, setFilters] = useState({});
  const filteredRequests = useMemo(() => applyGlobalFilters(data.requests, correctionQueueFilterSchema, filters), [data.requests, filters]);
  void activeTab;
  void selectedId;
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1700px] space-y-4">
        <CorrectionQueueHeader />
        <CorrectionQueueStatsCards s={data.stats} />
        <GlobalFilterPanel schema={correctionQueueFilterSchema} state={filters} onChange={setFilters} />
        <CorrectionQueueTabs active={activeTab} onSet={setActiveTab} />
        <CorrectionQueueFilters />
        <BulkCorrectionActionsBar />
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.15fr_1fr_280px]">
          <div className="space-y-4">
            <CorrectionRequestTable items={filteredRequests} onSelect={setSelectedId} />
          </div>
          <CorrectionRequestDetailPanel data={data.selectedRequest} />
          <CorrectionPolicySidebar />
        </div>
      </div>
    </main>
  );
}
