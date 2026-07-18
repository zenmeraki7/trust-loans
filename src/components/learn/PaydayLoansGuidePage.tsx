"use client";

import Link from "next/link";

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3l7 3v6c0 4.8-3.2 7.8-7 9-3.8-1.2-7-4.2-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="2.5" y="6" width="19" height="13" rx="2.5" />
      <path d="M16 11h5.5v3H16a1.5 1.5 0 110-3z" />
      <circle cx="17.5" cy="12.5" r=".6" fill="currentColor" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4m8-4v4" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3l9 16H3L12 3z" />
      <path d="M12 9v4m0 3h.01" />
    </svg>
  );
}

function IconMoney() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function TopNav() {
  const items = ["Home", "Learn", "Loan Types", "Safety Guides", "Compare", "Help"];
  return (
    <header className="bg-[var(--brand-navy)] text-[var(--brand-white)]">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-3 md:px-6">
        <div>
          <p className="text-2xl font-bold leading-none">BorrowerSafe</p>
          <p className="text-xs text-blue-100">Your guide to safer borrowing</p>
        </div>
        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          {items.map((item) => (
            <span key={item} className="text-blue-100">
              {item}
            </span>
          ))}
          <button className="rounded-xl bg-[var(--brand-blue)] px-4 py-2 font-semibold text-[var(--brand-white)]">Check My Options</button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="rounded-2xl border border-[var(--brand-border)] bg-gradient-to-r from-[var(--brand-surface-soft)] to-[var(--brand-surface-soft-2)] p-4 md:p-8">
      <p className="text-sm text-blue-700">Learn &gt; Loan Types &gt; Payday Loans</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold leading-[1.05] text-[var(--brand-navy-strong)] md:text-[76px]">Understanding Payday Loans</h1>
          <p className="mt-5 max-w-xl text-lg leading-[1.5] text-slate-700 md:text-[20px]">
            Payday loans are short-term, small-value loans due on your next payday. They can help in emergencies, but can become expensive
            if rolled over.
          </p>
          <div className="mt-4 flex gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2"><IconShield />Neutral. Clear. Trusted.</span>
            <span className="flex items-center gap-2"><IconCalendar />Information for financial well-being.</span>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-3xl font-bold text-[var(--brand-navy-strong)]">PAYDAY LOAN</p>
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <IconWallet />
            <p className="mt-3 text-[15px] leading-6 text-slate-600">Quick cash today can become high repayment pressure next payday.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionOne() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-heading-alt)]">1. What is a payday loan?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
        <li>Short-term loan due near your next salary date.</li>
        <li>Usually used for immediate needs and urgent bills.</li>
        <li>Fast approval with limited documentation.</li>
        <li>High fees and interest can make repayment costly.</li>
      </ul>
    </section>
  );
}

function PaydayAppsDirectoryCta() {
  return (
    <section data-testid="payday-app-directory-cta" className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
      <div className="grid items-center gap-5 p-5 md:grid-cols-[1fr_auto] md:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <IconWallet />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Payday app directory</p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--brand-navy-strong)]">Browse Payday Loan Apps</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Explore 33 payday loan app profiles and the available claimed NBFC details before borrowing.</p>
          </div>
        </div>
        <Link href="/payday-loan-apps" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
          View Payday Loan Apps
        </Link>
      </div>
    </section>
  );
}

function SectionTwo() {
  const steps = [
    { t: "Apply", d: "Submit a simple application.", i: <IconShield /> },
    { t: "Receive funds", d: "If approved, money arrives quickly.", i: <IconWallet /> },
    { t: "Repay on payday", d: "Full amount plus fees due.", i: <IconCalendar /> },
    { t: "Rollover risk", d: "Missed payment can add more charges.", i: <IconAlert /> },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-heading-alt)]">2. How it works</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map((s, idx) => (
          <article key={s.t} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{idx + 1}</p>
            <div className="mt-2 flex justify-center">{s.i}</div>
            <h3 className="mt-2 font-semibold text-slate-900">{s.t}</h3>
            <p className="text-sm text-slate-600">{s.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionThreeAndFour() {
  const features = [
    { t: "Quick approval", d: "Decisions often in minutes.", i: <IconShield /> },
    { t: "Small loan amount", d: "Typically lower amount limits.", i: <IconMoney /> },
    { t: "Short repayment", d: "Usually due in 7 to 30 days.", i: <IconCalendar /> },
    { t: "High fees", d: "Can be expensive versus other loans.", i: <IconAlert /> },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-heading-alt)]">3. Common features</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {features.map((f) => (
            <article key={f.t} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>{f.i}</div>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">{f.t}</h3>
              <p className="text-xs text-slate-600">{f.d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-heading-alt)]">4. Example cost breakdown</h2>
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <div className="flex justify-between border-b py-2 text-sm"><span>Borrowed amount</span><span className="font-semibold text-blue-700">Rs 10,000</span></div>
          <div className="flex justify-between border-b py-2 text-sm"><span>Fees (15%)</span><span className="font-semibold text-emerald-700">Rs 1,500</span></div>
          <div className="flex justify-between py-2 text-sm"><span>Total repayment</span><span className="text-lg font-bold text-[var(--brand-heading-alt)]">Rs 11,500</span></div>
        </div>
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          The total cost equals 15% of the borrowed amount for 30 days.
        </div>
      </section>
    </div>
  );
}

function SectionFiveAndSix() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-heading-alt)]">5. Why borrowers use them</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {["Emergency bills", "Salary gaps", "Medical needs", "Urgent expenses"].map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-900">{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
        <h2 className="text-[38px] font-bold leading-tight text-[var(--brand-warning)]">6. Key warning note</h2>
        <p className="mt-3 text-slate-800">
          Payday loans can be expensive if not repaid on time. Repeated rollovers can create debt cycles that are hard to escape.
        </p>
        <p className="mt-3 font-semibold text-slate-900">Borrow responsibly. Plan ahead.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/compare" className="rounded-xl bg-[var(--brand-navy-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-white)]">Compare Options</Link>
          <Link href="/before-you-pay" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Checklist</Link>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-6 bg-[var(--brand-navy)] text-[var(--brand-white)]">
      <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-8 md:grid-cols-5 md:px-6">
        <div>
          <p className="text-2xl font-bold">BorrowerSafe</p>
          <p className="mt-2 text-sm text-blue-100">We provide clear, neutral information to help people borrow more safely.</p>
        </div>
        <div><p className="font-semibold">Explore</p><p className="mt-2 text-sm text-blue-100">Learn</p><p className="text-sm text-blue-100">Loan Types</p></div>
        <div><p className="font-semibold">Resources</p><p className="mt-2 text-sm text-blue-100">Budget Calculator</p><p className="text-sm text-blue-100">Know Your Rights</p></div>
        <div><p className="font-semibold">Help</p><p className="mt-2 text-sm text-blue-100">FAQs</p><p className="text-sm text-blue-100">Contact Us</p></div>
        <div><p className="font-semibold">Important</p><p className="mt-2 text-sm text-blue-100">Privacy Policy</p><p className="text-sm text-blue-100">Terms of Use</p></div>
      </div>
      <div className="border-t border-blue-900 py-3 text-center text-xs text-blue-100">© 2024 BorrowerSafe. All rights reserved.</div>
    </footer>
  );
}

export default function PaydayLoansGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--brand-bg)]">
      <TopNav />
      <div className="mx-auto max-w-[1240px] space-y-4 px-4 py-4 md:px-6 md:py-6">
        <Hero />
        <PaydayAppsDirectoryCta />
        <div className="grid gap-4 md:grid-cols-2">
          <SectionOne />
          <SectionTwo />
        </div>
        <SectionThreeAndFour />
        <SectionFiveAndSix />
      </div>
      <Footer />
    </main>
  );
}
