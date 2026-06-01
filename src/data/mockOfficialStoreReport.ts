import type { OfficialStoreReportData } from "@/types/officialStoreReport";

export const officialStoreReport: OfficialStoreReportData = {
  app: {
    id: "",
    name: "",
    developerName: "",
    playStoreUrl: "",
    appStoreUrl: "",
    packageName: "",
    appStoreId: "",
  },
  reportReasons: [
    { id: "suspicious_activity", label: "Suspicious app activity" },
    { id: "data_misuse", label: "Data misuse concern" },
    { id: "harassment", label: "Harassment after loan" },
    { id: "misleading_terms", label: "Misleading loan terms" },
    { id: "impersonation", label: "Impersonation concern" },
    { id: "hidden_charges", label: "Hidden charges" },
    { id: "payment_not_updated", label: "Payment not updated" },
    { id: "fake_legal_threat", label: "Fake legal threat" },
    { id: "photo_morphing", label: "Photo morphing threat" },
    { id: "app_unavailable_after_payment", label: "App unavailable after payment" },
    { id: "other", label: "Other" },
  ],
  summaryBuilder: {
    issueType: "",
    incidentDate: "",
    factualSummary: "",
    evidencePreserved: [],
  },
  officialLinks: {
    googlePlayHelp: "https://support.google.com/googleplay/answer/2853570",
    appleReportProblem: "https://reportaproblem.apple.com",
  },
};
