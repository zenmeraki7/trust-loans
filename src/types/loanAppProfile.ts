export type ProfileStatus = "claimed" | "unclaimed" | "under_review" | "reported_by_users";
export type RiskLevel = "low" | "medium" | "high" | "severe";

export type ScoreMetric = {
  key: string;
  label: string;
  score: number;
  explanation: string;
};

export type AppProfile = {
  id: string;
  name: string;
  logoUrl: string;
  developerName: string;
  companyName: string;
  publicName: string;
  legalEntityName: string;
  businessType: string;
  website: string;
  playStoreUrl: string;
  appStoreUrl: string;
  claimedNbfcPartner: string;
  rbiRegistrationClaim: string;
  associatedRegulatedEntity: string;
  rbiRegistrationNumber: string;
  rbiRegistrationVerifiedAt: string;
  rbiRegistrationSourceUrl: string;
  interestRateRange: string;
  processingFees: string;
  latePaymentCharges: string;
  loanTenure: string;
  privacyDisclosure: string;
  contactAccessDisclosure: string;
  recoveryPracticeInfo: string;
  knownComplaintCategories: string[];
  publicWarningLabels: string[];
  regulatoryActions: Array<{
    id: string;
    authorityName: string;
    authorityJurisdiction: string;
    actionType: string;
    severity: string;
    status: string;
    title: string;
    summary: string;
    orderNumber: string;
    sourceUrl: string;
    sourceDocumentUrl: string;
    sourcePublishedAt: string;
    effectiveFrom: string;
    effectiveUntil: string;
    verifiedAt: string;
  }>;
  dataSource: string;
  lastReviewedAt: string;
  grievanceOfficer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  support: {
    email: string;
    phone: string;
  };
  status: ProfileStatus;
  riskLevel: RiskLevel;
  trustScore: number;
  reviewCount: number;
  averageRating: number;
  summaryLine: string;
  lastUpdated: string;
  scoreBreakdown: ScoreMetric[];
};

export type Review = {
  id: string;
  reviewerName: string;
  isVerifiedBorrower: boolean;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  helpfulCount: number;
};

export type CompanyResponse = {
  body: string;
  responseDate: string;
  verificationStatus: "verified_company" | "pending_verification";
};

export type SimilarApp = {
  id: string;
  name: string;
  logoUrl: string;
  trustScore: number;
  riskLevel: RiskLevel;
  reviewCount: number;
};
