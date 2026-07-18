"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useArchiveCase, useCaseLoanAppOptions, useCases, useCreateCase } from "@/hooks/useCases";
import type { HarassmentCase, HarassmentCaseInput } from "@/types/harassmentCase";

const caseTypes = [
  "THREAT_CALLS",
  "CONTACT_LIST_ABUSE",
  "OFFICE_HARASSMENT",
  "PHOTO_MORPHING_THREAT",
  "DATA_MISUSE",
  "FAKE_LEGAL_NOTICE",
  "PAYMENT_NOT_UPDATED",
  "LOAN_NOT_CLOSED",
  "HIDDEN_CHARGES",
  "PERSONAL_UPI_PRESSURE",
  "OTHER",
];

const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"];
const statuses = ["OPEN", "WAITING_FOR_RESPONSE", "ACTION_NEEDED", "RESOLVED", "ARCHIVED"];
const loanAmountRanges = ["", "Below Rs 5,000", "Rs 5,000 - Rs 25,000", "Rs 25,000 - Rs 1,00,000", "Above Rs 1,00,000", "Not sure"];

const initialCaseForm: HarassmentCaseInput = {
  title: "",
  caseType: "THREAT_CALLS",
  status: "OPEN",
  priority: "NORMAL",
  loanAppId: "",
  summary: "",
  incidentDate: "",
  loanReferenceId: "",
  loanAmountRange: "",
  decisionTreeSessionId: "",
  linkedReviewId: "",
  linkedEvidenceFileIds: [],
  linkedComplaintDraftIds: [],
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseIds(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function compactPayload(input: HarassmentCaseInput): HarassmentCaseInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== "";
    }),
  ) as HarassmentCaseInput;
}

function CaseStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const isArchived = normalized.includes("archiv") || normalized.includes("closed");
  const isOpen = normalized.includes("open") || normalized.includes("active");
  const tone = isArchived
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : isOpen
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{formatLabel(status)}</span>;
}

function CaseFolderCard({ item }: { item: HarassmentCase }) {
  const archiveCase = useArchiveCase(item.id);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const completedChecklist = item.checklistItems.filter((x) => x.completed).length;
  const evidenceCount = item.linkedEvidenceFileIds.length;
  const draftCount = item.linkedComplaintDraftIds.length;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{formatLabel(item.caseType)} | {formatLabel(item.priority)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
            <CaseStatusBadge status={item.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
        </div>
        <Link href={`/dashboard/cases/${item.id}`} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open case</Link>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
        <span className="rounded-lg bg-slate-50 px-2 py-1">Checklist {completedChecklist}/{item.checklistItems.length}</span>
        <span className="rounded-lg bg-slate-50 px-2 py-1">Evidence {evidenceCount}</span>
        <span className="rounded-lg bg-slate-50 px-2 py-1">Drafts {draftCount}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.summary || "No summary added yet."}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowArchiveConfirm(true)}
          disabled={archiveCase.isPending || item.status === "ARCHIVED"}
          className="rounded border border-rose-300 px-3 py-1 text-xs font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {archiveCase.isPending ? "Archiving..." : "Archive case"}
        </button>
      </div>
      {showArchiveConfirm && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-950">Archive this case?</p>
          <p className="mt-1 text-xs leading-5 text-rose-800">This removes "{item.title}" from active case folders. Evidence and history are not permanently deleted.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowArchiveConfirm(false)} disabled={archiveCase.isPending} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
              Cancel
            </button>
            <button type="button" onClick={() => archiveCase.mutate(undefined, { onSuccess: () => setShowArchiveConfirm(false) })} disabled={archiveCase.isPending} className="rounded bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {archiveCase.isPending ? "Archiving..." : "Archive"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function CaseIntakeForm() {
  const createCase = useCreateCase();
  const loanApps = useCaseLoanAppOptions();
  const [form, setForm] = useState<HarassmentCaseInput>(initialCaseForm);
  const [evidenceIdsText, setEvidenceIdsText] = useState("");
  const [draftIdsText, setDraftIdsText] = useState("");

  const canCreate = form.title.trim().length >= 2;
  const evidenceCount = useMemo(() => parseIds(evidenceIdsText).length, [evidenceIdsText]);
  const draftCount = useMemo(() => parseIds(draftIdsText).length, [draftIdsText]);

  const updateField = (key: keyof HarassmentCaseInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCreate = () => {
    const payload = compactPayload({
      ...form,
      linkedEvidenceFileIds: parseIds(evidenceIdsText),
      linkedComplaintDraftIds: parseIds(draftIdsText),
    });
    createCase.mutate(payload, {
      onSuccess: () => {
        setForm(initialCaseForm);
        setEvidenceIdsText("");
        setDraftIdsText("");
      },
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Create Case Folder</h2>
          <p className="mt-1 text-sm text-slate-600">Capture the facts first, then attach evidence and complaint references as the case grows.</p>
        </div>
        <button type="button" onClick={handleCreate} disabled={!canCreate || createCase.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {createCase.isPending ? "Creating..." : "Create case"}
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Case title
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Example: Threat calls from recovery agent" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Case type
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.caseType} onChange={(event) => updateField("caseType", event.target.value)}>
              {caseTypes.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Status
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Priority
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
              {priorities.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Incident date
            <input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.incidentDate} onChange={(event) => updateField("incidentDate", event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Loan amount range
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.loanAmountRange} onChange={(event) => updateField("loanAmountRange", event.target.value)}>
              {loanAmountRanges.map((range) => <option key={range || "empty"} value={range}>{range || "Select range"}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Loan app
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.loanAppId ?? ""} onChange={(event) => updateField("loanAppId", event.target.value)}>
              <option value="">Not linked yet</option>
              {(loanApps.data ?? []).map((app) => (
                <option key={app.id} value={app.id}>{app.name}{app.slug ? ` (${app.slug})` : ""}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Loan reference ID
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Loan/account/reference number" value={form.loanReferenceId} onChange={(event) => updateField("loanReferenceId", event.target.value)} />
          </label>
        </div>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Case summary
          <textarea className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Write the core facts in calm, chronological language." value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Evidence and linked records</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Evidence file IDs ({evidenceCount})
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Comma-separated evidence IDs" value={evidenceIdsText} onChange={(event) => setEvidenceIdsText(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Complaint draft IDs ({draftCount})
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Comma-separated draft IDs" value={draftIdsText} onChange={(event) => setDraftIdsText(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Linked review ID
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.linkedReviewId} onChange={(event) => updateField("linkedReviewId", event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Decision session ID
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.decisionTreeSessionId} onChange={(event) => updateField("decisionTreeSessionId", event.target.value)} />
            </label>
          </div>
        </div>
        {createCase.isError && <p className="text-sm text-rose-700">{(createCase.error as Error).message}</p>}
      </div>
    </section>
  );
}

export default function HarassmentCaseFoldersPage() {
  const casesQuery = useCases();

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Harassment Case Folders</h1>
        <p className="mt-1 text-sm text-slate-600">Private case folders for organizing incidents, complaint records, evidence IDs, and follow-up tasks. This is not legal advice.</p>
      </section>
      <CaseIntakeForm />
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(casesQuery.data ?? []).map((item) => (
          <CaseFolderCard key={item.id} item={item} />
        ))}
        {casesQuery.data?.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">No case folders yet.</p>}
      </section>
    </main>
  );
}
