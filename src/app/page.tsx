import Link from "next/link";

const primaryFlows = [
  { href: "/dashboard/cases", title: "Harassment Case Folders", desc: "Create and track private incident folders with timeline, checklist, and complaint numbers." },
  { href: "/complaint-templates", title: "Complaint Template Generator", desc: "Generate safer complaint drafts and save them privately." },
  { href: "/tools/safe-review-writer", title: "Safe Review Writer", desc: "Scan risky wording and rewrite reviews into factual language." },
  { href: "/loan-apps/swift-cash/submit-review", title: "Submit Review", desc: "Post a moderated user review with optional private evidence metadata." },
];

const quickLinks = [
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/loan-apps", label: "Loan Apps Directory" },
  { href: "/compare", label: "Compare Apps" },
  { href: "/grievance-directory", label: "Grievance Directory" },
  { href: "/emergency-help", label: "Emergency Help" },
  { href: "/legal-action-guide", label: "Legal Action Guide" },
  { href: "/notifications", label: "Notifications" },
  { href: "/patterns", label: "Pattern Library" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Trust Loans</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
            Safety-focused borrower support platform for reviews, private case tracking, evidence workflow, and complaint drafting.
          </p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            This platform helps organize information and improve reporting clarity. It is not legal advice.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Start Here</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {primaryFlows.map((flow) => (
              <Link key={flow.href} href={flow.href} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300">
                <p className="text-base font-semibold text-slate-900">{flow.title}</p>
                <p className="mt-1 text-sm text-slate-600">{flow.desc}</p>
                <span className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Open</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Navigation</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
