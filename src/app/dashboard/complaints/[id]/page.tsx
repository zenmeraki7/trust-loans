import Link from "next/link";

export default async function UserComplaintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Complaint details</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">Private complaint workspace for complaint ID <span className="font-semibold text-slate-950">{id}</span>.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {["Incident details", "Evidence", "Drafts", "Destinations", "Submission records", "Status history"].map((section) => (
          <article key={section} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">{section}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This section is intended to load only records scoped to the authenticated user.</p>
          </article>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/complaints" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Back to complaint dashboard</Link>
        <Link href="/complaints/export" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Draft and export</Link>
      </div>
    </main>
  );
}
