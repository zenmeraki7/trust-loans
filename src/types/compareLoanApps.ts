import type { RiskLevel } from "@/types/loanAppProfile";

export type CompareLoanApp = {
  id: string;
  name: string;
  logoUrl: string;
  developerName: string;
  companyName: string;
  claimedNbfcPartner: string;
  legalEntityName: string;
  associatedRegulatedEntity: string;
  interestRateRange: string;
  processingFees: string;
  loanTenure: string;
  regulatoryVerificationStatus: "verified" | "claimed" | "under_verification";
  appStoreAvailability: "both" | "play_store" | "app_store" | "not_listed";
  knownComplaintCategories: string[];
  publicWarningLabels: string[];
  recoveryPracticeInfo: string;
  riskLevel: RiskLevel;
  status: "claimed" | "unclaimed" | "under_review" | "company_responded";
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  profileUrl: string;
  scores: {
    harassment: number;
    hiddenCharges: number;
    dataPrivacy: number;
    recoveryBehaviour: number;
    customerSupport: number;
    transparency: number;
    grievanceResponse: number;
  };
  complaintPatterns: {
    harassmentReportsPercent: number;
    contactListAbusePercent: number;
    hiddenChargesPercent: number;
    dataMisusePercent: number;
    fakeLegalNoticePercent: number;
    photoMorphingPercent: number;
    paymentNotUpdatedPercent: number;
    loanNotClosedPercent: number;
  };
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  publicDetails: {
    nbfcPartnerAvailable: boolean;
    grievanceOfficerAvailable: boolean;
    companyResponded: boolean;
    lastUpdated: string;
  };
};
