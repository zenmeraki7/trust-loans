import type { Metadata } from "next";
import Link from "next/link";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Loans",
  description: "Public review and risk-awareness platform for loan apps",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap">
            <Link href="/" className="rounded-full border border-slate-300 bg-slate-900 px-3 py-1 font-semibold text-white">Home</Link>
            <Link href="/dashboard/cases" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Cases</Link>
            <Link href="/complaint-templates" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Complaint Templates</Link>
            <Link href="/notifications" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Notifications</Link>
            <Link href="/emergency-help" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Emergency Help</Link>
            <Link href="/grievance-directory" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Grievance Directory</Link>
            <Link href="/patterns" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Pattern Library</Link>
            <Link href="/before-you-pay" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Before You Pay</Link>
            <Link href="/learn/payday-loans" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Payday Loans</Link>
            <Link href="/risk-map" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Risk Map</Link>
            <Link href="/reports/monthly-risk-report" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Monthly Report</Link>
            <Link href="/transparency-leaderboard" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Leaderboard</Link>
            <Link href="/tools/safe-review-writer" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50">Safe Review Writer</Link>
          </div>
        </header>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
