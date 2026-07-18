import type { RiskLevel } from "@/types/loanAppProfile";

export type VerificationStatus = "claimed" | "unclaimed" | "under_review" | "company_responded";
export type NbfcClaimStatus = "available" | "missing" | "under_verification";
export type PlatformType = "android" | "ios" | "website";

export type LoanAppDirectoryItem = {
  id: string;
  name: string;
  logoUrl: string;
  developerName: string;
  companyName: string;
  claimedNbfcPartner: string;
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  riskLevel: RiskLevel;
  status: VerificationStatus;
  topComplaintTags: string[];
  summary: string;
  platform: PlatformType[];
  lastUpdated: string;
  complaintCounts: {
    harassment: number;
    hiddenCharges: number;
    dataPrivacy: number;
  };
  grievanceDetailsAvailable: boolean;
};

export type DirectoryStats = {
  totalAppsListed: number;
  totalUserReviews: number;
  appsUnderReview: number;
  highRiskPatternsDetected: number;
  reviewsSubmittedThisMonth: number;
};
