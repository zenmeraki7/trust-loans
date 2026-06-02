"use client";

import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";

export default function SafeReviewWriter({
  scan,
  isScanning = false,
  errorMessage = "",
  onApplySuggestion,
}: {
  scan: ReviewSafetyScanResponse | null;
  isScanning?: boolean;
  errorMessage?: string;
  onApplySuggestion: (body: string) => void;
}) {
  if (!scan) return null;

  const scoreItems = [
    ["Privacy", scan.score.privacyRisk],
    ["Defamation", scan.score.defamationRisk],
    ["Abuse", scan.score.abuseRisk],
    ["Readiness", scan.score.moderationReadiness],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Safe Review Writer</h2>
        {isScanning && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Scanning...</span>}
      </div>
      {errorMessage && <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">{errorMessage}</p>}
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {scoreItems.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
            <p className="text-xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {scan.detectedRisks.length > 0 ? (
          scan.detectedRisks.map((risk) => (
            <article key={risk.id} className="rounded-lg border border-slate-200 p-2 text-xs">
              <p className="font-semibold">{risk.type} ({risk.severity})</p>
              <p>{risk.message}</p>
              <p>Suggestion: {risk.suggestion}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
            No severe privacy risks detected. Keep the review factual and based on your own experience.
          </p>
        )}
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested safer wording</p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{scan.suggestedBody || "Start typing your review to generate a safer rewrite."}</p>
      </div>
      {scan.warnings.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-amber-800">
          {scan.warnings.map((warning) => <li key={warning}>• {warning}</li>)}
        </ul>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onApplySuggestion(scan.suggestedBody)}
          disabled={!scan.suggestedBody}
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply safer rewrite
        </button>
      </div>
      {!scan.canSubmit && <p className="mt-2 text-xs text-rose-700">Submit blocked: remove severe privacy data first.</p>}
    </section>
  );
}
