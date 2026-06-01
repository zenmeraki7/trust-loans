"use client";

import { useState } from "react";
import type { EmergencyHelpData } from "@/types/emergencyHelp";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import HarassmentEvidenceChecklist from "@/components/safety/HarassmentEvidenceChecklist";
import PanicPaymentWarningBanner from "@/components/safety/PanicPaymentWarningBanner";
import StopSharingMoreDataCard from "@/components/safety/StopSharingMoreDataCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";

export function MobileEmergencyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl gap-2">
        <a href="#checklist" className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white">Start Checklist</a>
        <a href="/complaint-templates" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700">Complaint Template</a>
      </div>
    </div>
  );
}

export function EmergencyHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Facing loan app threats or harassment?</h1>
      <p className="mt-1 text-sm text-slate-600">Take quick, safe steps to protect yourself, preserve evidence, and report the issue through appropriate channels.</p>
      <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">If you are in immediate physical danger or being blackmailed with private images, contact local emergency services and the national cybercrime portal.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="#checklist" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Start Emergency Checklist</a>
        <a href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open Photo Morphing Guide</a>
        <a href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Use Complaint Template</a>
        <a href="/loan-apps/app-cashnest/submit-review" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Report Experience</a>
        <a href="/tools/family-message-helper" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Tell My Family Safely</a>
      </div>
    </section>
  );
}

export function SituationSelector({ situations }: { situations: EmergencyHelpData["situations"] }) {
  const [selected, setSelected] = useState<string>(situations[0]?.id ?? "");
  const current = situations.find((s) => s.id === selected);

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Situation Selector</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {situations.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`rounded-xl border p-3 text-left text-sm ${selected === s.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      {current && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p>{current.summary}</p>
          <p className="mt-1 font-medium">First safe step: {current.recommendedFirstStep}</p>
        </div>
      )}
    </section>
  );
}

export function ImmediateActionChecklist({ items }: { items: EmergencyHelpData["immediateChecklist"] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <section id="checklist" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Immediate Action Checklist</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(checked[item.id])}
              onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              className="mt-0.5"
            />
            <span className="text-slate-700">{item.label} {item.critical ? <span className="text-rose-600">(important)</span> : null}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export function EvidenceToPreserveGrid({ items }: { items: EmergencyHelpData["evidenceItems"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Evidence to Preserve</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WhatNotToDoWarnings({ warnings }: { warnings: EmergencyHelpData["warnings"] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">What Not To Do</h2>
      <ul className="mt-3 space-y-2 text-sm text-amber-900">
        {warnings.map((w) => (
          <li key={w.id} className="rounded-lg bg-white/70 p-2">{w.text}</li>
        ))}
      </ul>
    </section>
  );
}

export function EmergencyReportingOptions({ options }: { options: EmergencyHelpData["reportingOptions"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Reporting Options</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((opt) => (
          <article key={opt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
            <p className="mt-1 text-xs text-slate-600">{opt.description}</p>
            <a href={opt.actionUrl} className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">{opt.actionLabel}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function QuickComplaintTemplates({ templates }: { templates: EmergencyHelpData["quickTemplates"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick Complaint Templates</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <article key={t.id} className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-900">{t.title}</p>
            <p className="mt-1 text-xs text-slate-600">{t.summary}</p>
            <a href={t.ctaUrl} className="mt-2 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">{t.ctaLabel}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function EmergencyDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This page provides general safety information and is not legal advice. For legal advice about your situation, consult a qualified advocate.
    </section>
  );
}

export default function EmergencyHarassmentHelpPage({ data }: { data: EmergencyHelpData }) {
  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      name: "Selected loan app",
      developerName: "",
    },
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 pb-24 md:pb-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 p-4 md:p-6">
        <EmergencyHero />
        <SituationSelector situations={data.situations} />
        <ImmediateActionChecklist items={data.immediateChecklist} />
        <EvidenceToPreserveGrid items={data.evidenceItems} />
        <WhatNotToDoWarnings warnings={data.warnings} />
        <PanicPaymentWarningBanner />
        <StopSharingMoreDataCard />
        <EmergencyReportingOptions options={data.reportingOptions} />
        <HarassmentEvidenceChecklist />
        <OfficialStoreReportCard data={storeReportData} />
        <QuickComplaintTemplates templates={data.quickTemplates} />
        <EmergencyDisclaimerBox />
      </div>
      <MobileEmergencyCTA />
    </main>
  );
}







