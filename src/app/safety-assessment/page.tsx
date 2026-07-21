import Link from "next/link";

const factors = [
  "Regulatory identity clarity",
  "Interest and fee transparency",
  "Availability of grievance contacts",
  "Privacy and contact-access disclosures",
  "Recovery-related complaint patterns",
  "App-store and domain consistency",
  "Confirmed regulatory actions",
  "Responsiveness to complaints when available",
];

export default function SafetyAssessmentExplanationPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">How safety assessments work</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Trust Loans safety labels are transparent risk indicators. They are not official findings, legal conclusions, or endorsements.
        </p>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {factors.map((factor) => (
          <article key={factor} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">{factor}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This factor is scored from available public information, profile data, and moderated user signals.</p>
          </article>
        ))}
      </section>
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="text-xl font-bold text-slate-950">Want to check a specific app?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use the risk checker or compare multiple profiles before borrowing.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/risk-checker" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Open risk checker</Link>
          <Link href="/compare" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Compare lenders</Link>
        </div>
      </div>
    </main>
  );
}
