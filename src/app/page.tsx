import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Trust Loans</h1>
        <p className="mt-2 text-slate-600">Consumer review and risk-awareness pages for digital lending apps.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/loan-apps" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Browse Loan Apps
          </Link>
          <Link href="/compare" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Compare Loan Apps
          </Link>
          <Link href="/legal-action-guide" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Legal Action Guide
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            My Dashboard
          </Link>
          <Link href="/business/claim" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Business Claim Portal
          </Link>
          <Link
            href="/loan-apps/swift-cash/submit-review"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Submit a Review
          </Link>
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Safety Pages (26-37)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/notifications" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">26. Notification Center</Link>
            <Link href="/emergency-help" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">27. Emergency Help</Link>
            <Link href="/grievance-directory" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">28. Grievance Directory</Link>
            <Link href="/patterns" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">29. Pattern Library</Link>
            <Link href="/patterns/contact-list-abuse" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">30. Pattern Detail</Link>
            <Link href="/how-scores-work" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">31. Score Explainer</Link>
            <Link href="/before-you-pay" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">32. Before You Pay</Link>
            <Link href="/risk-map" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">33. Live Risk Map</Link>
            <Link href="/app-permissions" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">34. App Permissions</Link>
            <Link href="/reports/monthly-risk-report" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">35. Monthly Risk Report</Link>
            <Link href="/transparency-leaderboard" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">36. Transparency Leaderboard</Link>
            <Link href="/tools/safe-review-writer" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">37. Make My Review Safe</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
