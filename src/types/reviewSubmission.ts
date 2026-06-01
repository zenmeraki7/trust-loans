export type ReviewType =
  | "general_review"
  | "harassment_recovery"
  | "hidden_charges"
  | "data_privacy"
  | "photo_morphing_threat"
  | "fake_legal_notice_impersonation"
  | "payment_issue"
  | "app_not_closing_loan"
  | "positive_experience";

export type DisplayMode = "first_name_only" | "anonymous" | "verified_badge_only";

export type ReviewSubmission = {
  appId: string;
  reviewType: ReviewType;
  rating: {
    overall: number;
    transparency: number;
    customerSupport: number;
    recoveryBehaviour: number;
    dataPrivacy: number;
    chargesAndFees: number;
  };
  title: string;
  body: string;
  loanAmountRange: string;
  incidentDate: string;
  repaymentDelayed: boolean | null;
  contactedRelatives: boolean | null;
  threatened: boolean | null;
  accessedContacts: boolean | null;
  misusedPhotos: boolean | null;
  claimedNbfcRepresentation: boolean | null;
  fakeLegalNotice: boolean | null;
  abusiveLanguage: boolean | null;
  tags: string[];
  evidenceFiles: string[];
  privacy: {
    displayMode: DisplayMode;
    displayName: string;
    email: string;
    phone: string;
    keepEvidencePrivate: boolean;
  };
  confirmations: {
    ownExperience: boolean;
    notLegalComplaint: boolean;
    noPrivateInfo: boolean;
    moderationAccepted: boolean;
    noFalseClaims: boolean;
  };
};

export type AppReviewContext = {
  appId: string;
  appName: string;
  appLogoUrl: string;
  trustScore: number;
  riskLevel: "low" | "medium" | "high" | "severe";
  profileUrl: string;
};
