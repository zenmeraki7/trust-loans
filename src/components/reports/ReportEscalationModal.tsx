"use client";

const reportLinks = [
  { label: "RBI Ombudsman (CMS)", detail: "For complaints about RBI-regulated banks and NBFCs", href: "https://cms.rbi.org.in/" },
  { label: "RBI Sachet portal", detail: "For suspected unauthorized deposit-taking or money-collection schemes", href: "https://sachet.rbi.org.in/" },
  { label: "National Cyber Crime portal", detail: "For online harassment, fraud, threats, or data misuse", href: "https://www.cybercrime.gov.in/" },
  { label: "Cyber financial fraud: 1930", detail: "Call immediately for a cyber financial fraud", href: "tel:1930" },
  { label: "NBFC grievance officer", detail: "Find the published grievance contact directory", href: "/grievance-directory" },
  { label: "Emergency cyber help", detail: "Open immediate safety and evidence guidance", href: "/emergency-help" },
  { label: "RBI debt-recovery rules", detail: "Read your rights before responding to a collection call", href: "/debt-recovery-rules" },
  { label: "Complaint filing tutorials", detail: "Watch inline guides for RBI, cybercrime, and fraud channels", href: "/complaint-tutorials" },
  { label: "Prepare a complaint", detail: "Identify the right portal and generate a factual draft", href: "/complaint-wizard" },
];

export default function ReportEscalationModal({ entityName, entityType, onClose }: { entityName: string; entityType: "app" | "nbfc"; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4" role="presentation" onClick={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4"><div><h2 id="report-dialog-title" className="text-xl font-bold text-slate-950">Report {entityType === "app" ? "this app" : "this NBFC"}</h2><p className="mt-1 text-sm text-slate-600">Choose an official channel for <span className="font-semibold">{entityName}</span>.</p></div><button type="button" aria-label="Close report options" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-xl text-slate-600 hover:bg-slate-50">×</button></div>
      <div className="mt-5 grid gap-2">{reportLinks.map((link) => { const external = link.href.startsWith("http"); return <a key={link.label} href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50"><span className="block text-sm font-semibold text-slate-900">{link.label}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{link.detail}</span></a>; })}</div>
      <p className="mt-4 text-[11px] leading-5 text-slate-500">Use the channel that matches your issue. Keep acknowledgement numbers and avoid sharing OTPs, passwords, or unnecessary private documents.</p>
    </section>
  </div>;
}
