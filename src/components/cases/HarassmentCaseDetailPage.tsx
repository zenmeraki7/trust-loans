"use client";

import { useState } from "react";
import {
  useArchiveCase,
  useCaseDetail,
  useCreateChecklistItem,
  useCreateTimelineItem,
  useExternalComplaintTracker,
  useLinkCaseComplaintDraft,
  useLinkCaseDecisionSession,
  useLinkCaseEvidence,
  useLinkCaseReview,
  useUpdateChecklistItem,
} from "@/hooks/useCases";
import type { HarassmentCase } from "@/types/harassmentCase";

export function CaseStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{status.replaceAll("_", " ")}</span>;
}

export function CasePriorityBadge({ priority }: { priority: string }) {
  return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-900">{priority}</span>;
}

export function CaseDetailHeader({ c }: { c: HarassmentCase }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-semibold">{c.title}</h1>
      <p className="text-sm text-slate-600">This case folder is private to you. Evidence remains private by default.</p>
      <div className="mt-2 flex items-center gap-2"><CaseStatusBadge status={c.status} /><CasePriorityBadge priority={c.priority} /></div>
    </section>
  );
}

export function CaseSummaryCard({ c }: { c: HarassmentCase }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
      <p>Case type: {c.caseType}</p>
      <p>Loan reference: {c.loanReferenceId || "Not added"}</p>
      <p>Incident date: {c.incidentDate ? new Date(c.incidentDate).toLocaleDateString() : "Not added"}</p>
      <p>Summary: {c.summary || "Not added"}</p>
    </section>
  );
}

export function CaseTimeline({ items }: { items: HarassmentCase["timelineItems"] }) {
  return <div className="mt-2 space-y-2 text-sm">{items.map((t) => <p key={t.id}>{t.type}: {t.title}</p>)}</div>;
}

export function AddTimelineItemModal({ value, onChange, onAdd }: { value: string; onChange: (v: string) => void; onAdd: () => void }) {
  return <div className="mt-2 flex gap-2"><input className="flex-1 rounded border px-2 py-1 text-sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Add timeline item" /><button className="rounded border px-2 py-1 text-xs" onClick={onAdd}>Add</button></div>;
}

export function CaseEvidenceSection({ ids }: { ids: string[] }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold">Case Evidence</h2><p className="mt-2 text-xs text-slate-600">Linked evidence IDs: {ids.length ? ids.join(", ") : "None linked"}</p></article>;
}

export function CaseChecklist({ items, onToggle, newLabel, onChangeNew, onAdd }: { items: HarassmentCase["checklistItems"]; onToggle: (id: string, completed: boolean) => void; newLabel: string; onChangeNew: (v: string) => void; onAdd: () => void }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold">Case Checklist</h2>
      <div className="mt-2 space-y-2 text-sm">{items.map((i) => <label key={i.id} className="flex items-center gap-2"><input type="checkbox" checked={i.completed} onChange={() => onToggle(i.id, !i.completed)} />{i.label}</label>)}</div>
      <div className="mt-2 flex gap-2"><input className="flex-1 rounded border px-2 py-1 text-sm" value={newLabel} onChange={(e) => onChangeNew(e.target.value)} placeholder="Add checklist item" /><button className="rounded border px-2 py-1 text-xs" onClick={onAdd}>Add</button></div>
    </article>
  );
}

export function ExternalComplaintTracker({ items, onAddRbi }: { items: HarassmentCase["externalComplaints"]; onAddRbi: () => void }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold">External Complaint Tracker</h2><div className="mt-2 space-y-2 text-sm">{items.map((x) => <p key={x.id}>{x.channel}: {x.complaintNumber || "-"} ({x.status})</p>)}</div><button className="mt-2 rounded border px-2 py-1 text-xs" onClick={onAddRbi}>Add RBI CMS draft</button></article>;
}

export function LinkedReviewCard({ linkedReviewId }: { linkedReviewId?: string | null }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h2 className="font-semibold">Linked Review</h2><p>{linkedReviewId || "No linked review"}</p></article>;
}

export function LinkedComplaintDrafts({ ids }: { ids: string[] }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h2 className="font-semibold">Linked Complaint Drafts</h2><p>{ids.length ? ids.join(", ") : "None linked"}</p></article>;
}

export function RecommendedNextActions() {
  const actions = ["Preserve evidence", "Track complaint numbers", "Use safe template", "Avoid sharing private data"];
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h2 className="font-semibold">Recommended Next Actions</h2><div className="mt-2 flex flex-wrap gap-2">{actions.map((a) => <span key={a} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{a}</span>)}</div></article>;
}

export function CasePrivacyNotice() {
  return <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Do not store OTPs, passwords, Aadhaar/PAN, full bank details, or private photos unless required for official legal process. This tool helps organize information and is not legal advice.</section>;
}

export function MobileCaseActionBar({ onArchive }: { onArchive: () => void }) {
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-3 md:hidden"><button className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={onArchive}>Archive case</button></div>;
}

export default function HarassmentCaseDetailPage({ caseId }: { caseId: string }) {
  const detail = useCaseDetail(caseId);
  const addTimeline = useCreateTimelineItem(caseId);
  const addChecklist = useCreateChecklistItem(caseId);
  const updateChecklist = useUpdateChecklistItem(caseId);
  const tracker = useExternalComplaintTracker(caseId);
  const archive = useArchiveCase(caseId);
  const linkReview = useLinkCaseReview(caseId);
  const linkEvidence = useLinkCaseEvidence(caseId);
  const linkDecision = useLinkCaseDecisionSession(caseId);
  const linkDraft = useLinkCaseComplaintDraft(caseId);

  const [timelineTitle, setTimelineTitle] = useState("");
  const [checklistLabel, setChecklistLabel] = useState("");
  const [linkId, setLinkId] = useState("");

  if (detail.isLoading) return <main className="p-6">Loading case...</main>;
  if (!detail.data) return <main className="p-6">Case not found.</main>;
  const c = detail.data;

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8 pb-20 md:pb-8">
      <CaseDetailHeader c={c} />
      <CaseSummaryCard c={c} />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Case Timeline</h2>
          <CaseTimeline items={c.timelineItems} />
          <AddTimelineItemModal value={timelineTitle} onChange={setTimelineTitle} onAdd={() => addTimeline.mutate({ type: "OTHER", title: timelineTitle, evidenceFileIds: [] })} />
        </article>
        <CaseChecklist items={c.checklistItems} onToggle={(id, completed) => updateChecklist.mutate({ itemId: id, body: { completed } })} newLabel={checklistLabel} onChangeNew={setChecklistLabel} onAdd={() => addChecklist.mutate({ label: checklistLabel })} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ExternalComplaintTracker items={c.externalComplaints} onAddRbi={() => tracker.create.mutate({ channel: "RBI_CMS", status: "DRAFTED" })} />
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Linked Items</h2>
          <input className="mt-2 w-full rounded border px-2 py-1 text-sm" placeholder="Enter ID" value={linkId} onChange={(e) => setLinkId(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <button className="rounded border px-2 py-1" onClick={() => linkReview.mutate(linkId)}>Link Review</button>
            <button className="rounded border px-2 py-1" onClick={() => linkEvidence.mutate(linkId)}>Link Evidence</button>
            <button className="rounded border px-2 py-1" onClick={() => linkDecision.mutate(linkId)}>Link Decision Session</button>
            <button className="rounded border px-2 py-1" onClick={() => linkDraft.mutate(linkId)}>Link Complaint Draft</button>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CaseEvidenceSection ids={c.linkedEvidenceFileIds} />
        <LinkedReviewCard linkedReviewId={c.linkedReviewId} />
        <LinkedComplaintDrafts ids={c.linkedComplaintDraftIds} />
        <RecommendedNextActions />
      </section>

      <CasePrivacyNotice />

      <button className="hidden rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:inline-block" onClick={() => archive.mutate()}>Archive case</button>
      <MobileCaseActionBar onArchive={() => archive.mutate()} />
    </main>
  );
}
