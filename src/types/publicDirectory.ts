export type PublicDirectoryType = "loan_app" | "nbfc" | "bank" | "digital_lender";

export type PublicDirectoryItem = {
  id: string;
  sourceId: string;
  slug: string;
  name: string;
  type: PublicDirectoryType;
  href: string;
  subtitle: string;
  description: string;
  legalEntityName: string | null;
  associatedRegulatedEntity: string | null;
  interestRateRange: string | null;
  processingFees: string | null;
  loanTenure: string | null;
  complaintCategories: string[];
  publicWarningLabels: string[];
  appStoreAvailability: "both" | "play_store" | "app_store" | "not_listed";
  logoUrl: string | null;
  verificationStatus: string;
  riskLevel: "low" | "medium" | "high" | "severe";
  trustScore: number | null;
  reviewCount: number;
  linkedAppsCount: number;
  updatedAt: string;
};

export type PublicDirectoryResponse = {
  items: PublicDirectoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  facets: Record<PublicDirectoryType, number>;
};
