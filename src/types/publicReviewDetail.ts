export type PublicReviewDetailData = {
  id: string;
  title: string;
  body: string;
  rating: number;
  reviewer: {
    displayName: string;
    displayMode: "anonymous" | "first_name_only";
    verificationBadge: "verified_borrower" | "unverified_review" | "anonymous_reviewer";
  };
  linkedApp: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    developerName: string;
    companyName: string;
    claimedNbfcPartner: string;
    trustScore: number;
    averageRating: number;
    reviewCount: number;
    riskLevel: "low" | "medium" | "high" | "severe";
    profileUrl: string;
  };
  metadata: {
    publishedAt: string;
    experienceDate: string;
    reviewStatus: "published" | "partially_redacted" | "updated_after_moderation";
    helpfulCount: number;
    evidenceSubmitted: boolean;
    evidencePublic: boolean;
    redactionsApplied: boolean;
    publicModerationNote: string;
  };
  incident: {
    category: string;
    loanAmountRange: string;
    tags: string[];
  };
  companyResponse: {
    exists: boolean;
    companyName: string;
    verifiedCompany: boolean;
    responseDate: string;
    responseCategory: "clarification" | "apology" | "support_offered" | "dispute" | "general_statement";
    body: string;
    officialContactChannel: string;
  };
  relatedReviews: Array<{
    id: string;
    title: string;
    rating: number;
    excerpt: string;
    tags: string[];
    createdAt: string;
    reviewUrl: string;
  }>;
  similarComplaintPatterns: Array<{
    tag: string;
    mentionPercent: number;
  }>;
  reportReasons: Array<{
    id: string;
    label: string;
  }>;
};
