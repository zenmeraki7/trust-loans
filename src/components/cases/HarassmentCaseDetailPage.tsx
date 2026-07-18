"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  useArchiveCase,
  useCaseDetail,
  useCaseLoanAppOptions,
  useCreateChecklistItem,
  useCreateTimelineItem,
  useExternalComplaintTracker,
  useLinkCaseComplaintDraft,
  useLinkCaseDecisionSession,
  useLinkCaseEvidence,
  useLinkCaseReview,
  useUpdateCase,
  useUpdateChecklistItem,
} from "@/hooks/useCases";
import type { HarassmentCase, HarassmentCaseInput } from "@/types/harassmentCase";

const caseTypes = ["THREAT_CALLS", "CONTACT_LIST_ABUSE", "OFFICE_HARASSMENT", "PHOTO_MORPHING_THREAT", "DATA_MISUSE", "FAKE_LEGAL_NOTICE", "PAYMENT_NOT_UPDATED", "LOAN_NOT_CLOSED", "HIDDEN_CHARGES", "PERSONAL_UPI_PRESSURE", "OTHER"];
const statuses = ["OPEN", "WAITING_FOR_RESPONSE", "ACTION_NEEDED", "RESOLVED", "ARCHIVED"];
const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"];
const loanAmountRanges = ["", "Below Rs 5,000", "Rs 5,000 - Rs 25,000", "Rs 25,000 - Rs 1,00,000", "Above Rs 1,00,000", "Not sure"];
const timelineTypes = ["LOAN_DISBURSED", "PAYMENT_DUE", "PAYMENT_MADE", "THREAT_RECEIVED", "CALL_RECEIVED", "RELATIVE_CONTACTED", "OFFICE_CONTACTED", "PHOTO_THREAT_RECEIVED", "FAKE_LEGAL_NOTICE_RECEIVED", "COMPLAINT_SENT", "RESPONSE_RECEIVED", "EVIDENCE_UPLOADED", "REVIEW_SUBMITTED", "OTHER"];
const complaintChannels = ["APP_GRIEVANCE_OFFICER", "RBI_CMS", "CYBERCRIME_PORTAL", "CONSUMER_HELPLINE", "LOCAL_POLICE", "ADVOCATE", "APP_STORE_REPORT", "PLAY_STORE_REPORT", "OTHER"];
const complaintStatuses = ["NOT_STARTED", "DRAFTED", "SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESPONDED", "RESOLVED", "CLOSED", "UNKNOWN"];

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function parseIds(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function compactCaseUpdate(input: HarassmentCaseInput): Partial<HarassmentCaseInput> {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => {
      if (key === "incidentDate" && value === "") return false;
      if (Array.isArray(value)) return true;
      return value !== undefined;
    }),
  ) as Partial<HarassmentCaseInput>;
}

export function CaseStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("archiv") || normalized.includes("closed")
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : normalized.includes("open")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{formatLabel(status)}</span>;
}

export function CasePriorityBadge({ priority }: { priority: string }) {
  const tone = priority === "URGENT" || priority === "HIGH" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{formatLabel(priority)}</span>;
}

function CaseDetailHeader({ c, onArchive, isArchiving }: { c: HarassmentCase; onArchive: () => void; isArchiving: boolean }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatLabel(c.caseType)}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{c.title}</h1>
          <p className="mt-1 text-sm text-slate-600">This case folder is private to you. Evidence remains private by default.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2"><CaseStatusBadge status={c.status} /><CasePriorityBadge priority={c.priority} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/cases" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">All cases</Link>
          <button type="button" className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60" onClick={onArchive} disabled={isArchiving || c.status === "ARCHIVED"}>
            {isArchiving ? "Archiving..." : "Archive case"}
          </button>
        </div>
      </div>
    </section>
  );
}

function CaseProgressSummary({ c }: { c: HarassmentCase }) {
  const completedChecklist = c.checklistItems.filter((item) => item.completed).length;
  const metrics = [
    ["Evidence IDs", c.linkedEvidenceFileIds.length],
    ["Timeline items", c.timelineItems.length],
    ["Checklist done", `${completedChecklist}/${c.checklistItems.length}`],
    ["External complaints", c.externalComplaints.length],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(([label, value]) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </article>
      ))}
    </section>
  );
}

function EditableCaseDetails({ c }: { c: HarassmentCase }) {
  const updateCase = useUpdateCase(c.id);
  const loanApps = useCaseLoanAppOptions();
  const [form, setForm] = useState<HarassmentCaseInput>({
    title: c.title,
    caseType: c.caseType,
    status: c.status,
    priority: c.priority,
    loanAppId: c.loanAppId ?? "",
    summary: c.summary ?? "",
    incidentDate: toDateInput(c.incidentDate),
    loanReferenceId: c.loanReferenceId ?? "",
    loanAmountRange: c.loanAmountRange ?? "",
    decisionTreeSessionId: c.decisionTreeSessionId ?? "",
    linkedReviewId: c.linkedReviewId ?? "",
    linkedEvidenceFileIds: c.linkedEvidenceFileIds,
    linkedComplaintDraftIds: c.linkedComplaintDraftIds,
  });
  const [evidenceIdsText, setEvidenceIdsText] = useState(c.linkedEvidenceFileIds.join(", "));
  const [draftIdsText, setDraftIdsText] = useState(c.linkedComplaintDraftIds.join(", "));

  useEffect(() => {
    setForm({
      title: c.title,
      caseType: c.caseType,
      status: c.status,
      priority: c.priority,
      loanAppId: c.loanAppId ?? "",
      summary: c.summary ?? "",
      incidentDate: toDateInput(c.incidentDate),
      loanReferenceId: c.loanReferenceId ?? "",
      loanAmountRange: c.loanAmountRange ?? "",
      decisionTreeSessionId: c.decisionTreeSessionId ?? "",
      linkedReviewId: c.linkedReviewId ?? "",
      linkedEvidenceFileIds: c.linkedEvidenceFileIds,
      linkedComplaintDraftIds: c.linkedComplaintDraftIds,
    });
    setEvidenceIdsText(c.linkedEvidenceFileIds.join(", "));
    setDraftIdsText(c.linkedComplaintDraftIds.join(", "));
  }, [c]);

  const updateField = (key: keyof HarassmentCaseInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    updateCase.mutate(compactCaseUpdate({
      ...form,
      loanAppId: form.loanAppId || null,
      linkedEvidenceFileIds: parseIds(evidenceIdsText),
      linkedComplaintDraftIds: parseIds(draftIdsText),
    }) as Partial<HarassmentCaseInput>);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Case Record</h2>
          <p className="mt-1 text-sm text-slate-600">Edit the case facts, app/loan identifiers, status, and linked evidence records.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={updateCase.isPending || form.title.trim().length < 2} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {updateCase.isPending ? "Saving..." : "Save case"}
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">Title<input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.title} onChange={(event) => updateField("title", event.target.value)} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Case type<select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.caseType} onChange={(event) => updateField("caseType", event.target.value)}>{caseTypes.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Status<select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => updateField("status", event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Priority<select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>{priorities.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}</select></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">Loan app<select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.loanAppId ?? ""} onChange={(event) => updateField("loanAppId", event.target.value)}><option value="">Not linked yet</option>{(loanApps.data ?? []).map((app) => <option key={app.id} value={app.id}>{app.name}{app.slug ? ` (${app.slug})` : ""}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Loan reference ID<input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.loanReferenceId} onChange={(event) => updateField("loanReferenceId", event.target.value)} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Incident date<input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.incidentDate} onChange={(event) => updateField("incidentDate", event.target.value)} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Loan amount range<select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.loanAmountRange} onChange={(event) => updateField("loanAmountRange", event.target.value)}>{loanAmountRanges.map((range) => <option key={range || "empty"} value={range}>{range || "Select range"}</option>)}</select></label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-700">Summary<textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} /></label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Evidence and linked IDs</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">Evidence file IDs<input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={evidenceIdsText} onChange={(event) => setEvidenceIdsText(event.target.value)} /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Complaint draft IDs<input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={draftIdsText} onChange={(event) => setDraftIdsText(event.target.value)} /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Linked review ID<input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.linkedReviewId} onChange={(event) => updateField("linkedReviewId", event.target.value)} /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Decision session ID<input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.decisionTreeSessionId} onChange={(event) => updateField("decisionTreeSessionId", event.target.value)} /></label>
          </div>
        </div>
        {updateCase.isSuccess && <p className="text-sm text-emerald-700">Case saved.</p>}
        {updateCase.isError && <p className="text-sm text-rose-700">{(updateCase.error as Error).message}</p>}
      </div>
    </section>
  );
}

function TimelineSection({ caseId, items }: { caseId: string; items: HarassmentCase["timelineItems"] }) {
  const addTimeline = useCreateTimelineItem(caseId);
  const [type, setType] = useState("OTHER");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [happenedAt, setHappenedAt] = useState("");
  const [evidenceIds, setEvidenceIds] = useState("");

  const handleAdd = () => {
    addTimeline.mutate({ type, title, description, happenedAt: happenedAt || undefined, evidenceFileIds: parseIds(evidenceIds) }, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setHappenedAt("");
        setEvidenceIds("");
      },
    });
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950">Case Timeline</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">{formatLabel(item.type)}: {item.title}</p>
            {item.happenedAt && <p className="text-xs text-slate-500">{new Date(item.happenedAt).toLocaleDateString()}</p>}
            {item.description && <p className="mt-1 text-slate-600">{item.description}</p>}
            <p className="mt-1 text-xs text-slate-500">Evidence IDs: {item.evidenceFileIds.length ? item.evidenceFileIds.join(", ") : "None"}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={type} onChange={(event) => setType(event.target.value)}>{timelineTypes.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select>
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Timeline title" />
        <textarea className="rounded border border-slate-300 px-2 py-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What happened?" />
        <input type="date" className="rounded border border-slate-300 px-2 py-2 text-sm" value={happenedAt} onChange={(event) => setHappenedAt(event.target.value)} />
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={evidenceIds} onChange={(event) => setEvidenceIds(event.target.value)} placeholder="Evidence IDs for this event" />
        <button type="button" className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={title.trim().length < 2 || addTimeline.isPending} onClick={handleAdd}>
          {addTimeline.isPending ? "Adding..." : "Add timeline item"}
        </button>
      </div>
    </article>
  );
}

function CaseChecklist({ caseId, items }: { caseId: string; items: HarassmentCase["checklistItems"] }) {
  const addChecklist = useCreateChecklistItem(caseId);
  const updateChecklist = useUpdateChecklistItem(caseId);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950">Case Checklist</h2>
      <div className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2">
            <input type="checkbox" className="mt-1" checked={item.completed} onChange={() => updateChecklist.mutate({ itemId: item.id, body: { completed: !item.completed } })} />
            <span><span className="block font-medium text-slate-900">{item.label}</span>{item.description && <span className="text-xs text-slate-500">{item.description}</span>}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Add checklist item" />
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional note" />
        <button type="button" className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={label.trim().length < 2 || addChecklist.isPending} onClick={() => addChecklist.mutate({ label, description }, { onSuccess: () => { setLabel(""); setDescription(""); } })}>
          Add checklist item
        </button>
      </div>
    </article>
  );
}

function ExternalComplaintTracker({ caseId, items }: { caseId: string; items: HarassmentCase["externalComplaints"] }) {
  const tracker = useExternalComplaintTracker(caseId);
  const [channel, setChannel] = useState("RBI_CMS");
  const [status, setStatus] = useState("DRAFTED");
  const [complaintNumber, setComplaintNumber] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const handleAdd = () => {
    tracker.create.mutate({ channel, status, complaintNumber, submittedAt: submittedAt || undefined, notes, documentUrl: documentUrl || undefined }, {
      onSuccess: () => {
        setComplaintNumber("");
        setSubmittedAt("");
        setNotes("");
        setDocumentUrl("");
      },
    });
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950">External Complaint Tracker</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">{formatLabel(item.channel)} | {formatLabel(item.status)}</p>
            <p className="text-xs text-slate-500">Number: {item.complaintNumber || "Not added"}</p>
            {item.submittedAt && <p className="text-xs text-slate-500">Submitted: {new Date(item.submittedAt).toLocaleDateString()}</p>}
            {item.notes && <p className="mt-1 text-slate-600">{item.notes}</p>}
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={channel} onChange={(event) => setChannel(event.target.value)}>{complaintChannels.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select>
        <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>{complaintStatuses.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select>
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={complaintNumber} onChange={(event) => setComplaintNumber(event.target.value)} placeholder="Complaint/reference number" />
        <input type="date" className="rounded border border-slate-300 px-2 py-2 text-sm" value={submittedAt} onChange={(event) => setSubmittedAt(event.target.value)} />
        <input className="rounded border border-slate-300 px-2 py-2 text-sm" value={documentUrl} onChange={(event) => setDocumentUrl(event.target.value)} placeholder="Document URL" />
        <textarea className="rounded border border-slate-300 px-2 py-2 text-sm" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" />
        <button type="button" className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={tracker.create.isPending} onClick={handleAdd}>
          {tracker.create.isPending ? "Adding..." : "Add complaint record"}
        </button>
      </div>
    </article>
  );
}

function EvidenceAndLinks({ c, linkId, setLinkId, onLinkReview, onLinkEvidence, onLinkDecision, onLinkDraft }: { c: HarassmentCase; linkId: string; setLinkId: (value: string) => void; onLinkReview: () => void; onLinkEvidence: () => void; onLinkDecision: () => void; onLinkDraft: () => void }) {
  const linkedItems = [
    ["Linked review", c.linkedReviewId || "None"],
    ["Decision session", c.decisionTreeSessionId || "None"],
    ["Evidence IDs", c.linkedEvidenceFileIds.length ? c.linkedEvidenceFileIds.join(", ") : "None"],
    ["Complaint draft IDs", c.linkedComplaintDraftIds.length ? c.linkedComplaintDraftIds.join(", ") : "None"],
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-950">Evidence and Linked Records</h2>
      <p className="mt-1 text-sm text-slate-600">Keep evidence private, then link IDs here so every action stays traceable.</p>
      <div className="mt-3 grid gap-2 text-sm">
        {linkedItems.map(([label, value]) => <p key={label}><span className="font-medium text-slate-900">{label}:</span> <span className="text-slate-600">{value}</span></p>)}
      </div>
      <div className="mt-3">
        <input className="w-full rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Enter review, evidence, decision, or draft ID" value={linkId} onChange={(event) => setLinkId(event.target.value)} />
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <button className="rounded border border-slate-300 px-2 py-1" onClick={onLinkReview}>Link Review</button>
          <button className="rounded border border-slate-300 px-2 py-1" onClick={onLinkEvidence}>Link Evidence</button>
          <button className="rounded border border-slate-300 px-2 py-1" onClick={onLinkDecision}>Link Decision Session</button>
          <button className="rounded border border-slate-300 px-2 py-1" onClick={onLinkDraft}>Link Complaint Draft</button>
        </div>
      </div>
    </article>
  );
}

function CasePrivacyNotice() {
  return <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Do not store OTPs, passwords, Aadhaar/PAN, full bank details, or private photos unless required for official legal process. This tool helps organize information and is not legal advice.</section>;
}

export default function HarassmentCaseDetailPage({ caseId }: { caseId: string }) {
  const detail = useCaseDetail(caseId);
  const archive = useArchiveCase(caseId);
  const linkReview = useLinkCaseReview(caseId);
  const linkEvidence = useLinkCaseEvidence(caseId);
  const linkDecision = useLinkCaseDecisionSession(caseId);
  const linkDraft = useLinkCaseComplaintDraft(caseId);
  const [linkId, setLinkId] = useState("");

  if (detail.isLoading) return <main className="p-6">Loading case...</main>;
  if (!detail.data) return <main className="p-6">Case not found.</main>;
  const c = detail.data;

  const linkAndClear = (action: () => void) => {
    if (!linkId.trim()) return;
    action();
    setLinkId("");
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <CaseDetailHeader c={c} onArchive={() => archive.mutate()} isArchiving={archive.isPending} />
      <CaseProgressSummary c={c} />
      <EditableCaseDetails c={c} />

      <section className="grid gap-4 lg:grid-cols-2">
        <EvidenceAndLinks
          c={c}
          linkId={linkId}
          setLinkId={setLinkId}
          onLinkReview={() => linkAndClear(() => linkReview.mutate(linkId))}
          onLinkEvidence={() => linkAndClear(() => linkEvidence.mutate(linkId))}
          onLinkDecision={() => linkAndClear(() => linkDecision.mutate(linkId))}
          onLinkDraft={() => linkAndClear(() => linkDraft.mutate(linkId))}
        />
        <ExternalComplaintTracker caseId={c.id} items={c.externalComplaints} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TimelineSection caseId={c.id} items={c.timelineItems} />
        <CaseChecklist caseId={c.id} items={c.checklistItems} />
      </section>

      <CasePrivacyNotice />
    </main>
  );
}
