import type { ReviewSafetyScanResponse } from "@/types/reviewSafety";

const severePatterns = [/\b\d{4}\s?\d{4}\s?\d{4}\b/i, /\b[A-Z]{5}[0-9]{4}[A-Z]\b/i, /\b(otp|password|pin)\b/i];

export function scanReviewTextLocally(input: { title: string; body: string }): ReviewSafetyScanResponse {
  const text = input.body || "";
  const detectedRisks = [] as ReviewSafetyScanResponse["detectedRisks"];
  for (const pattern of severePatterns) {
    const match = text.match(pattern);
    if (match && typeof match.index === "number") {
      detectedRisks.push({
        id: `local-${match.index}`,
        type: "privacy_data",
        severity: "severe",
        phrase: match[0],
        message: "Sensitive private data detected.",
        suggestion: "Remove this data from review text.",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  const privacyRisk = detectedRisks.length > 0 ? 100 : 0;
  return {
    score: { privacyRisk, defamationRisk: 0, abuseRisk: 0, moderationReadiness: privacyRisk ? 30 : 100 },
    detectedRisks,
    suggestedTitle: input.title || "Review based on my experience",
    suggestedBody: text,
    warnings: ["Review and remove private information before submitting."],
    canSubmit: detectedRisks.length === 0,
  };
}
