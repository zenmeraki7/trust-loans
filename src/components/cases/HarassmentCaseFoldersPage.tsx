"use client";

import Link from "next/link";
import { useState } from "react";
import { useArchiveCase, useCases, useCreateCase } from "@/hooks/useCases";
import type { HarassmentCase } from "@/types/harassmentCase";

function CaseStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const isArchived = normalized.includes("archiv") || normalized.includes("closed");
  const isOpen = normalized.includes("open") || normalized.includes("active");
  const tone = isArchived
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : isOpen
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-slate-200 bg-slate-50 text-slate-700";
  const label = status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}

function CaseFolderCard({ item }: { item: HarassmentCase }) {
  const archiveCase = useArchiveCase(item.id);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{item.caseType} | {item.priority}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <CaseStatusBadge status={item.status} />
      </div>
      <p className="text-sm text-slate-600">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
      <p className="text-xs text-slate-500">Checklist: {item.checklistItems.filter((x) => x.completed).length}/{item.checklistItems.length} | Evidence linked: {item.linkedEvidenceFileIds.length}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link href={`/dashboard/cases/${item.id}`} className="inline-block rounded border border-slate-300 px-3 py-1 text-xs">Open case</Link>
        <button
          type="button"
          onClick={() => setShowArchiveConfirm(true)}
          disabled={archiveCase.isPending}
          className="rounded border border-rose-300 px-3 py-1 text-xs font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {archiveCase.isPending ? "Archiving..." : "Archive case"}
        </button>
      </div>
      {showArchiveConfirm && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-950">Archive this case?</p>
          <p className="mt-1 text-xs leading-5 text-rose-800">
            This removes "{item.title}" from active case folders. Evidence and history are not permanently deleted.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowArchiveConfirm(false)}
              disabled={archiveCase.isPending}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => archiveCase.mutate(undefined, { onSuccess: () => setShowArchiveConfirm(false) })}
              disabled={archiveCase.isPending}
              className="rounded bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {archiveCase.isPending ? "Archiving..." : "Archive"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function HarassmentCaseFoldersPage() {
  const casesQuery = useCases();
  const createCase = useCreateCase();
  const [title, setTitle] = useState("");
  const [caseType, setCaseType] = useState("THREAT_CALLS");

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Harassment Case Folders</h1>
        <p className="text-sm text-slate-600">This case folder is private to you. This tool helps organize information and is not legal advice.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Create Case Folder</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input className="rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Case title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={caseType} onChange={(e) => setCaseType(e.target.value)}>
            {["THREAT_CALLS", "CONTACT_LIST_ABUSE", "PHOTO_MORPHING_THREAT", "PAYMENT_NOT_UPDATED", "LOAN_NOT_CLOSED", "DATA_MISUSE", "OTHER"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white" onClick={() => createCase.mutate({ title, caseType })}>Create</button>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(casesQuery.data ?? []).map((item) => (
          <CaseFolderCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
