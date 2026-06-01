import type { RiskLevel } from "@/types/loanAppProfile";

export type EntityProfileData = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  entityType: "company" | "app_developer" | "claimed_nbfc_partner" | "lending_service_provider" | "unknown";
  verificationStatus: "verified_public_details" | "partially_verified" | "under_verification" | "conflicting_information" | "user_submitted";
  riskSignalLevel: RiskLevel;
  averageLinkedAppTrustScore: number;
  totalLinkedApps: number;
  totalReviewsAcrossApps: number;
  details: {
    legalName: string;
    website: string;
    supportEmail: string;
    supportPhone: string;
    registeredAddress: string;
    registrationNumber: string;
    rbiRegistrationClaim: string;
    sourceUrls: string[];
    lastVerifiedAt: string;
    verificationConfidence: "low" | "medium" | "high";
  };
  grievance: {
    officerName: string;
    email: string;
    phone: string;
    address: string;
    sourceUrl: string;
    lastVerifiedAt: string;
  };
  linkedApps: Array<{
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    developerName: string;
    companyName: string;
    relationshipType: "developer" | "company_owner" | "claimed_nbfc_partner" | "support_provider" | "website_domain_match" | "user_submitted_link" | "under_verification";
    relationshipVerificationStatus: "verified" | "partially_verified" | "claimed" | "disputed" | "under_verification" | "not_enough_information";
    trustScore: number;
    averageRating: number;
    reviewCount: number;
    riskLevel: RiskLevel;
    topComplaintTags: string[];
    profileUrl: string;
  }>;
  relationshipEvidence: Array<{
    appId: string;
    appName: string;
    relationshipType: string;
    verificationStatus: "verified" | "partially_verified" | "claimed" | "disputed" | "under_verification" | "not_enough_information";
    sourceType: string;
    sourceUrl: string;
    lastCheckedAt: string;
    confidence: "low" | "medium" | "high";
    notes: string;
  }>;
  complaintPatterns: {
    totalReviews: number;
    harassmentPercent: number;
    hiddenChargesPercent: number;
    contactListAbusePercent: number;
    dataMisusePercent: number;
    fakeLegalNoticePercent: number;
    paymentNotUpdatedPercent: number;
    loanNotClosedPercent: number;
    positiveReviewPercent: number;
  };
  riskDistribution: { low: number; medium: number; high: number; severe: number; underReview: number };
  officialResponses: Array<{
    id: string;
    responseBody: string;
    responseDate: string;
    verificationStatus: "verified" | "under_verification";
    contactChannel: string;
    addressedApps: string[];
  }>;
  relatedEntities: Array<{
    id: string;
    name: string;
    entityType: string;
    relationReason: string;
    verificationStatus: "under_verification" | "verified_public_details" | "partially_verified";
    profileUrl: string;
  }>;
  mentionedReviews: Array<{
    id: string;
    appId: string;
    appName: string;
    reviewerDisplayName: string;
    rating: number;
    title: string;
    excerpt: string;
    tags: string[];
    createdAt: string;
    verificationBadge: "verified_borrower" | "unverified_review";
    reviewUrl: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
};
