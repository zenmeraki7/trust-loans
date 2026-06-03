import type { RiskCheckerData } from "@/types/riskChecker";

export const riskCheckerData: RiskCheckerData = {
  selectedApp: {
    id: "swift-cash",
    name: "SwiftCash Loan",
    logoUrl: "https://dummyimage.com/64x64/1f2937/ffffff.png&text=SC",
    developerName: "Swift Fintech Solutions",
    companyName: "Swift Fintech Solutions Pvt. Ltd.",
    claimedNbfcPartner: "Example Capital Finance Ltd.",
    trustScore: 32,
    averageRating: 1.8,
    reviewCount: 1284,
    riskLevel: "high",
    topComplaintTags: ["Threat calls", "Hidden charges", "Contact list abuse"],
    profileUrl: "/loan-apps",
  },
  steps: [
    {
      id: "app_identity",
      title: "App Identity",
      description: "Check whether the app and company details are clear.",
      questions: [
        { id: "q_app_name", label: "Is the app name clearly shown?", helpText: "", riskWeight: 1, riskWhenAnswerIs: "no", severity: "low" },
        { id: "q_company_visible", label: "Is the developer/company name visible?", helpText: "", riskWeight: 3, riskWhenAnswerIs: "no", severity: "medium" },
      ],
    },
    {
      id: "transparency",
      title: "Lender / NBFC Transparency",
      description: "Check lender and grievance transparency.",
      questions: [
        { id: "q_lender_clear", label: "Is the actual lender name clearly mentioned?", helpText: "", riskWeight: 5, riskWhenAnswerIs: "no", severity: "high" },
        { id: "q_grievance", label: "Is grievance officer information available?", helpText: "", riskWeight: 5, riskWhenAnswerIs: "no", severity: "high" },
      ],
    },
    {
      id: "charges",
      title: "Charges and Repayment",
      description: "Check fees and repayment clarity.",
      questions: [
        { id: "q_fees_clear", label: "Are processing fees clearly shown before accepting?", helpText: "", riskWeight: 3, riskWhenAnswerIs: "no", severity: "medium" },
        { id: "q_short_window", label: "Is there a very short repayment window?", helpText: "", riskWeight: 5, riskWhenAnswerIs: "yes", severity: "high" },
      ],
    },
    {
      id: "privacy",
      title: "Permissions and Privacy",
      description: "Check risky permissions and document requests.",
      questions: [
        { id: "q_contacts", label: "Does the app ask for contact access?", helpText: "", riskWeight: 8, riskWhenAnswerIs: "yes", severity: "severe" },
        { id: "q_docs_whatsapp", label: "Does it request Aadhaar/PAN through unofficial channels?", helpText: "", riskWeight: 8, riskWhenAnswerIs: "yes", severity: "severe" },
      ],
    },
    {
      id: "review_signals",
      title: "User Review Signals",
      description: "Check user-reported patterns.",
      questions: [
        { id: "q_harassment_reports", label: "Are users reporting harassment?", helpText: "", riskWeight: 5, riskWhenAnswerIs: "yes", severity: "high" },
        { id: "q_hidden_charges_reports", label: "Are users reporting hidden charges?", helpText: "", riskWeight: 3, riskWhenAnswerIs: "yes", severity: "medium" },
      ],
    },
    {
      id: "payment_recovery",
      title: "Payment and Recovery Warning Signs",
      description: "Check high-priority warning signals.",
      questions: [
        { id: "q_personal_upi", label: "Are you being asked to pay to a personal UPI ID?", helpText: "", riskWeight: 8, riskWhenAnswerIs: "yes", severity: "severe" },
        { id: "q_relatives_contacted", label: "Are relatives/employer being contacted?", helpText: "", riskWeight: 8, riskWhenAnswerIs: "yes", severity: "severe" },
      ],
    },
  ],
  answers: {},
  educationalTips: [
    { id: "t1", title: "What is a claimed NBFC partner?", description: "It is a claimed lending relationship that users should verify independently.", href: "/learn" },
    { id: "t2", title: "Why recent reviews matter", description: "Recent patterns may indicate emerging concerns or improved behavior.", href: "/loan-apps" },
  ],
};
