export type SafeReviewWriterData = {
  input: string;
  detectedRisks: Array<{
    type: string;
    phrase: string;
    severity: "low" | "medium" | "high";
    suggestion: string;
    explanation: string;
  }>;
  rewrittenReview: string;
  safetyScore: {
    privacyRisk: number;
    defamationRisk: number;
    abuseRisk: number;
    evidenceSafety: number;
    moderationReadiness: number;
  };
};
