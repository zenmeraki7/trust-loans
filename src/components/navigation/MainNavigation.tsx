"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { getOptionalAuthSession } from "@/lib/authSession";

type NavLink = {
  href: string;
  label: string;
};

type NavGroup = {
  title: string;
  links: NavLink[];
};

const primaryLinks: NavLink[] = [
  { href: "/directory", label: "Directory" },
  { href: "/loan-apps", label: "Loan Apps" },
  { href: "/entities", label: "NBFCs" },
  { href: "/dashboard/cases", label: "Cases" },
  { href: "/complaints/start", label: "Start Complaint" },
  { href: "/complaint-templates", label: "Templates" },
  { href: "/tools/safe-review-writer", label: "Safe Writer" },
];

const navGroups: NavGroup[] = [
  {
    title: "Borrower",
    links: [
      { href: "/dashboard", label: "My Dashboard" },
      { href: "/dashboard/complaints", label: "Complaint Tracking" },
      { href: "/dashboard/cases", label: "Case Folders" },
      { href: "/dashboard/evidence", label: "Evidence Checklist" },
      { href: "/evidence-upload", label: "Prepare Evidence List" },
      { href: "/loan-apps", label: "Loan Apps" },
      { href: "/compare", label: "Compare Apps" },
      { href: "/suggest-app", label: "Suggest App" },
      { href: "/notifications", label: "Notifications" },
      { href: "/account/security", label: "Account Security" },
    ],
  },
  {
    title: "Safety",
    links: [
      { href: "/risk-checker", label: "Risk Checker" },
      { href: "/safety-assessment", label: "Safety Assessment Explained" },
      { href: "/app-permissions", label: "App Permissions" },
      { href: "/before-you-pay", label: "Before You Pay" },
      { href: "/emergency-help", label: "Emergency Help" },
      { href: "/legal-action-guide", label: "Legal Action Guide" },
      { href: "/debt-recovery-rules", label: "Debt Recovery Rules" },
      { href: "/complaint-tutorials", label: "Complaint Tutorials" },
      { href: "/complaints/start", label: "Start Complaint" },
      { href: "/complaint-wizard", label: "Complaint Wizard" },
      { href: "/complaints/review", label: "Complaint Review" },
      { href: "/complaints/export", label: "Draft & Export" },
      { href: "/safety-library", label: "Safety Education Library" },
      { href: "/privacy-safety", label: "Privacy & Safety Notices" },
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
      { href: "/directory", label: "Public Directory" },
      { href: "/search", label: "Search & Filters" },
      { href: "/loan-apps", label: "Loan Apps" },
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
      { href: "/account-recovery", label: "Account Recovery" },
    ],
  },
  {
    title: "Admin",
    links: [
      { href: "/admin/apps", label: "Apps Admin" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/moderation", label: "Moderation" },
      { href: "/admin/corrections", label: "Corrections Queue" },
      { href: "/admin/review-integrity", label: "Review Integrity" },
      { href: "/admin/risk-intelligence", label: "Risk Intelligence" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

function DesktopNavLink({ href, label, active }: NavLink & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, active, onClick }: NavLink & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {label}
    </Link>
  );
}

export default function MainNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutPending, setLogoutPending] = useState<"current" | "all" | null>(null);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    setMobileOpen(false);
    setDirectoryOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    getOptionalAuthSession()
      .then((session) => { if (active) setIsAuthenticated(session !== null); })
      .catch((error) => {
        if (active) console.error("Unable to check authentication status.", error);
      });
    return () => { active = false; };
  }, [pathname]);

  async function logout(scope: "current" | "all" = "current") {
    if (logoutPending) return;
    setLogoutPending(scope);
    setLogoutError("");
    try {
      await apiClient(scope === "all" ? "/api/auth/logout-all" : "/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setMobileOpen(false);
      window.location.assign("/");
    } catch {
      setLogoutError("Secure logout could not be completed. Please check your connection and try again.");
      setLogoutPending(null);
    }
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" onClick={() => setDirectoryOpen(false)} className="group flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              TL
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-slate-950 sm:text-base">Trust Loans</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">Borrower safety platform</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <DesktopNavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} />
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? <>
              <button type="button" onClick={() => void logout("current")} disabled={logoutPending !== null} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60">
                {logoutPending === "current" ? "Logging out..." : "Log out"}
              </button>
              <button type="button" aria-label="Log out all devices" onClick={() => void logout("all")} disabled={logoutPending !== null} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
                {logoutPending === "all" ? "Logging out..." : "Log out all"}
              </button>
            </> : <>
              <Link href="/login" className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">Log in</Link>
              <Link href="/signup" className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Sign up</Link>
            </>}
            <Link
              href="/admin/apps"
              aria-current={isActivePath(pathname, "/admin") ? "page" : undefined}
              onClick={() => setDirectoryOpen(false)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActivePath(pathname, "/admin") ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              Admin
            </Link>
            <button
              type="button"
              aria-expanded={directoryOpen}
              aria-controls="desktop-route-menu"
              onClick={() => setDirectoryOpen((open) => !open)}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              All Pages
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 md:hidden"
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <span className="relative h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform duration-200 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-5 rounded bg-current transition-transform duration-200 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {logoutError ? <p role="alert" className="pb-3 text-sm font-medium text-rose-700">{logoutError}</p> : null}

        <div
          id="desktop-route-menu"
          className={`hidden overflow-hidden transition-all duration-300 ease-out md:block ${
            directoryOpen ? "max-h-[70vh] pb-5 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {directoryOpen ? <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 md:grid-cols-2 lg:grid-cols-3">
            {navGroups.map((group) => (
              <section key={group.title} className="space-y-2">
                <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</h2>
                <div className="grid gap-1">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} aria-current={isActivePath(pathname, link.href) ? "page" : undefined} onClick={() => setDirectoryOpen(false)} className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActivePath(pathname, link.href) ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div> : null}
        </div>

        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            mobileOpen ? "max-h-[85vh] pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {mobileOpen ? <div className="space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
            <div className="grid gap-1">
              {[{ href: "/", label: "Home" }, ...primaryLinks, ...(isAuthenticated ? [] : [{ href: "/login", label: "Log in" }, { href: "/signup", label: "Sign up" }]), { href: "/admin/apps", label: "Admin" }].map((link) => (
                <MobileNavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} onClick={() => setMobileOpen(false)} />
              ))}
              {isAuthenticated ? <>
                <button type="button" onClick={() => void logout("current")} disabled={logoutPending !== null} className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60">
                  {logoutPending === "current" ? "Logging out..." : "Log out this device"}
                </button>
                <button type="button" onClick={() => void logout("all")} disabled={logoutPending !== null} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-wait disabled:opacity-60">
                  {logoutPending === "all" ? "Logging out..." : "Log out all devices"}
                </button>
              </> : null}
            </div>
            {navGroups.map((group) => (
              <section key={group.title} className="space-y-2 border-t border-slate-100 pt-3">
                <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</h2>
                <div className="grid gap-1">
                  {group.links.map((link) => (
                    <MobileNavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} onClick={() => setMobileOpen(false)} />
                  ))}
                </div>
              </section>
            ))}
          </div> : null}
        </div>
      </nav>
    </header>
  );
}
