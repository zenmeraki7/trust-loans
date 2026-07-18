"use client";

import Link from "next/link";
import { useState } from "react";
import { useComplaintDrafts, useDeleteComplaintDraft } from "@/hooks/useComplaintTemplates";
import type { ComplaintDraft } from "@/types/complaintTemplates";

function SavedDraftCard({ draft }: { draft: ComplaintDraft }) {
  const deleteMutation = useDeleteComplaintDraft();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <article className="rounded-lg border border-slate-200 p-3">
      <p className="font-semibold text-slate-900">{draft.title}</p>
      <p className="text-xs text-slate-600">{draft.templateKey} | {draft.status} | Updated: {new Date(draft.updatedAt).toLocaleString()}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link href={`/complaint-drafts/${draft.id}`} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">Continue editing</Link>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete draft"}
        </button>
      </div>
      {showDeleteConfirm && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-950">Delete this draft?</p>
          <p className="mt-1 text-xs leading-5 text-rose-800">This removes "{draft.title}" from your saved complaint drafts.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteMutation.isPending}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(draft.id, { onSuccess: () => setShowDeleteConfirm(false) })}
              disabled={deleteMutation.isPending}
              className="rounded bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function SavedDraftsSection() {
  const draftsQuery = useComplaintDrafts();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Complaint Drafts</h2>
      <div className="mt-3 space-y-2">
        {(draftsQuery.data ?? []).map((draft) => (
          <SavedDraftCard key={draft.id} draft={draft} />
        ))}
        {draftsQuery.data?.length === 0 && <p className="text-sm text-slate-600">No saved drafts yet.</p>}
      </div>
    </section>
  );
}
