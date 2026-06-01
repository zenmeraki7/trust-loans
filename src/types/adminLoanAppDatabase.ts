import type { RiskLevel } from "@/types/loanAppProfile";

export type ProfileStatus = "draft" | "published" | "under_review" | "hidden" | "archived";
export type VerificationStatus =
  | "unverified"
  | "partially_verified"
  | "verified"
  | "conflicting_information"
  | "needs_manual_review";
export type ClaimStatus = "unclaimed" | "claim_pending" | "claimed" | "disputed_claim";

export type AdminLoanAppDatabase = {
  stats: {
    totalApps: number;
    underReview: number;
    verifiedPublicDetails: number;
    claimedProfiles: number;
    duplicateCandidates: number;
    missingGrievanceDetails: number;
    missingCompanyDetails: number;
    highRiskComplaintPatterns: number;
  };
  filters: {
    query: string;
    status: string;
    verificationStatus: string;
    claimStatus: string;
    riskLevel: string;
    missingData: string[];
  };
  apps: Array<{
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    packageName: string;
    platform: string[];
    developerName: string;
    companyName: string;
    claimedNbfcPartner: string;
    trustScore: number;
    riskLevel: RiskLevel;
    reviewCount: number;
    verificationStatus: VerificationStatus;
    claimStatus: ClaimStatus;
    profileStatus: ProfileStatus;
    lastUpdated: string;
  }>;
  selectedApp: {
    id: string;
    basicIdentity: {
      name: string;
      slug: string;
      logoUrl: string;
      packageName: string;
      platform: string[];
      shortDescription: string;
      profileStatus: ProfileStatus;
    };
    companyDetails: {
      developerName: string;
      legalCompanyName: string;
      registrationNumber: string;
      website: string;
      supportEmail: string;
      supportPhone: string;
      registeredAddress: string;
      sourceUrl: string;
      verificationStatus: VerificationStatus;
    };
    appStoreLinks: {
      playStoreUrl: string;
      appStoreUrl: string;
      websiteAppUrl: string;
      lastCheckedAt: string;
      storeAvailabilityStatus: "active" | "removed" | "not_found" | "region_restricted" | "unknown";
    };
    nbfcPartner: {
      name: string;
      website: string;
      rbiRegistrationClaim: string;
      relationshipType: "claimed_by_app" | "claimed_by_company" | "user_submitted" | "publicly_verified" | "disputed" | "unknown";
      verificationStatus: VerificationStatus;
      sourceUrl: string;
      lastVerifiedAt: string;
    };
    grievanceOfficer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      sourceUrl: string;
      verifiedAt: string;
      publicVisible: boolean;
    };
    aliases: string[];
    duplicateCandidates: string[];
    verificationSources: Array<{
      sourceType: string;
      sourceUrl: string;
      sourceDate: string;
      verifiedBy: string;
      confidence: "low" | "medium" | "high";
      notes: string;
    }>;
    riskMetadata: {
      riskLevel: RiskLevel;
      trustScore: number;
      complaintVolume: number;
      reviewCount: number;
      topComplaintTags: string[];
      harassmentPercent: number;
      hiddenChargesPercent: number;
      dataPrivacyPercent: number;
      recoveryAbusePercent: number;
      companyResponseStatus: "none" | "responded";
      manualRiskNote: string;
    };
    auditLog: Array<{
      adminUser: string;
      action: string;
      fieldChanged: string;
      previousValue: string;
      newValue: string;
      timestamp: string;
      reason: string;
    }>;
  };
};
