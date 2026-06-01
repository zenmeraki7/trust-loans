export type MissingLoanAppSubmissionData = {
  search: {
    query: string;
    possibleMatches: Array<{
      id: string;
      name: string;
      logoUrl: string;
      developerName: string;
      companyName: string;
      claimedNbfcPartner: string;
      riskLevel: "low" | "medium" | "high" | "severe";
      profileUrl: string;
    }>;
  };
  appDetails: {
    appName: string;
    logoUrl: string;
    playStoreUrl: string;
    appStoreUrl: string;
    websiteUrl: string;
    packageName: string;
    developerName: string;
    companyName: string;
    claimedNbfcPartner: string;
    supportEmail: string;
    supportPhone: string;
    grievanceOfficerEmail: string;
    registeredAddress: string;
    sourceFound: string;
  };
  userExperience: {
    hasUsedApp: boolean | null;
    tookLoan: boolean | null;
    wantsToReviewLater: boolean;
    privateModeratorNote: string;
  };
  evidence: {
    files: string[];
    evidencePrivate: boolean;
  };
  submitter: {
    displayName: string;
    email: string;
    phone: string;
    submitAnonymously: boolean;
  };
  confirmations: {
    goodFaith: boolean;
    reviewBeforePublication: boolean;
    noSensitivePersonalData: boolean;
    notLegalComplaint: boolean;
    noFalseInfo: boolean;
  };
  status: "draft" | "submitted";
};
