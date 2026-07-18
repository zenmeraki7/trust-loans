import type { RiskLevel } from "@/types/loanAppProfile";

export type ClaimStatus = "unclaimed" | "claim_pending" | "claimed" | "disputed_claim";
export type VerificationStepStatus = "pending" | "in_progress" | "completed" | "rejected";

export type BusinessClaimData = {
  searchResults: Array<{
    appId: string;
    appName: string;
    logoUrl: string;
    developerName: string;
    companyName: string;
    claimedNbfcPartner: string;
    claimStatus: ClaimStatus;
    riskLevel: RiskLevel;
  }>;
  claimForm: {
    representativeName: string;
    businessEmail: string;
    phone: string;
    companyName: string;
    designation: string;
    website: string;
    appName: string;
    playStoreUrl: string;
    appStoreUrl: string;
    companyRegistrationNumber: string;
    claimedNbfcPartner: string;
    rbiRegistrationClaim: string;
    grievanceOfficer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    supportingDocuments: string[];
  };
  verificationSteps: Array<{
    key: string;
    label: string;
    status: VerificationStepStatus;
  }>;
  responseForm: {
    reviewId: string;
    responseBody: string;
    responseCategory: "clarification" | "apology" | "support_offered" | "dispute" | "general_statement";
    officialContactChannel: string;
  };
  correctionRequest: {
    fieldName: string;
    currentValue: string;
    proposedValue: string;
    explanation: string;
    supportingProof: string[];
  };
};
