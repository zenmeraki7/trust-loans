export type CorrectionDisputeRequestData = {
  requestType: string;
  selectedPublicItem: {
    id: string;
    type: "loan_app_profile" | "company_nbfc_profile" | "review" | "company_response" | "duplicate_record";
    title: string;
    publicUrl: string;
    currentStatus: string;
  };
  correction: {
    currentDisplayedValue: string;
    proposedCorrectedValue: string;
    explanation: string;
    sourceUrl: string;
    urgency: "normal" | "privacy_concern" | "safety_concern" | "legal_concern";
    isOwnContent: boolean;
    isCompanyProfile: boolean;
    temporaryHideRequested: boolean;
  };
  privacyViolation: {
    issueTypes: string[];
    locationDescription: string;
    whoseInformation: string;
    removalReason: string;
    publicUrl: string;
  };
  reviewDispute: {
    reviewId: string;
    reviewUrl: string;
    disputeReason: string;
    explanation: string;
    requestedAction: string;
    supportingProof: string[];
  };
  duplicateRelationship: {
    existingProfileUrl: string;
    duplicateProfileUrl: string;
    relationshipIssue: string;
    explanation: string;
    suggestedAction: string;
    sourceUrl: string;
  };
  requester: {
    name: string;
    email: string;
    phone: string;
    role: "user" | "company_representative" | "nbfc_representative" | "app_developer" | "advocate" | "researcher" | "other";
    organizationName: string;
    authorizedRepresentative: boolean;
  };
  evidence: {
    files: string[];
    evidencePrivate: boolean;
  };
  confirmations: {
    goodFaith: boolean;
    accurateToKnowledge: boolean;
    reviewAndVerificationAccepted: boolean;
    disagreementDoesNotGuaranteeRemoval: boolean;
    noUnnecessarySensitiveData: boolean;
    representativeAuthorized: boolean;
  };
  status: "draft" | "submitted";
};
