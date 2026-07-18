import type { MissingLoanAppSubmissionData } from "@/types/missingLoanAppSubmission";

export const missingLoanAppSubmission: MissingLoanAppSubmissionData = {
  search: {
    query: "",
    possibleMatches: [
      {
        id: "swift-cash",
        name: "SwiftCash Loan",
        logoUrl: "https://dummyimage.com/64x64/1f2937/ffffff.png&text=SC",
        developerName: "Swift Fintech Solutions",
        companyName: "Swift Fintech Solutions Pvt. Ltd.",
        claimedNbfcPartner: "Example Capital Finance Ltd.",
        riskLevel: "high",
        profileUrl: "/loan-apps",
      },
    ],
  },
  appDetails: {
    appName: "",
    logoUrl: "",
    playStoreUrl: "",
    appStoreUrl: "",
    websiteUrl: "",
    packageName: "",
    developerName: "",
    companyName: "",
    claimedNbfcPartner: "",
    supportEmail: "",
    supportPhone: "",
    grievanceOfficerEmail: "",
    registeredAddress: "",
    sourceFound: "",
  },
  userExperience: {
    hasUsedApp: null,
    tookLoan: null,
    wantsToReviewLater: false,
    privateModeratorNote: "",
  },
  evidence: {
    files: [],
    evidencePrivate: true,
  },
  submitter: {
    displayName: "",
    email: "",
    phone: "",
    submitAnonymously: true,
  },
  confirmations: {
    goodFaith: false,
    reviewBeforePublication: false,
    noSensitivePersonalData: false,
    notLegalComplaint: false,
    noFalseInfo: false,
  },
  status: "draft",
};
