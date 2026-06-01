"use client";

import { useState } from "react";
import { useAdminEvidenceDetail, useAdminEvidenceQueue, useEvidenceDecisionActions, useSecureOpenEvidence } from "@/hooks/useEvidence";
import type { AdminEvidenceVaultData } from "@/types/adminEvidenceVault";

function EvidenceStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{status.replaceAll("_", " ")}</span>;
}

export default function AdminEvidenceVaultPage(_data: { data: AdminEvidenceVaultData }) {
  const queue = useAdminEvidenceQueue();
  const [selectedId, setSelectedId] = useState<string>("");
  const detail = useAdminEvidenceDetail(selectedId);
  const secureOpen = useSecureOpenEvidence();
  const actions = useEvidenceDecisionActions();

  const evidence = queue.data ?? [];

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold">Admin Evidence Queue</h1>
          <div className="mt-3 space-y-2">
            {evidence.map((e) => (
              <article key={e.id} className="rounded-lg border border-slate-200 p-3 text-xs">
                <p className="font-semibold">{e.maskedFileName}</p>
                <p>{e.mimeType} • {new Date(e.uploadedAt).toLocaleString()}</p>
                <EvidenceStatusBadge status={e.status} />
                <button onClick={() => setSelectedId(e.id)} className="ml-2 rounded border px-2 py-1">Open</button>
              </article>
            ))}
            {evidence.length === 0 && <p className="text-sm text-slate-600">No evidence records.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Admin Evidence Detail</h2>
          {!selectedId && <p className="mt-2 text-sm text-slate-600">Select an evidence record.</p>}
          {detail.data && (
            <div className="mt-3 space-y-2 text-xs">
              <p>{detail.data.maskedFileName}</p>
              <p>{detail.data.mimeType} • {detail.data.fileSizeBytes} bytes</p>
              <p>Sensitive flags: {detail.data.sensitiveFlags.join(", ") || "none"}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => secureOpen.mutate({ id: detail.data!.id, reasonForAccess: "Evidence vault secure review" })} className="rounded border px-2 py-1">Secure Review</button>
                <button onClick={() => void actions.accept(detail.data!.id)} className="rounded border px-2 py-1">Accept</button>
                <button onClick={() => void actions.privateOnly(detail.data!.id)} className="rounded border px-2 py-1">Private only</button>
                <button onClick={() => void actions.reject(detail.data!.id, "Unsafe evidence")} className="rounded border px-2 py-1">Reject</button>
                <button onClick={() => void actions.requestReplacement(detail.data!.id, "Please upload redacted evidence")} className="rounded border px-2 py-1">Request replacement</button>
                <button onClick={() => void actions.remove(detail.data!.id, "Delete unsafe evidence")} className="rounded border px-2 py-1">Delete</button>
                <button onClick={() => void actions.escalate(detail.data!.id)} className="rounded border px-2 py-1">Escalate</button>
              </div>
              {secureOpen.data?.downloadUrl && <p className="rounded bg-amber-50 p-2 text-amber-900">Opening evidence is logged. Secure URL: {secureOpen.data.downloadUrl}</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
