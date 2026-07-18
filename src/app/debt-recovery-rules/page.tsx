import Link from "next/link";

const rules = [
  ["No intimidation or harassment", "Recovery agents must not use threats, abusive language, public humiliation, or coercion."],
  ["Respect privacy", "Do not intrude on the privacy of family members, referees, friends, or colleagues, or contact them to shame you."],
  ["No misleading pressure", "Agents must not make false or misleading representations, use anonymous calls, or impersonate an authority."],
  ["Reasonable calling hours", "Recovery calls should not be made before 8:00 a.m. or after 7:00 p.m."],
  ["The lender remains accountable", "Banks and NBFCs are responsible for the conduct of their outsourced recovery agents and must have a grievance process."],
  ["Digital lending safeguards", "For digital loans, keep the lender, app, recovery-agent identity, consent, and data-use records. Do not share OTPs or unnecessary contacts."],
];

const escalation = [
  { label: "Lender grievance officer", href: "/grievance-directory", detail: "Complain to the lender first and keep the acknowledgement." },
  { label: "RBI Ombudsman (CMS)", href: "https://cms.rbi.org.in/", detail: "Escalate an unresolved complaint against a regulated bank or NBFC." },
  { label: "RBI Sachet", href: "https://sachet.rbi.org.in/", detail: "Report suspected unauthorized deposit-taking or money-collection schemes." },
  { label: "National Cyber Crime portal", href: "https://www.cybercrime.gov.in/", detail: "Report online fraud, threats, harassment, or misuse of personal data." },
  { label: "Call 1930", href: "tel:1930", detail: "Use immediately for a cyber financial fraud." },
];

export default function DebtRecoveryRulesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Borrower safety · RBI guide</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Debt recovery must be fair, respectful, and documented.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">A plain-language summary of key RBI expectations for banks, NBFCs, and their recovery agents. These rules do not remove a borrower’s repayment obligation, but collection activity must remain lawful and dignified.</p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Key RBI expectations">
        {rules.map(([title, detail]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p></article>)}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">If a recovery call crosses the line</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
            <li><span className="font-semibold text-slate-950">1. Preserve evidence.</span> Save call logs, messages, screenshots, payment requests, and the agent’s identity.</li>
            <li><span className="font-semibold text-slate-950">2. Ask for written details.</span> Request the lender name, loan account, outstanding amount, and authorised recovery-agent details.</li>
            <li><span className="font-semibold text-slate-950">3. Complain in writing.</span> Use the lender’s grievance officer and keep the ticket number.</li>
            <li><span className="font-semibold text-slate-950">4. Escalate safely.</span> Use the official channels below. Never pay a “settlement” to a personal UPI account or share OTPs.</li>
          </ol>
          <Link href="/emergency-help" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Open emergency help</Link>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Choose an official channel</h2>
          <div className="mt-4 grid gap-2">{escalation.map((item) => { const external = item.href.startsWith("http"); return <a key={item.label} href={item.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="rounded-xl border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50"><span className="block text-sm font-semibold text-slate-900">{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></a>; })}</div>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600 sm:p-6">
        <h2 className="font-semibold text-slate-950">Official RBI reading</h2>
        <p className="mt-2">This page summarizes RBI guidance; always check the current notification and the terms of your lender.</p>
        <div className="mt-3 flex flex-wrap gap-3"><a className="font-semibold text-blue-700 underline" href="https://rbi.org.in/scripts/FS_Notification.aspx?Id=12378&Mode=0&fn=2" target="_blank" rel="noreferrer">RBI recovery-agent conduct notification</a><a className="font-semibold text-blue-700 underline" href="https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=58449" target="_blank" rel="noreferrer">RBI digital lending safeguards</a></div>
      </section>
      <Link href="/complaint-tutorials" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Watch complaint-filing tutorials</Link>
    </main>
  );
}
