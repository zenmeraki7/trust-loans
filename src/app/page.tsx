import Link from "next/link";
import { Suspense } from "react";

function HomeSectionFallback({ label }: { label: string }) {
  return <div className="min-h-40 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500" aria-label={`Loading ${label}`}>Loading {label}…</div>;
}

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
    <main className="home-page min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1500px] items-start gap-5 xl:grid-cols-[1.45fr_0.65fr]">
          <div className="home-primary overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="grid gap-6 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-6 md:grid-cols-[1fr_0.85fr] md:p-8 lg:p-10">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
                  Borrower protection and loan-app transparency
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Understand the loan. Get help with threats and recovery harassment.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
                  Check who is behind a loan app, understand its costs and warning signs, and take safer action if recovery agents threaten, shame, or repeatedly harass you.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/emergency-help" className="rounded-xl bg-rose-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2">
                    I&apos;m being threatened now
                  </Link>
                  <Link href="/complaints/start" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
                    Get complaint help
                  </Link>
                </div>

                <form action="/loan-apps" className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5 sm:flex-row">
                  <label className="sr-only" htmlFor="loan-search">Search loan app or company</label>
                  <input
                    id="loan-search"
                    name="q"
                    className="min-h-12 flex-1 border-0 bg-transparent px-4 text-sm shadow-none focus:ring-0"
                    placeholder="Search an app or lender..."
                  />
                  <button className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2">
                    Check loan app
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-lg font-bold text-slate-950">Before borrowing</p>
                    <p className="text-sm text-slate-600">Check the lender, total cost, permissions, and grievance contact.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-lg font-bold text-slate-950">If harassment starts</p>
                    <p className="text-sm text-slate-600">Protect yourself, record the incident details, and choose the right complaint path.</p>
                  </div>
                </div>
              </div>

              <div className="home-hero-visual rounded-[2rem] border border-blue-100 bg-white/80 p-6 shadow-inner md:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Recovery warning signs</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">Collection pressure should never become intimidation.</h2>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                  {[
                    "Threats of violence, arrest, or public humiliation",
                    "Repeated abusive calls or messages",
                    "Sharing loan details with relatives, friends, or colleagues",
                    "Misusing contact lists, photos, or personal information",
                  ].map((warning) => (
                    <li key={warning} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-600" aria-hidden="true" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/debt-recovery-rules" className="mt-5 inline-flex text-sm font-bold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-700">
                  Understand responsible recovery practices
                </Link>
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
                    <div key={app.name} className="home-app-row grid grid-cols-[1fr_auto] gap-3 py-3 sm:grid-cols-[1fr_72px_82px_90px] sm:items-center">
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
                      <div className="home-experience-row flex items-start justify-between gap-3">
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

          <Suspense fallback={<HomeSectionFallback label="borrower support options" />}>
          <div className="space-y-4">
            <aside className="h-fit overflow-hidden rounded-[1.75rem] border border-rose-200 bg-white shadow-xl shadow-rose-950/5">
              <div className="bg-rose-600 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-100">Help comes first</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">Are recovery agents threatening or harassing you?</h2>
                <p className="mt-3 text-sm leading-6 text-rose-50">You do not need to finish a long form before seeing urgent safety steps and reporting options.</p>
                <Link href="/emergency-help" className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-rose-700 transition hover:bg-rose-50">
                  Open emergency help
                </Link>
              </div>

              <div className="space-y-1 p-3">
                {[
                  ["/complaints/start", "Prepare a complaint", "Answer plain-language questions and generate a structured draft."],
                  ["/loan-apps", "Understand a loan app", "Check the business identity, fees, complaints, and safety information."],
                  ["/complaint-tutorials", "Choose where to report", "Find guidance for lender, RBI, cybercrime, and police channels."],
                ].map(([href, title, detail]) => (
                  <Link key={href} href={href} className="block rounded-2xl p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
                    <span className="block font-bold text-slate-950">{title}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">{detail}</span>
                  </Link>
                ))}
              </div>
            </aside>

            <section className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/10">
              <h2 className="text-lg font-bold text-white">Before accepting a digital loan</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li className="border-l-2 border-blue-500 pl-3">Confirm the legal lender and regulated NBFC or bank.</li>
                <li className="border-l-2 border-blue-500 pl-3">Compare the interest, processing fee, late charges, and total repayment.</li>
                <li className="border-l-2 border-blue-500 pl-3">Review app permissions and avoid unnecessary contact or media access.</li>
                <li className="border-l-2 border-blue-500 pl-3">Save official grievance contacts before you need them.</li>
              </ul>
            </section>
          </div>
          </Suspense>

        </div>
      </section>

      <Suspense fallback={<HomeSectionFallback label="platform guide" />}>
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">From uncertainty to action</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Understand the lender. Recognize harassment. Take the right next step.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Trust Loans connects loan-app transparency with practical borrower protection, so you can make a safer borrowing decision or respond when recovery conduct crosses the line.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["1", "Identify", "Find the app, legal lender, associated NBFC, and official contacts."],
              ["2", "Understand", "Review costs, permissions, complaint patterns, and recovery concerns."],
              ["3", "Respond", "Get urgent safety guidance or prepare a complaint in plain language."],
              ["4", "Track", "Keep case details and complaint progress together in your account."],
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
      </Suspense>

      <Suspense fallback={<HomeSectionFallback label="safety resources" />}>
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
      </Suspense>

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
