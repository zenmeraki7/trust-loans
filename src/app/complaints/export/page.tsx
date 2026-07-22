import Link from "next/link";

const formats = ["Copy text", "Email-ready body", "Portal text box", "Personal record", "Evidence checklist"];

export default function ComplaintDraftExportPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Complaint draft and export</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Generate, review, copy, and save complaint drafts. External submission must be done by the user through official channels.
        </p>
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <article key={format} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">{format}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Supported by the complaint wizard and saved draft flow.</p>
          </article>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/complaint-wizard" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Generate a draft</Link>
        <Link href="/complaint-templates" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Browse templates</Link>
      </div>
    </main>
  );
}
