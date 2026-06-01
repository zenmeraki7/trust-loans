"use client";

import { useState } from "react";
import type { BeforeYouPayData } from "@/types/beforeYouPay";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";

export function BeforePayHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Before you pay a loan app</h1>
      <p className="mt-1 text-sm text-slate-600">Use this checklist before making repayment, especially if you are receiving pressure calls or payment threats.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="#repayment-checklist" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Start Checklist</a>
        <a href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Payment Not Updated Template</a>
        <a href="/legal-action-guide" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Legal Action Guide</a>
      </div>
    </section>
  );
}

export function RepaymentVerificationChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <section id="repayment-checklist" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Repayment Verification Checklist</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <input type="checkbox" checked={Boolean(checked[item])} onChange={(e) => setChecked((prev) => ({ ...prev, [item]: e.target.checked }))} className="mt-0.5" />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}

export function UnsafePaymentWarnings({ warnings }: { warnings: string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">Unsafe Payment Warning Signs</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {warnings.map((warning) => (
          <article key={warning} className="rounded-xl border border-amber-300 bg-white p-3 text-sm text-amber-900">{warning}</article>
        ))}
      </div>
    </section>
  );
}

export function AfterPaymentChecklist({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">After Payment Checklist</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function PaymentNotUpdatedActionFlow({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">If Payment Is Not Updated</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="text-xs font-semibold text-slate-500">Step {index + 1}</p>
            <p className="mt-1">{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DownloadChecklistActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Downloadable Checklist</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Copy checklist</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Download PDF placeholder</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Save to dashboard</button>
      </div>
    </section>
  );
}

export function BeforePayDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This checklist is for awareness and does not guarantee repayment confirmation or dispute resolution.
    </section>
  );
}

export default function BeforeYouPayChecklistPage({ data }: { data: BeforeYouPayData }) {
  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      name: "Selected loan app",
      developerName: "",
    },
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1200px] space-y-4">
        <BeforePayHero />
        <RepaymentVerificationChecklist items={data.repaymentChecklist} />
        <UnsafePaymentWarnings warnings={data.warningSigns} />
        <AfterPaymentChecklist items={data.afterPaymentChecklist} />
        <PaymentNotUpdatedActionFlow steps={data.actionFlow} />
        <OfficialStoreReportCard data={storeReportData} />
        <DownloadChecklistActions />
        <BeforePayDisclaimerBox />
      </div>
    </main>
  );
}
