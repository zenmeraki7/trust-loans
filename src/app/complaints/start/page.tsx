import Link from "next/link";

const steps = [
  "Identify the app, lender, NBFC, bank, recovery agency, or unknown caller.",
  "Choose every problem subject that applies.",
  "Write the incident details in simple words.",
  "Review the draft and copy it to the correct official channel.",
];

export default function StartComplaintPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Start a complaint</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Prepare a factual complaint draft without needing legal terminology. The platform helps you organize facts, evidence, and the right destination.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/complaint-wizard" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Open guided complaint form</Link>
          <Link href="/emergency-help" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800">I am being threatened now</Link>
        </div>
      </section>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">{index + 1}</span>
            <p className="mt-3 text-sm leading-6 text-slate-700">{step}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
