"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useComplaintDraft,
  useDeleteComplaintDraft,
  useGenerateComplaintTemplate,
  useUpdateComplaintDraft,
} from "@/hooks/useComplaintTemplates";
import type { ComplaintFormData, ComplaintOutputType } from "@/types/complaintTemplates";

const emptyFormData: ComplaintFormData = {
  loanAppName: "",
  shortSummary: "",
  detailedDescription: "",
  desiredResolution: "",
  evidenceAvailable: "",
};

export default function ComplaintDraftEditorPage({ draftId }: { draftId: string }) {
  const router = useRouter();
  const draftQuery = useComplaintDraft(draftId);
  const updateDraft = useUpdateComplaintDraft(draftId);
  const deleteDraft = useDeleteComplaintDraft();
  const generateDraft = useGenerateComplaintTemplate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState("");
  const [templateKey, setTemplateKey] = useState("");
  const [outputType, setOutputType] = useState<ComplaintOutputType>("GRIEVANCE_EMAIL");
  const [formData, setFormData] = useState<ComplaintFormData>(emptyFormData);
  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");

  useEffect(() => {
    if (!draftQuery.data) return;
    setTitle(draftQuery.data.title);
    setTemplateKey(draftQuery.data.templateKey);
    setOutputType(draftQuery.data.outputType);
    setFormData({ ...emptyFormData, ...draftQuery.data.formData });
    setGeneratedSubject(draftQuery.data.generatedSubject ?? "");
    setGeneratedBody(draftQuery.data.generatedBody);
  }, [draftQuery.data]);

  const updateFormField = (key: keyof ComplaintFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleRegenerate = () => {
    generateDraft.mutate(
      { templateKey, outputType, formData },
      {
        onSuccess: (generated) => {
          setGeneratedSubject(generated.generatedSubject);
          setGeneratedBody(generated.generatedBody);
        },
      },
    );
  };

  const handleSave = () => {
    updateDraft.mutate({
      title,
      outputType,
      formData,
      generatedSubject,
      generatedBody,
    });
  };

  const handleDelete = () => {
    deleteDraft.mutate(draftId, { onSuccess: () => router.push("/complaint-templates") });
  };

  if (draftQuery.isLoading) return <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-slate-600">Loading draft...</main>;
  if (draftQuery.isError) return <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-rose-700">{(draftQuery.error as Error).message}</main>;
  if (!draftQuery.data) return <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-slate-600">Draft not found.</main>;

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Complaint draft</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title || "Untitled draft"}</h1>
            <p className="mt-1 text-sm text-slate-600">Review the saved draft, edit the facts, regenerate text, or save manual changes.</p>
          </div>
          <Link href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
            Back to templates
          </Link>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input className="rounded-lg border border-slate-300 p-2 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Draft title" />
        <input className="rounded-lg border border-slate-300 p-2 text-sm" value={formData.loanAppName} onChange={(event) => updateFormField("loanAppName", event.target.value)} placeholder="Loan app name" />
        <textarea className="min-h-20 rounded-lg border border-slate-300 p-2 text-sm" value={formData.shortSummary} onChange={(event) => updateFormField("shortSummary", event.target.value)} placeholder="Short summary" />
        <textarea className="min-h-28 rounded-lg border border-slate-300 p-2 text-sm" value={formData.detailedDescription} onChange={(event) => updateFormField("detailedDescription", event.target.value)} placeholder="Detailed description" />
        <textarea className="min-h-20 rounded-lg border border-slate-300 p-2 text-sm" value={formData.desiredResolution} onChange={(event) => updateFormField("desiredResolution", event.target.value)} placeholder="Desired resolution" />
        <input className="rounded-lg border border-slate-300 p-2 text-sm" value={formData.evidenceAvailable ?? ""} onChange={(event) => updateFormField("evidenceAvailable", event.target.value)} placeholder="Evidence available" />
        <select className="rounded-lg border border-slate-300 p-2 text-sm" value={outputType} onChange={(event) => setOutputType(event.target.value as ComplaintOutputType)}>
          {(["GRIEVANCE_EMAIL", "RBI_CMS_TEXT", "CYBERCRIME_TEXT", "CONSUMER_HELPLINE_TEXT", "ADVOCATE_BRIEFING_NOTE", "PERSONAL_RECORD"] as ComplaintOutputType[]).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold" value={generatedSubject} onChange={(event) => setGeneratedSubject(event.target.value)} placeholder="Generated subject" />
        <textarea className="mt-3 min-h-72 w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 text-slate-700" value={generatedBody} onChange={(event) => setGeneratedBody(event.target.value)} placeholder="Generated body" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleRegenerate} disabled={generateDraft.isPending || !templateKey} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {generateDraft.isPending ? "Regenerating..." : "Regenerate"}
          </button>
          <button type="button" onClick={handleSave} disabled={updateDraft.isPending} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {updateDraft.isPending ? "Saving..." : "Save changes"}
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(true)} disabled={deleteDraft.isPending} className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
            Delete draft
          </button>
        </div>
        {updateDraft.isSuccess && <p className="mt-2 text-xs text-emerald-700">Draft saved.</p>}
        {generateDraft.isError && <p className="mt-2 text-xs text-rose-700">{(generateDraft.error as Error).message}</p>}
        {showDeleteConfirm && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm font-semibold text-rose-950">Delete this draft?</p>
            <p className="mt-1 text-xs leading-5 text-rose-800">This removes "{title || "Untitled draft"}" from your saved complaint drafts.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={deleteDraft.isPending} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={deleteDraft.isPending} className="rounded bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {deleteDraft.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
