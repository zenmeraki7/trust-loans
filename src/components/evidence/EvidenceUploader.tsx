"use client";

import type { EvidenceMetadata } from "@/types/evidence";

export function EvidenceSafetyWarningBox() {
  return <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Do not upload Aadhaar, PAN, OTPs, passwords, bank statements, private photos, children's photos, or unrelated personal chats. Evidence is private by default. Companies cannot view private user evidence.</p>;
}

export function EvidenceStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{status.replaceAll("_", " ")}</span>;
}

export function EvidenceUploadDropzone({ onPick }: { onPick: (names: string[]) => void }) {
  return <input type="file" multiple onChange={(e) => onPick(Array.from(e.target.files ?? []).map((f) => f.name))} className="block w-full text-sm" />;
}

export function EvidenceUploadList({ items }: { items: EvidenceMetadata[] }) {
  return <div className="space-y-2">{items.map((e) => <div key={e.id} className="rounded border p-2 text-xs"><p>{e.maskedFileName} ({e.mimeType})</p><EvidenceStatusBadge status={e.status} /></div>)}</div>;
}

export function EvidenceUploader({ files, onPick, uploads }: { files: string[]; onPick: (names: string[]) => void; uploads: EvidenceMetadata[] }) {
  return <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-semibold">Evidence Upload</h3><EvidenceUploadDropzone onPick={onPick} /><p className="text-xs text-slate-500">Selected: {files.join(", ") || "None"}</p><EvidenceSafetyWarningBox /><EvidenceUploadList items={uploads} /></section>;
}

export function SecurePreviewGate({ onOpen }: { onOpen: (reasonForAccess: string) => void }) {
  return <div className="space-y-2 rounded border border-amber-300 bg-amber-50 p-3 text-xs"><p>Opening evidence is logged.</p><button className="rounded bg-slate-900 px-3 py-1 text-white" onClick={() => onOpen("Admin moderation review")}>Secure Review</button></div>;
}

export function EvidenceDecisionActions({ onAction }: { onAction: (action: "accept" | "reject" | "private-only" | "request-replacement" | "delete" | "escalate") => void }) {
  return <div className="flex flex-wrap gap-2">{(["accept", "reject", "private-only", "request-replacement", "delete", "escalate"] as const).map((a) => <button key={a} onClick={() => onAction(a)} className="rounded border px-2 py-1 text-xs">{a}</button>)}</div>;
}
