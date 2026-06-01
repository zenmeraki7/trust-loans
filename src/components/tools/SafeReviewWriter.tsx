"use client";

import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";

export default function SafeReviewWriter({
  scan,
  onApplySuggestion,
}: {
  scan: ReviewSafetyScanResponse | null;
  onApplySuggestion: (body: string) => void;
}) {
  if (!scan) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Safe Review Writer</h2>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
        <p>Privacy: {scan.score.privacyRisk}</p>
        <p>Defamation: {scan.score.defamationRisk}</p>
        <p>Abuse: {scan.score.abuseRisk}</p>
        <p>Readiness: {scan.score.moderationReadiness}</p>
      </div>
      <div className="mt-3 space-y-2">
        {scan.detectedRisks.map((risk) => (
          <article key={risk.id} className="rounded-lg border border-slate-200 p-2 text-xs">
            <p className="font-semibold">{risk.type} ({risk.severity})</p>
            <p>{risk.message}</p>
            <p>Suggestion: {risk.suggestion}</p>
          </article>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onApplySuggestion(scan.suggestedBody)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Apply safer rewrite</button>
      </div>
      {!scan.canSubmit && <p className="mt-2 text-xs text-rose-700">Submit blocked: remove severe privacy data first.</p>}
    </section>
  );
}
