import type { Metadata } from "next";
import Link from "next/link";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Loans",
  description: "Public review and risk-awareness platform for loan apps",
};

const navGroups = [
  {
    title: "Borrower",
    links: [
      { href: "/dashboard", label: "My Dashboard" },
      { href: "/dashboard/cases", label: "Case Folders" },
      { href: "/loan-apps", label: "Loan Apps" },
      { href: "/compare", label: "Compare Apps" },
      { href: "/suggest-app", label: "Suggest App" },
      { href: "/notifications", label: "Notifications" },
    ],
  },
  {
    title: "Safety",
    links: [
      { href: "/risk-checker", label: "Risk Checker" },
      { href: "/app-permissions", label: "App Permissions" },
      { href: "/before-you-pay", label: "Before You Pay" },
      { href: "/emergency-help", label: "Emergency Help" },
      { href: "/legal-action-guide", label: "Legal Action Guide" },
      { href: "/review-policy", label: "Review Policy" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/safe-review-writer", label: "Safe Review Writer" },
      { href: "/tools/threat-message-checker", label: "Threat Message Checker" },
      { href: "/tools/family-message-helper", label: "Family Message Helper" },
      { href: "/tools/office-harassment-note", label: "Office Harassment Note" },
      { href: "/tools/repayment-channel-checker", label: "Repayment Channel Checker" },
      { href: "/tools/what-to-do-now", label: "What To Do Now" },
    ],
  },
  {
    title: "Directories",
    links: [
      { href: "/entities", label: "Companies / NBFCs" },
      { href: "/grievance-directory", label: "Grievance Directory" },
      { href: "/complaint-templates", label: "Complaint Templates" },
      { href: "/patterns", label: "Pattern Library" },
      { href: "/risk-map", label: "Risk Map" },
      { href: "/corrections", label: "Corrections" },
    ],
  },
  {
    title: "Insights",
    links: [
      { href: "/learn", label: "Learn" },
      { href: "/learn/payday-loans", label: "Payday Loans" },
      { href: "/reports/monthly-risk-report", label: "Monthly Report" },
      { href: "/transparency-leaderboard", label: "Leaderboard" },
      { href: "/business/claim", label: "Business Claim" },
    ],
  },
  {
    title: "Admin",
    links: [
      { href: "/admin/apps", label: "Apps Admin" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/moderation", label: "Moderation" },
      { href: "/admin/evidence", label: "Evidence" },
      { href: "/admin/corrections", label: "Corrections Queue" },
      { href: "/admin/review-integrity", label: "Review Integrity" },
      { href: "/admin/risk-intelligence", label: "Risk Intelligence" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

const chipClass = "rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300 hover:bg-slate-50";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap">
            <Link href="/" className="rounded-full border border-slate-300 bg-slate-900 px-3 py-1 font-semibold text-white">Home</Link>
            <Link href="/loan-apps" className={chipClass}>Loan Apps</Link>
            <Link href="/entities" className={chipClass}>NBFCs</Link>
            <Link href="/dashboard/cases" className={chipClass}>Cases</Link>
            <Link href="/complaint-templates" className={chipClass}>Templates</Link>
            <Link href="/tools/safe-review-writer" className={chipClass}>Safe Writer</Link>
            <Link href="/admin/apps" className={chipClass}>Admin</Link>
            <details className="group relative">
              <summary className="cursor-pointer list-none rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-semibold text-slate-800 marker:hidden">
                All Pages
              </summary>
              <div className="fixed left-3 right-3 top-12 z-50 grid max-h-[75vh] gap-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-xl md:left-auto md:right-4 md:w-[760px] md:grid-cols-2 lg:grid-cols-3">
                {navGroups.map((group) => (
                  <section key={group.title} className="space-y-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</h2>
                    <div className="grid gap-1">
                      {group.links.map((link) => (
                        <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </details>
          </div>
        </header>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
