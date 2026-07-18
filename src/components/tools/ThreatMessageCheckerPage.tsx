"use client";

import { useMemo, useState } from "react";
import type { ThreatMessageCheckerData } from "@/types/threatMessageChecker";

function scoreTone(count: number) {
  if (count >= 4) return "bg-rose-100 text-rose-700";
  if (count >= 2) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function ThreatMessageCheckerPage({ data }: { data: ThreatMessageCheckerData }) {
  const [message, setMessage] = useState("");

  const detections = useMemo(() => {
    const text = message.toLowerCase();
    return data.categories
      .map((category) => {
        const matched = category.keywords.filter((keyword) => text.includes(keyword));
        return { ...category, matched };
      })
      .filter((item) => item.matched.length > 0);
  }, [data.categories, message]);

  const hasPhotoOrBlackmail = detections.some((d) => d.id === "photo_morphing_threat") || message.toLowerCase().includes("blackmail");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Threat Message Checker</h1>
          <p className="mt-1 text-sm text-slate-600">Paste a suspicious message and get risk categories plus safe next actions.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Paste message</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={data.inputPlaceholder}
            rows={8}
            className="mt-3 w-full rounded-xl border border-slate-300 p-3 text-sm"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Classification result</h2>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${scoreTone(detections.length)}`}>{detections.length} signal(s)</span>
          </div>

          {detections.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No clear risk keywords detected yet. You can still preserve evidence and avoid sharing private information.</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {detections.map((d) => (
                <article key={d.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{d.label}</p>
                  <p className="mt-1 text-xs text-slate-600">Matched terms: {d.matched.join(", ")}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recommended output actions</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {data.defaultActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Use complaint template</a>
            <a href="/tools/safe-review-writer" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Submit review safely</a>
            {hasPhotoOrBlackmail ? (
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white">Report to cybercrime now</a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
