import Link from "next/link";
import { Suspense } from "react";

function HomeSectionFallback({ label }: { label: string }) {
  return (
    <div
      className="min-h-40 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500"
      aria-label={`Loading ${label}`}
    >
      Loading {label}…
    </div>
  );
}

const topApps = [
  {
    name: "Navi Personal Loan",
    company: "Navi Finserv Limited",
    score: 72,
    reviews: "1,248",
    confidence: "High",
    tone: "emerald",
  },
  {
    name: "EarlySalary",
    company: "EarlySalary Services Pvt Ltd",
    score: 64,
    reviews: "689",
    confidence: "Medium",
    tone: "amber",
  },
  {
    name: "MoneyView",
    company: "WhizDM Innovations Pvt Ltd",
    score: 58,
    reviews: "932",
    confidence: "Medium",
    tone: "amber",
  },
  {
    name: "KreditBee",
    company: "Finnovation Tech Solutions Pvt Ltd",
    score: 48,
    reviews: "1,107",
    confidence: "Medium",
    tone: "amber",
  },
  {
    name: "CASHe",
    company: "CASHe Loans Private Limited",
    score: 34,
    reviews: "756",
    confidence: "Low",
    tone: "rose",
  },
];

const experiences = [
  {
    title: "Repeated calls and threats",
    detail:
      "User reported repeated calls to family contacts after repayment delay.",
    status: "Under Review",
    tone: "amber",
    time: "2h ago",
  },
  {
    title: "Contacted my relatives",
    detail: "Borrower says relatives were contacted after a missed EMI.",
    status: "Verified",
    tone: "emerald",
    time: "5h ago",
  },
  {
    title: "Hidden processing fees",
    detail: "Disbursed amount was lower than shown during checkout.",
    status: "Company Responded",
    tone: "blue",
    time: "8h ago",
  },
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
  {
    title: "100% Anonymous",
    description: "Your identity is protected by privacy controls.",
  },
  {
    title: "Evidence Based",
    description: "We encourage proof and private evidence metadata.",
  },
  {
    title: "Company Response",
    description: "Businesses can claim profiles and respond.",
  },
  {
    title: "Public Transparency",
    description: "Borrower data becomes safer public insight.",
  },
];

const faqs = [
  [
    "Is this a lender?",
    "No. Trust Loans is a borrower transparency and safety platform. It does not provide loans.",
  ],
  [
    "Can I write a review safely?",
    "Yes. The Safe Review Writer checks for private data, risky wording, and moderation readiness.",
  ],
  [
    "Where do I report harassment?",
    "Use Emergency Help for immediate next steps, then create a case folder to track evidence and complaint numbers.",
  ],
  [
    "Can companies respond?",
    "Yes. Companies can use the business claim flow and responses can appear after review.",
  ],
];

export default function HomePage() {
  return (
    <main className="home-page min-h-screen bg-slate-100 text-slate-950">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1500px] items-start gap-5 xl:grid-cols-[1.45fr_0.65fr]">
          {/* Main Hero Card - Dark Modern Styling */}
          <div className="home-primary overflow-hidden rounded-[1.75rem] border border-slate-800 bg-[#070b14] text-white shadow-2xl">
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_0.85fr] md:p-8 lg:p-10">
              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  BORROWER PROTECTION PLATFORM
                </span>

                <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Understand the loan. Get help with recovery harassment.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 font-medium">
                  Check legal lenders behind loan apps, understand hidden costs,
                  and take safe legal action if harassment occurs.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/emergency-help"
                    className="rounded-xl bg-[#e6194b] px-5 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#c0133c]"
                  >
                    I&apos;m being threatened now &rarr;
                  </Link>
                  <Link
                    href="/complaints/start"
                    className="rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Get complaint help
                  </Link>
                </div>

                <form
                  action="/loan-apps"
                  className="mt-6 flex flex-col gap-2 rounded-2xl border-2 border-sky-500/60 bg-slate-900/90 p-2 sm:flex-row focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 shadow-lg shadow-sky-950/20"
                >
                  <label className="sr-only" htmlFor="loan-search">
                    Search loan app or company
                  </label>
                  <input
                    id="loan-search"
                    name="q"
                    className="min-h-12 flex-1 border-0 bg-transparent px-4 text-sm font-semibold text-white placeholder-slate-300 focus:outline-none focus:ring-0"
                    placeholder="Search any loan app or lender name..."
                  />
                  <button className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 active:scale-95 shadow-md">
                    Check app
                  </button>
                </form>
              </div>

              {/* Warning Sign Box (Inside Dark Hero) */}
              <div className="home-hero-visual rounded-[1.5rem] border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm md:p-7">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  • RECOVERY WARNING SIGNS
                </span>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-white">
                  Collection pressure should never become intimidation.
                </h2>

                <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-100">
                  {[
                    "Threats of violence, arrest, or public humiliation",
                    "Repeated abusive calls or spam messages",
                    "Sharing loan details with relatives or colleagues",
                    "Misusing contact lists or gallery metadata",
                  ].map((warning) => (
                    <li
                      key={warning}
                      className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      <span className="font-medium text-slate-200">
                        {warning}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/debt-recovery-rules"
                  className="mt-5 inline-flex text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Understand recovery rules &rarr;
                </Link>
              </div>
            </div>

            {/* Sub-cards inside Hero */}
          <div className="grid gap-4 border-t border-slate-800/80 bg-slate-900/60 p-4 lg:grid-cols-[1.1fr_0.9fr]">
  {/* Top Reviewed Lending Apps - White Card */}
  <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900">Top Reviewed Lending Apps</h2>
        <p className="text-xs text-slate-500">Verified community safety scores</p>
      </div>
      <Link href="/loan-apps" className="text-xs font-semibold text-blue-600 hover:underline">View all &rarr;</Link>
    </div>
    <div className="space-y-3">
      {topApps.map((app) => (
        <div key={app.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
          <div>
            <p className="font-bold text-slate-900">{app.name}</p>
            <p className="text-[11px] text-slate-500">{app.company}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-black text-slate-900 text-sm">{app.score}</span>
              <span className="text-[10px] text-slate-400">/100</span>
              <p className="text-[10px] text-slate-500">{app.reviews} reviews</p>
            </div>
            <span className={`pill-score pill-${app.tone}`}>
              {app.confidence}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Recent Borrower Experiences - White Card */}
 {/* Recent Borrower Experiences - Fixed Alignment */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="text-base font-bold text-slate-900">Recent Borrower Experiences</h2>
      <p className="text-xs text-slate-500">Live reports from borrowers</p>
    </div>
    <Link href="/loan-apps" className="text-xs font-semibold text-blue-600 hover:underline">Write review &rarr;</Link>
  </div>
  <div className="space-y-3">
    {experiences.map((item) => (
      <article key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-block rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
              User Allegation
            </span>
            <h3 className="mt-1.5 text-xs font-bold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-xs text-slate-600 leading-snug">{item.detail}</p>
            <p className="mt-2 text-[10px] text-slate-400">{item.time} • Evidence submitted</p>
          </div>
          
          {/* Fixed Badge with shrink-0 and whitespace-nowrap */}
          <span className={`shrink-0 whitespace-nowrap pill-status pill-status-${item.tone}`}>
            {item.status}
          </span>
        </div>
      </article>
    ))}
  </div>
</section>
</div>

           <div className="border-t border-slate-800/80 bg-slate-950 p-6">
  {/* Header Title with Soft Cyan/Slate Color */}
  <h2 className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-4">
    Common Reported Issues
  </h2>

  {/* Issues Grid */}
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
    {issues.map((issue) => (
      <Link 
        key={issue.title} 
        href="/patterns" 
        className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center transition hover:border-sky-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-sky-950/30"
      >
        <p className="text-xs font-bold text-slate-100 group-hover:text-white">
          {issue.title}
        </p>
        
        {/* Count - Highlighted with Amber/Orange accent */}
        <p className="mt-2 text-xs font-extrabold text-amber-400 bg-amber-500/10 rounded-md py-1 px-1.5 border border-amber-500/20">
          {issue.count}
        </p>
      </Link>
    ))}
  </div>
</div>

            <div className="grid gap-3 border-t border-slate-800 bg-slate-900/90 p-4 text-white sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <p className="text-xs font-bold text-white">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <Suspense
            fallback={<HomeSectionFallback label="borrower support options" />}
          >
            <div className="space-y-4">
              {/* Emergency Box */}
            
              <aside className="overflow-hidden rounded-[1.75rem] border border-rose-200/80 bg-white shadow-xl">
                {/* Header Section with slightly deeper red tint */}
                <div className="bg-rose-100/90 p-6 border-b border-rose-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    EMERGENCY ACTION
                  </span>
                  <h2 className="mt-2 text-lg font-extrabold text-slate-900">
                    Are recovery agents threatening or harassing you?
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 font-medium">
                    Get immediate safety steps and legal reporting options.
                  </p>
                  <Link
                    href="/emergency-help"
                    className="mt-4 block rounded-xl bg-[#e6194b] px-4 py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-[#c0133c] active:scale-[0.98]"
                  >
                    Open Emergency Help &rarr;
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 p-2">
                  {[
                    [
                      "/complaints/start",
                      "Prepare a complaint",
                      "Structured complaint draft generator.",
                    ],
                    [
                      "/loan-apps",
                      "Understand a loan app",
                      "Check business identity & safety status.",
                    ],
                    [
                      "/complaint-tutorials",
                      "Choose where to report",
                      "RBI, Cybercrime, and police channels.",
                    ],
                  ].map(([href, title, detail]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block p-3 transition hover:bg-slate-50"
                    >
                      <span className="block text-xs font-bold text-slate-900">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {detail}
                      </span>
                    </Link>
                  ))}
                </div>
              </aside>

              {/* Before Accept Box */}
              <section className="rounded-[1.5rem] bg-[#070b14] p-5 text-white shadow-xl border border-slate-800">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-rose-500">📌</span> Before accepting a
                  digital loan
                </h2>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-100 font-medium">
                  <li className="border-l-2 border-blue-500 pl-2.5">
                    Confirm legal lender and regulated NBFC/Bank.
                  </li>
                  <li className="border-l-2 border-blue-500 pl-2.5">
                    Compare interest rates and hidden fee structures.
                  </li>
                  <li className="border-l-2 border-blue-500 pl-2.5">
                    Avoid apps requesting full contact/gallery access.
                  </li>
                  <li className="border-l-2 border-blue-500 pl-2.5">
                    Save official grievance contacts prior to borrowing.
                  </li>
                </ul>
              </section>
            </div>
          </Suspense>
        </div>
      </section>

      {/* Guide Steps */}
      <Suspense fallback={<HomeSectionFallback label="platform guide" />}>
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                FROM UNCERTAINTY TO ACTION
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Understand the lender. Recognize harassment. Take the right next
                step.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Trust Loans connects loan-app transparency with practical
                borrower protection, so you can make a safer borrowing decision
                or respond when recovery conduct crosses the line.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [
                  "1",
                  "Identify",
                  "Find the app, legal lender, associated NBFC, and official contacts.",
                ],
                [
                  "2",
                  "Understand",
                  "Review costs, permissions, complaint patterns, and recovery concerns.",
                ],
                [
                  "3",
                  "Respond",
                  "Get urgent safety guidance or prepare a complaint in plain language.",
                ],
                [
                  "4",
                  "Track",
                  "Keep case details and complaint progress together in your account.",
                ],
              ].map(([step, title, detail]) => (
                <div
                  key={step}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {step}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Suspense>

      {/* FAQ & Emergency */}
      <Suspense fallback={<HomeSectionFallback label="safety resources" />}>
        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.75fr]">
            <div className="rounded-[1.5rem] bg-[#070b14] p-6 text-white shadow-xl md:p-8 border border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                EMERGENCY HELP
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Facing threats, abusive calls, or contact-list harassment?
              </h2>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Use emergency help to preserve evidence, reduce immediate risk,
                and choose the right next step. Do not share OTPs, passwords,
                private photos, or full bank details.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/emergency-help"
                  className="rounded-xl bg-white px-5 py-3 text-center text-xs font-bold text-slate-950 hover:bg-slate-100"
                >
                  Open Emergency Help
                </Link>
                <Link
                  href="/dashboard/cases"
                  className="rounded-xl border border-slate-800 px-5 py-3 text-center text-xs font-bold text-white hover:bg-slate-900"
                >
                  Create Case Folder
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Frequently asked questions
              </h2>
              <div className="mt-4 divide-y divide-slate-100">
                {faqs.map(([question, answer]) => (
                  <details key={question} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-slate-900">
                      {question}
                      <span className="text-slate-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {answer}
                    </p>
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
            <p className="text-base font-bold text-slate-900">Trust Loans</p>
            <p className="mt-1 text-xs text-slate-500">
              Borrower safety tools for loan app reviews, case tracking,
              complaint drafting, and company transparency. Not legal advice.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600"
            aria-label="Footer navigation"
          >
            <Link href="/review-policy" className="hover:text-slate-900">
              Review Policy
            </Link>
            <Link href="/corrections" className="hover:text-slate-900">
              Corrections
            </Link>
            <Link href="/business/claim" className="hover:text-slate-900">
              Business Claim
            </Link>
            <Link href="/learn/payday-loans" className="hover:text-slate-900">
              Guides
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
