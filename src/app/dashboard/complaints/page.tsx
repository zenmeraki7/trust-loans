import Link from "next/link";

const statuses = ["Draft", "Ready to file", "Submitted by user", "Waiting for response", "Action needed", "Resolved"];

export default function ComplaintTrackingDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Complaint tracking dashboard</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Track complaint drafts, destinations, evidence, user-submitted references, and response deadlines.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statuses.map((status) => (
          <article key={status} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">{status}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Complaints in this state will appear here once connected to backend data.</p>
          </article>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/cases" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Open case folders</Link>
        <Link href="/complaints/start" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Start a new complaint</Link>
      </div>
    </main>
  );
}
