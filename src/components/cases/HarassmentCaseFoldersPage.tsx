"use client";

import Link from "next/link";
import { useState } from "react";
import { useCases, useCreateCase } from "@/hooks/useCases";

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
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{item.caseType} | {item.priority}</p>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-600">Status: {item.status} | Updated: {new Date(item.updatedAt).toLocaleString()}</p>
            <p className="text-xs text-slate-500">Checklist: {item.checklistItems.filter((x) => x.completed).length}/{item.checklistItems.length} | Evidence linked: {item.linkedEvidenceFileIds.length}</p>
            <Link href={`/dashboard/cases/${item.id}`} className="mt-2 inline-block rounded border border-slate-300 px-3 py-1 text-xs">Open case</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
