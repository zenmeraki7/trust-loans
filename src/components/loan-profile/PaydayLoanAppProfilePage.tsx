import Link from "next/link";
import { isHighRiskPaydayApp, type PaydayLoanApp } from "@/data/paydayLoanApps";

export default function PaydayLoanAppProfilePage({ app }: { app: PaydayLoanApp }) {
  const isHighRisk = isHighRiskPaydayApp(app);
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="border-b border-slate-200 bg-blue-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-slate-600"><Link href="/payday-loan-apps">Payday Loan Apps</Link> / {app.name}</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-950">{app.name} Loan App Reviews</h1>
          <p className="mt-2 text-sm text-slate-700">This payday loan app profile is under verification. Details will be updated as verified information becomes available.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-bold text-white">{app.name.slice(0, 2)}</div>
          <h2 className="mt-4 text-2xl font-bold">{app.name}</h2>
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isHighRisk ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"}`}>
            {isHighRisk ? "High Risk" : "Under review"}
          </span>
          <dl className="mt-5 space-y-4 border-t pt-4 text-sm">
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Claimed NBFC</dt><dd className="mt-1 font-medium">{app.nbfcName ?? "Under verification"}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Trust score</dt><dd className={`mt-1 font-medium ${isHighRisk ? "text-rose-700" : ""}`}>0/100{isHighRisk ? " — High Risk" : " — insufficient data"}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Public reviews</dt><dd className="mt-1 font-medium">0</dd></div>
          </dl>
          <Link href="/payday-loan-apps" className="mt-6 block rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Back to directory</Link>
        </aside>
        <div className="space-y-5">
          {isHighRisk ? (
            <section id="risk-details" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Elevated caution</p><h2 className="mt-1 text-xl font-bold text-rose-950">Why this app may be risky</h2></div>
                <span className="rounded-full bg-rose-700 px-3 py-1 text-xs font-bold text-white">High Risk · 0/100</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Harassment reports", "Contact-list misuse", "Threat calls"].map((indicator) => <div key={indicator} className="rounded-xl border border-rose-200 bg-white p-3 text-sm font-semibold text-rose-900">{indicator}</div>)}
              </div>
              <p className="mt-4 text-xs leading-5 text-rose-800">These are potential complaint indicators presented for borrower caution while profile details are under review. They do not confirm wrongdoing or constitute final legal findings.</p>
            </section>
          ) : null}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Profile summary</h2><p className="mt-3 text-sm leading-6 text-slate-700">Developer, company, website, grievance contact, fees, and repayment details are currently under verification.</p></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Company and contact info</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Developer", "Operating company", "Support contact", "Registered address"].map((label) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm">Under verification</p></div>)}</div></section>
          <section id="reviews" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Borrower reviews</h2><p className="mt-3 text-sm text-slate-600">No public reviews are available yet. Backend review submission will be enabled after this placeholder profile is converted to a verified database record.</p></section>
        </div>
      </div>
    </main>
  );
}
