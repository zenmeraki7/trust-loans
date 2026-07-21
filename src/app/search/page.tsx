import Link from "next/link";

const filters = [
  "App or lender name",
  "Legal entity or NBFC partner",
  "Interest rate and fees",
  "Loan tenure",
  "Complaint category",
  "Recovery-practice concerns",
  "Regulatory verification",
  "Safety level",
];

export default function SearchAndFilteringPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Search and filter lenders safely</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
          Find loan apps, NBFCs, banks, and digital lenders by name, fees, complaint patterns, recovery concerns, and verification status.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/directory" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">Open public directory</Link>
          <Link href="/loan-apps" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white">Search loan apps</Link>
          <Link href="/compare" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white">Compare options</Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filters.map((filter) => (
          <article key={filter} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">{filter}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Available through the directory and comparison filters.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
