"use client";

import Link from "next/link";
import { useComplaintDrafts, useDeleteComplaintDraft } from "@/hooks/useComplaintTemplates";

export default function SavedDraftsSection() {
  const draftsQuery = useComplaintDrafts();
  const deleteMutation = useDeleteComplaintDraft();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Complaint Drafts</h2>
      <div className="mt-3 space-y-2">
        {(draftsQuery.data ?? []).map((draft) => (
          <article key={draft.id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold text-slate-900">{draft.title}</p>
            <p className="text-xs text-slate-600">{draft.templateKey} | {draft.status} | Updated: {new Date(draft.updatedAt).toLocaleString()}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/complaint-templates/${draft.templateKey}`} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">Continue editing</Link>
              <button onClick={() => deleteMutation.mutate(draft.id)} className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete draft</button>
            </div>
          </article>
        ))}
        {draftsQuery.data?.length === 0 && <p className="text-sm text-slate-600">No saved drafts yet.</p>}
      </div>
    </section>
  );
}
