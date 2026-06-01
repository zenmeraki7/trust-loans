export type VerificationStatus =
  | "verified_public_details"
  | "partially_verified"
  | "under_verification"
  | "user_submitted"
  | "conflicting_information";

export type GrievanceDirectoryData = {
  search: { query: string };
  filters: {
    verificationStatus: VerificationStatus[];
    claimedNbfcPartner: string;
    missingDetailsOnly: boolean;
  };
  contacts: Array<{
    id: string;
    appName: string;
    logoUrl: string;
    companyName: string;
    developerName: string;
    claimedNbfcPartner: string;
    grievanceEmail: string;
    supportEmail: string;
    supportPhone: string;
    officialWebsite: string;
    verificationStatus: VerificationStatus;
    lastVerifiedAt: string;
    profileUrl: string;
  }>;
};
