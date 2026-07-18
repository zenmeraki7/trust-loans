import type { AppReviewContext, ReviewSubmission } from "@/types/reviewSubmission";

export const appReviewContext: AppReviewContext = {
  appId: "swift-cash",
  appName: "SwiftCash Loan",
  appLogoUrl: "https://dummyimage.com/96x96/1f2937/ffffff.png&text=SC",
  trustScore: 32,
  riskLevel: "high",
  profileUrl: "/loan-apps",
};

export const reviewSubmission: ReviewSubmission = {
  appId: "swift-cash",
  reviewType: "general_review",
  rating: {
    overall: 0,
    transparency: 0,
    customerSupport: 0,
    recoveryBehaviour: 0,
    dataPrivacy: 0,
    chargesAndFees: 0,
  },
  title: "",
  body: "",
  loanAmountRange: "",
  incidentDate: "",
  repaymentDelayed: null,
  contactedRelatives: null,
  threatened: null,
  accessedContacts: null,
  misusedPhotos: null,
  claimedNbfcRepresentation: null,
  fakeLegalNotice: null,
  abusiveLanguage: null,
  tags: [],
  evidenceFiles: [],
  privacy: {
    displayMode: "anonymous",
    displayName: "",
    email: "",
    phone: "",
    keepEvidencePrivate: true,
  },
  confirmations: {
    ownExperience: false,
    notLegalComplaint: false,
    noPrivateInfo: false,
    moderationAccepted: false,
    noFalseClaims: false,
  },
};
