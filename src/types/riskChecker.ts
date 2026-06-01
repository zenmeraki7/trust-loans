export type AnswerValue = "yes" | "no" | "not_sure" | "not_applicable";
export type Severity = "low" | "medium" | "high" | "severe";

export type RiskCheckerData = {
  selectedApp: {
    id: string;
    name: string;
    logoUrl: string;
    developerName: string;
    companyName: string;
    claimedNbfcPartner: string;
    trustScore: number;
    averageRating: number;
    reviewCount: number;
    riskLevel: "low" | "medium" | "high" | "severe";
    topComplaintTags: string[];
    profileUrl: string;
  };
  steps: Array<{
    id: string;
    title: string;
    description: string;
    questions: Array<{
      id: string;
      label: string;
      helpText: string;
      riskWeight: 1 | 3 | 5 | 8;
      riskWhenAnswerIs: AnswerValue;
      severity: Severity;
    }>;
  }>;
  answers: Record<string, AnswerValue>;
  educationalTips: Array<{ id: string; title: string; description: string; href: string }>;
};
