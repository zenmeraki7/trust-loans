"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EvidenceKind = "screenshot" | "recording" | "receipt" | "document" | "url" | "phone" | "note";
type EvidenceChecklistItem = { id: string; caseName: string; kind: EvidenceKind; detail: string; createdAt: string };

const STORAGE_KEY = "trust-loans-evidence-checklist";
const kindLabels: Record<EvidenceKind, string> = {
  screenshot: "Screenshot to keep on your device",
  recording: "Call recording to keep securely",
  receipt: "Payment receipt to preserve",
  document: "Document to keep securely",
  url: "URL or profile link",
  phone: "Phone number or account",
  note: "Incident note",
};

function loadChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as EvidenceChecklistItem[];
  } catch {
    return [];
  }
}

export default function UserEvidenceVault() {
  const [items, setItems] = useState<EvidenceChecklistItem[]>([]);
  const [caseName, setCaseName] = useState("My current case");
  const [kind, setKind] = useState<EvidenceKind>("screenshot");
  const [detail, setDetail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(loadChecklist());
  }, []);

  const cases = useMemo(() => Array.from(new Set(items.map((item) => item.caseName))), [items]);
  const visibleItems = items.filter((item) => item.caseName === caseName);

  const persist = (next: EvidenceChecklistItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setItems(next);
  };

  const addChecklistItem = () => {
    if (!detail.trim()) return;
    const next = [
      {
        id: crypto.randomUUID(),
        caseName: caseName.trim() || "My current case",
        kind,
        detail: detail.trim(),
        createdAt: new Date().toISOString(),
      },
      ...items,
    ];
    persist(next);
    setDetail("");
    setMessage("Evidence checklist item saved on this device. No evidence file was uploaded or stored by Trust Loans.");
  };

  const deleteItem = (id: string) => {
    persist(items.filter((item) => item.id !== id));
    setMessage("Checklist item removed from this device.");
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Evidence preparation</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Evidence checklist</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          Trust Loans does not collect, store, verify, certify, preview, download, share, redact, scan, or transcribe your evidence. Use this page only to list what you should keep securely and submit directly to the appropriate authority when required.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Important:</strong> Keep original screenshots, recordings, call logs, messages, receipts, and documents on a device or storage location you control. Submit evidence directly to the lender, regulated entity, grievance officer, regulator, police, cybercrime authority, court, or other appropriate authority when required.
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Add an evidence checklist item</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Do not upload files here. Add a short reminder of what evidence exists and where you keep it.</p>
          <label className="mt-4 block text-sm font-semibold text-slate-700">Case name<input value={caseName} onChange={(event) => setCaseName(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="e.g. CashNest harassment" /></label>
          <label className="mt-3 block text-sm font-semibold text-slate-700">Evidence type<select value={kind} onChange={(event) => setKind(event.target.value as EvidenceKind)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base">{Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="mt-3 block text-sm font-semibold text-slate-700">Reminder note<textarea value={detail} onChange={(event) => setDetail(event.target.value)} className="mt-1 min-h-28 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Example: WhatsApp screenshots from +91… saved in phone gallery; payment receipt saved in bank app." /></label>
          <button type="button" onClick={addChecklistItem} className="mt-3 min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Save checklist item</button>
        </article>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Your checklist</h2>
              <p className="mt-1 text-sm text-slate-600">Only short checklist notes are kept in this browser.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{items.length} item{items.length === 1 ? "" : "s"}</span>
          </div>
          {cases.length ? <div className="mt-4 flex flex-wrap gap-2">{cases.map((name) => <button type="button" key={name} onClick={() => setCaseName(name)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${caseName === name ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{name}</button>)}</div> : null}
          <div className="mt-4 grid gap-3">{visibleItems.length ? visibleItems.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{kindLabels[item.kind]}</span><p className="mt-2 break-words text-sm leading-6 text-slate-700">{item.detail}</p></div><time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time></div><button type="button" onClick={() => deleteItem(item.id)} className="mt-3 min-h-10 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Remove reminder</button></article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No checklist items for this case yet.</p>}</div>
        </section>
      </section>

      {message ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
      <Link href="/complaint-wizard" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">Use checklist in complaint wizard</Link>
    </main>
  );
}
