import Link from "next/link";

const topApps = [
  { name: "Navi Personal Loan", company: "Navi Finserv Limited", score: 72, reviews: "1,248", confidence: "High", tone: "emerald" },
  { name: "MoneyView", company: "WhizDM Innovations Pvt Ltd", score: 58, reviews: "932", confidence: "Medium", tone: "amber" },
  { name: "CASHe", company: "CASHe Loans Private Limited", score: 34, reviews: "756", confidence: "Low", tone: "rose" },
  { name: "KreditBee", company: "Finnovation Tech Solutions Pvt Ltd", score: 48, reviews: "1,107", confidence: "Medium", tone: "amber" },
  { name: "EarlySalary", company: "EarlySalary Services Pvt Ltd", score: 64, reviews: "689", confidence: "Medium", tone: "amber" },
];

const experiences = [
  { title: "Repeated calls and threats", detail: "User reported repeated calls to family contacts after repayment delay.", status: "Under Review", tone: "amber", time: "2h ago" },
  { title: "Contacted my relatives", detail: "Borrower says relatives were contacted after a missed EMI.", status: "Verified", tone: "emerald", time: "5h ago" },
  { title: "Hidden processing fees", detail: "Disbursed amount was lower than shown during checkout.", status: "Company Responded", tone: "blue", time: "8h ago" },
];

const issues = [
  { title: "Excessive Calls", count: "8,421 reports" },
  { title: "Contacting Relatives", count: "5,231 reports" },
  { title: "Threats / Abuse", count: "3,108 reports" },
  { title: "Hidden Fees", count: "2,756 reports" },
  { title: "Privacy Concerns", count: "1,980 reports" },
  { title: "Irregular Recovery", count: "1,624 reports" },
];

const features = [
  { title: "100% Anonymous", description: "Your identity is protected by privacy controls." },
  { title: "Evidence Based", description: "We encourage proof and private evidence metadata." },
  { title: "Company Response", description: "Businesses can claim profiles and respond." },
  { title: "Public Transparency", description: "Borrower data becomes safer public insight." },
];

const stats = [
  ["18,246", "Total Reviews"],
  ["6,521", "Evidence Submissions"],
  ["1,214", "Companies Listed"],
  ["93%", "Anonymous Reviews"],
  ["48hrs", "Avg. First Response Time"],
];

const scoreBreakdown = [
  ["Transparency", "7/10", "w-[70%]", "bg-emerald-500"],
  ["Fee Disclosure", "5/10", "w-[50%]", "bg-amber-500"],
  ["Collection Conduct Reports", "3/10", "w-[30%]", "bg-rose-500"],
  ["Support Responsiveness", "4/10", "w-[40%]", "bg-orange-500"],
  ["Privacy Practices", "5/10", "w-[50%]", "bg-amber-500"],
];

const faqs = [
  ["Is this a lender?", "No. Trust Loans is a borrower transparency and safety platform. It does not provide loans."],
  ["Can I write a review safely?", "Yes. The Safe Review Writer checks for private data, risky wording, and moderation readiness."],
  ["Where do I report harassment?", "Use Emergency Help for immediate next steps, then create a case folder to track evidence and complaint numbers."],
  ["Can companies respond?", "Yes. Companies can use the business claim flow and responses can appear after review."],
];

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1500px] items-start gap-5 xl:grid-cols-[1.45fr_0.65fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="grid gap-6 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-6 md:grid-cols-[1fr_0.85fr] md:p-8 lg:p-10">
              <div className="flex flex-col justify-center">
                <p className="w-fit rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                  Borrower-first loan app transparency
                </p>
                <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Check Before You Borrow
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
                  Real borrower reviews, evidence-based insights, safer complaint tools, and company response tracking for loan app users.
                </p>

                <form action="/loan-apps" className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5 sm:flex-row">
                  <label className="sr-only" htmlFor="loan-search">Search loan app or company</label>
                  <input
                    id="loan-search"
                    name="q"
                    className="min-h-12 flex-1 border-0 bg-transparent px-4 text-sm shadow-none focus:ring-0"
                    placeholder="Search loan app or company..."
                  />
                  <button className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2">
                    Check App
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-bold text-slate-950">18,246</p>
                    <p className="text-sm text-slate-600">Borrower reviews</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-bold text-slate-950">6,521</p>
                    <p className="text-sm text-slate-600">Evidence submissions</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[320px] rounded-[2rem] border border-blue-100 bg-white/65 p-6 shadow-inner">
                <div className="absolute left-8 top-8 rounded-3xl bg-blue-700 p-5 text-white shadow-xl">
                  <p className="text-sm font-semibold">Borrower Shield</p>
                  <p className="mt-2 text-4xl font-bold">Safe</p>
                </div>
                <div className="absolute bottom-8 right-8 w-52 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl">
                  <div className="h-3 w-28 rounded-full bg-slate-200" />
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <span key={item} className={item <= 3 ? "text-amber-400" : "text-slate-300"}>★</span>
                    ))}
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="absolute bottom-14 left-8 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-xl">
                  <p className="text-sm font-semibold text-slate-950">Borrower First</p>
                  <p className="text-xs text-slate-500">Evidence encouraged</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-200 bg-white p-4 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-950">Top Reviewed Lending Apps</h2>
                  <Link href="/loan-apps" className="text-sm font-semibold text-blue-700">View all</Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {topApps.map((app) => (
                    <div key={app.name} className="grid grid-cols-[1fr_auto] gap-3 py-3 sm:grid-cols-[1fr_72px_82px_90px] sm:items-center">
                      <div>
                        <p className="font-semibold text-slate-950">{app.name}</p>
                        <p className="text-xs text-slate-500">{app.company}</p>
                      </div>
                      <p className="font-bold text-slate-950">{app.score}<span className="text-xs font-medium text-slate-500">/100</span></p>
                      <p className="hidden text-sm text-slate-600 sm:block">{app.reviews}<br /><span className="text-xs text-slate-400">reviews</span></p>
                      <span className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ring-1 ${toneClasses[app.tone as keyof typeof toneClasses]}`}>{app.confidence}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-950">Recent Borrower Experiences</h2>
                  <Link href="/loan-apps" className="text-sm font-semibold text-blue-700">Write review</Link>
                </div>
                <div className="space-y-3">
                  {experiences.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-rose-600">User alleges</p>
                          <h3 className="mt-1 font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-1 text-sm leading-5 text-slate-600">{item.detail}</p>
                          <p className="mt-2 text-xs text-slate-500">{item.time} - Evidence submitted</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ring-1 ${toneClasses[item.tone as keyof typeof toneClasses]}`}>{item.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <h2 className="text-base font-semibold text-slate-950">Common Reported Issues</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {issues.map((issue) => (
                  <Link key={issue.title} href="/patterns" className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                    <p className="text-sm font-semibold text-slate-950">{issue.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{issue.count}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 bg-slate-950 p-4 text-white sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <h2 className="text-center text-lg font-bold text-slate-950">App Profile</h2>
              <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-500">Home / Loan Apps / MoneyView</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-700 text-xl font-bold text-white">M</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">MoneyView</h3>
                    <p className="text-xs text-slate-500">WhizDM Innovations Pvt Ltd</p>
                    <Link href="/entities" className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Company profile</Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-950">Borrower Safety Score</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-bold text-slate-950">58<span className="text-sm text-slate-400">/100</span></p>
                    <p className="mt-2 text-xs text-slate-500">Based on 932 reviews and 74 evidence submissions</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Medium</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">Score Breakdown</p>
                  <Link href="/review-policy" className="text-xs font-semibold text-blue-700">Methodology</Link>
                </div>
                <div className="mt-4 space-y-4">
                  {scoreBreakdown.map(([label, value, width, color]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-semibold text-slate-950">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${width} ${color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 p-5 text-sm">
                <dl className="space-y-3">
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Operating Entity</dt><dd className="font-medium text-slate-950">WhizDM Innovations Pvt Ltd</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">RBI Registered NBFC</dt><dd className="font-medium text-slate-950">No</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Company Response</dt><dd className="font-medium text-emerald-700">Yes</dd></div>
                </dl>
              </div>

              <Link href="/loan-apps" className="mt-4 block rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800">
                Write a Review
              </Link>
            </aside>

            <section className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/10">
              <p className="mb-3 text-sm font-semibold text-white">Our platform in numbers</p>
              <div className="grid grid-cols-2 gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{label}</p>
                </div>
              ))}
              </div>
            </section>
          </div>

        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">A safer path from search to action.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Trust Loans guides borrowers through the important steps: check the app, understand common risks, submit a safer review, and track private case details when needed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["1", "Search", "Find loan apps, companies, and claimed NBFC partners."],
              ["2", "Review", "Read borrower experiences and complaint patterns."],
              ["3", "Report", "Write a safer review or generate a complaint draft."],
              ["4", "Track", "Use case folders and notifications for updates."],
            ].map(([step, title, detail]) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">{step}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Emergency help</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Facing threats, abusive calls, or contact-list harassment?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              Use emergency help to preserve evidence, reduce immediate risk, and choose the right next step. Do not share OTPs, passwords, private photos, or full bank details.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/emergency-help" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Open Emergency Help</Link>
              <Link href="/dashboard/cases" className="rounded-xl border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">Create Case Folder</Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-950">
                    {question}
                    <span className="text-lg text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-950">Trust Loans</p>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">Borrower safety tools for loan app reviews, case tracking, complaint drafting, and company transparency. Not legal advice.</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm" aria-label="Footer navigation">
            <Link href="/review-policy" className="font-semibold text-slate-600 hover:text-slate-950">Review Policy</Link>
            <Link href="/corrections" className="font-semibold text-slate-600 hover:text-slate-950">Corrections</Link>
            <Link href="/business/claim" className="font-semibold text-slate-600 hover:text-slate-950">Business Claim</Link>
            <Link href="/learn/payday-loans" className="font-semibold text-slate-600 hover:text-slate-950">Guides</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
