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
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap">
            <Link href="/" className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700">Home</Link>
            <Link href="/notifications" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Notifications</Link>
            <Link href="/emergency-help" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Emergency Help</Link>
            <Link href="/grievance-directory" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Grievance Directory</Link>
            <Link href="/patterns" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Pattern Library</Link>
            <Link href="/patterns/contact-list-abuse" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Pattern Detail</Link>
            <Link href="/how-scores-work" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Score Explainer</Link>
            <Link href="/before-you-pay" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Before You Pay</Link>
            <Link href="/risk-map" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Live Risk Map</Link>
            <Link href="/app-permissions" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">App Permissions</Link>
            <Link href="/reports/monthly-risk-report" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Monthly Report</Link>
            <Link href="/transparency-leaderboard" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Transparency Leaderboard</Link>
            <Link href="/tools/safe-review-writer" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700">Safe Review Writer</Link>
          </div>
        </header>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
