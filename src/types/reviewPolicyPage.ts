export type ReviewPolicyPageData = {
  principles: Array<{ id: string; title: string; description: string; icon: string }>;
  allowedContent: Array<{ id: string; title: string; description: string; examples: string[] }>;
  prohibitedContent: Array<{ id: string; title: string; description: string; severity: "low" | "medium" | "high" }>;
  saferWordingExamples: Array<{ unsafe: string; safer: string; explanation: string }>;
  moderationSteps: Array<{ step: number; title: string; description: string; statusKey: string }>;
  evidencePolicy: {
    allowedPrivateEvidence: string[];
    prohibitedEvidence: string[];
    privacyNotes: string[];
  };
  companyPolicy: {
    allowedActions: string[];
    prohibitedActions: string[];
  };
  removalReasons: string[];
  correctionDisputeOptions: string[];
  privacyCommitments: string[];
  appeals: {
    userAppeals: string[];
    companyAppeals: string[];
  };
  faq: Array<{ question: string; answer: string }>;
};
