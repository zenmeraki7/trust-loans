export type ReviewSafetyRisk = {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "severe";
  phrase: string;
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
};

export type ReviewSafetyScanResponse = {
  score: {
    privacyRisk: number;
    defamationRisk: number;
    abuseRisk: number;
    moderationReadiness: number;
  };
  detectedRisks: ReviewSafetyRisk[];
  suggestedTitle: string;
  suggestedBody: string;
  warnings: string[];
  canSubmit: boolean;
};
