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
  website: string;
  playStoreUrl: string;
  appStoreUrl: string;
  claimedNbfcPartner: string;
  rbiRegistrationClaim: string;
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
