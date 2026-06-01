"use client";

import { useMemo, useState } from "react";
import type { FamilyMessageHelperData } from "@/types/familyMessageHelper";

export default function FamilyMessageHelperPage({ data }: { data: FamilyMessageHelperData }) {
  const [contactName, setContactName] = useState(data.defaults.contactName);
  const [appName, setAppName] = useState(data.defaults.appName);
  const [senderName, setSenderName] = useState(data.defaults.senderName);
  const [includeOfficial, setIncludeOfficial] = useState(data.defaults.includeOfficialChannelsLine);
  const [customNote, setCustomNote] = useState("");

  const message = useMemo(() => {
    const greeting = contactName.trim() ? `Hi ${contactName.trim()}, ` : "Hi, ";
    const appLine = `someone claiming to represent ${appName.trim() || "a loan app"} may contact you.`;
    const base = "Please do not share any information, OTP, documents, or payment. If they call, note the number, time, and what they say. Please send me screenshots/call logs only.";
    const official = includeOfficial ? " I am handling this through official complaint channels." : "";
    const note = customNote.trim() ? ` ${customNote.trim()}` : "";
    const sign = senderName.trim() ? ` - ${senderName.trim()}` : "";
    return `${greeting}${appLine} ${base}${official}${note}${sign}`;
  }, [appName, contactName, customNote, includeOfficial, senderName]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1000px] space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Tell My Family Safely</h1>
          <p className="mt-1 text-sm text-slate-600">Generate a calm message for relatives so they can avoid panic, protect privacy, and share only useful evidence.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Message setup</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contact name" />
            <input value={appName} onChange={(e) => setAppName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="App name" />
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Your name (optional)" />
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeOfficial} onChange={(e) => setIncludeOfficial(e.target.checked)} />
              Include official complaint channels line
            </label>
            <textarea value={customNote} onChange={(e) => setCustomNote(e.target.value)} rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Optional extra factual note" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Generated message</h2>
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-900">{message}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                } catch {
                  // no-op
                }
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Copy message
            </button>
            <a href="/tools/what-to-do-now" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open What Should I Do Now</a>
            <a href="/emergency-help" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open Emergency Help</a>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-amber-900">Quick caution points</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {data.cautionPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
