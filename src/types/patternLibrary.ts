export type PatternCategory =
  | "data_privacy_issue"
  | "payment_issue"
  | "harassment_issue"
  | "legal_threat_issue"
  | "recovery_issue";

export type PatternLibraryData = {
  patterns: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    warningSigns: string[];
    evidenceToPreserve: string[];
    whatNotToShare: string[];
    relatedTemplateUrl: string;
    relatedReviewsUrl: string;
    category: PatternCategory;
    tags: string[];
  }>;
  popularGuides: Array<{
    id: string;
    title: string;
    slug: string;
    readCount: number;
  }>;
};
