import Link from "next/link";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";
import HarassmentEvidenceChecklist from "@/components/safety/HarassmentEvidenceChecklist";
import PanicPaymentWarningBanner from "@/components/safety/PanicPaymentWarningBanner";
import StopSharingMoreDataCard from "@/components/safety/StopSharingMoreDataCard";

type TemplateItem = { title: string; description: string };
type FaqItem = { q: string; a: string };

export function LegalGuideHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Know what to do if a loan app threatens or harasses you</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
        Step-by-step guidance to preserve evidence, report harassment, and protect yourself safely.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Start Safety Checklist</button>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Report Your Experience
        </Link>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Browse Loan Apps
        </Link>
      </div>
    </section>
  );
}

export function EmergencySafetyNotice() {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
      <p>
        If you are in immediate danger, facing physical threats, or being blackmailed with private images, contact local emergency services and
        the national cybercrime portal immediately.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800">Cybercrime portal</button>
        <button className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800">Local police station</button>
        <button className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800">Trusted family/friend</button>
        <button className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800">Legal counsel</button>
      </div>
    </section>
  );
}

export function IncidentTypeSelector({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Select incident type</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <button key={item} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

export function EvidenceChecklist({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Evidence preservation checklist</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((item) => (
          <label key={item} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4" />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Only collect evidence legally and safely. Recording laws and privacy rules may vary. Consult an advocate where needed.
      </p>
    </section>
  );
}

export function ReportingOptionsGrid({ options }: { options: { title: string; points: string[] }[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Reporting options</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => (
          <article key={option.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">{option.title}</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              {option.points.map((p) => (
                <p key={p}>â€¢ {p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ActionTimeline({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Step-by-step action flow</h2>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            Step {index + 1}: {step}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ComplaintTemplateCards({ templates }: { templates: TemplateItem[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Complaint templates</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article key={template.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">{template.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{template.description}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Use Template</button>
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Copy Template</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WhatNotToDoSection({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h2 className="mb-3 text-xl font-semibold text-amber-900">What not to do</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-amber-200 bg-white p-3 text-sm text-amber-900">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LegalGuideFAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <details key={item.q} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">{item.q}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function LegalDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
      This page provides general information for user safety and awareness. It is not legal advice and does not create an advocate-client
      relationship. For legal advice about your specific situation, consult a qualified advocate.
    </section>
  );
}

export default function LegalActionGuidePage({
  incidentTypes,
  checklistItems,
  reportingOptions,
  timelineSteps,
  templates,
  whatNotToDo,
  faqItems,
}: {
  incidentTypes: string[];
  checklistItems: string[];
  reportingOptions: { title: string; points: string[] }[];
  timelineSteps: string[];
  templates: TemplateItem[];
  whatNotToDo: string[];
  faqItems: FaqItem[];
}) {
  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      name: "Selected loan app",
      developerName: "",
    },
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <LegalGuideHero />
        <EmergencySafetyNotice />
        <PanicPaymentWarningBanner />
        <StopSharingMoreDataCard />
        <IncidentTypeSelector items={incidentTypes} />
        <EvidenceChecklist items={checklistItems} />
        <HarassmentEvidenceChecklist />
        <ReportingOptionsGrid options={reportingOptions} />
        <OfficialStoreReportCard data={storeReportData} />
        <ActionTimeline steps={timelineSteps} />
        <ComplaintTemplateCards templates={templates} />
        <WhatNotToDoSection items={whatNotToDo} />
        <LegalGuideFAQ items={faqItems} />
        <LegalDisclaimerBox />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <Link href="/loan-apps/swift-cash/submit-review" className="block w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">
          Report Experience
        </Link>
      </div>
    </main>
  );
}






