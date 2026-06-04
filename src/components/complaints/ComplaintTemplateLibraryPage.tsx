"use client";

import Link from "next/link";
import { useComplaintTemplates } from "@/hooks/useComplaintTemplates";
import SavedDraftsSection from "./SavedDraftsSection";

export default function ComplaintTemplateLibraryPage() {
  const templatesQuery = useComplaintTemplates();
  const templates = templatesQuery.data ?? [];

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Complaint Template Library</h1>
      <p className="text-sm text-slate-600">Select a template, generate a factual draft, and save it for later.</p>
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">These templates are general drafting support only, not legal advice.</p>
      {templatesQuery.isLoading && <p className="text-sm text-slate-600">Loading templates...</p>}
      {templatesQuery.isError && <p className="text-sm text-rose-700">{(templatesQuery.error as Error).message}</p>}
      {!templatesQuery.isLoading && !templatesQuery.isError && templates.length === 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No active complaint templates are available yet.
        </section>
      )}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">{template.category}</p>
            <h2 className="text-lg font-semibold text-slate-900">{template.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{template.description}</p>
            <Link href={`/complaint-templates/${template.key}`} className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              Use Template
            </Link>
          </article>
        ))}
      </section>
      <SavedDraftsSection />
    </main>
  );
}
