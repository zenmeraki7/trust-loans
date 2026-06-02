"use client";

import { useState } from "react";
import SafeReviewWriter from "@/components/tools/SafeReviewWriter";
import { useReviewSafetyScan } from "@/hooks/useReviewSafetyScan";
import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";

const emptyScan: ReviewSafetyScanResponse = {
  score: {
    privacyRisk: 0,
    defamationRisk: 0,
    abuseRisk: 0,
    moderationReadiness: 100,
  },
  detectedRisks: [],
  suggestedTitle: "",
  suggestedBody: "",
  warnings: [],
  canSubmit: true,
};

export default function SafeReviewRewriteToolPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const scan = useReviewSafetyScan();

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Safe Review Writer</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" className="w-full rounded-lg border border-slate-300 p-2 text-sm" />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        placeholder="Paste review draft"
        className="w-full rounded-lg border border-slate-300 p-2 text-sm"
      />
      <button
        onClick={() => scan.mutate({ title, body, tags: [], reviewType: "general_review" })}
        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
      >
        Run backend scan
      </button>
      <SafeReviewWriter scan={scan.data ?? emptyScan} onApplySuggestion={setBody} />
    </main>
  );
}
