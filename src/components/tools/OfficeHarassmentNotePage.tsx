"use client";

import { useMemo, useState } from "react";
import type { OfficeHarassmentNoteData } from "@/types/officeHarassmentNote";

export default function OfficeHarassmentNotePage({ data }: { data: OfficeHarassmentNoteData }) {
  const [recipient, setRecipient] = useState(data.defaults.recipient);
  const [appName, setAppName] = useState(data.defaults.appName);
  const [senderName, setSenderName] = useState(data.defaults.senderName);
  const [teamName, setTeamName] = useState(data.defaults.teamName);
  const [extraLine, setExtraLine] = useState("");

  const note = useMemo(() => {
    const intro = recipient.trim() ? `Dear ${recipient.trim()},` : "Dear Team,";
    const app = appName.trim() || "a loan app";
    const body = `I am dealing with harassment from callers claiming to represent ${app}. If anyone contacts the office about me, please do not share my personal information. Kindly note the caller number, time, and message, and forward it to me for recordkeeping.`;
    const extra = extraLine.trim() ? ` ${extraLine.trim()}` : "";
    const signBlock = [senderName.trim(), teamName.trim()].filter(Boolean).join(" | ");
    return `${intro}\n\n${body}${extra}\n\nThank you.${signBlock ? `\n${signBlock}` : ""}`;
  }, [recipient, appName, senderName, teamName, extraLine]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1000px] space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Office / HR Protection Note</h1>
          <p className="mt-1 text-sm text-slate-600">Draft a professional office note to protect your employment reputation without oversharing sensitive details.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Note builder</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Recipient (e.g., HR Team)" />
            <input value={appName} onChange={(e) => setAppName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="App name" />
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Your name" />
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Department/Team (optional)" />
            <textarea value={extraLine} onChange={(e) => setExtraLine(e.target.value)} rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Optional extra factual line" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Generated professional note</h2>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{note}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(note);
                } catch {
                  // no-op
                }
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Copy note
            </button>
            <a href="/tools/what-to-do-now" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Back to What Should I Do Now</a>
            <a href="/tools/family-message-helper" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open Family Message Helper</a>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-amber-900">Quick reminders</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {data.quickReminders.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
