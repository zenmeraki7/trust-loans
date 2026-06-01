"use client";

import { useState } from "react";

const checklistItems = [
  "Screenshot WhatsApp/SMS messages",
  "Save call logs",
  "Save payment screenshots",
  "Save app profile/app listing",
  "Save loan agreement screenshot",
  "Note date and time",
  "Note caller's claimed app/company",
  "Save fake legal notice screenshot",
  "Save UPI/payment request screenshot",
  "Do not delete chats",
  "Do not post private phone numbers publicly",
];

export default function HarassmentEvidenceChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">One-Tap Harassment Evidence Checklist</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        {checklistItems.map((item) => (
          <label key={item} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <input type="checkbox" checked={Boolean(checked[item])} onChange={(e) => setChecked((prev) => ({ ...prev, [item]: e.target.checked }))} className="mt-0.5" />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900">
        The National Cyber Crime Reporting Portal is the official Indian portal for reporting cybercrime complaints online, and it provides complaint categories including women/child-related online sexual content complaints.
      </p>
      <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open National Cyber Crime Reporting Portal</a>
    </section>
  );
}
