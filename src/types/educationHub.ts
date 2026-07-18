export type EducationHubData = {
  safetyCards: Array<{ id: string; title: string; description: string; warningSigns: string[]; ctaLabel: string; href: string }>;
  beforeBorrowChecklist: Array<{ id: string; label: string; description: string; priority: "low" | "medium" | "high" }>;
  predatoryPatterns: Array<{ id: string; title: string; description: string; warningLevel: "low" | "medium" | "high" }>;
  dataPermissions: Array<{ permission: string; whyRequested: string; riskExplanation: string; userTip: string }>;
  mythFacts: Array<{ myth: string; fact: string }>;
  userStories: Array<{ id: string; title: string; scenario: string; lesson: string; category: string }>;
  resources: Array<{ id: string; title: string; category: string; readingTime: string; summary: string; href: string }>;
  riskCheckerQuestions: Array<{ id: string; question: string; riskWeight: number }>;
};
