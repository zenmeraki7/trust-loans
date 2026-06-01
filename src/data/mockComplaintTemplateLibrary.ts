import type { ComplaintTemplateLibraryData } from "@/types/complaintTemplateLibrary";

export const complaintTemplateLibrary: ComplaintTemplateLibraryData = {
  categories: [
    { id: "recovery_harassment", title: "Recovery harassment complaint", description: "Use when repeated recovery pressure is reported.", bestUsedFor: "Repeated harassment calls/messages", outputTypes: ["grievance_email", "rbi_cms"], icon: "📞" },
    { id: "photo_morphing", title: "Photo morphing complaint", description: "For image misuse allegations and blackmail.", bestUsedFor: "Photo misuse or threats", outputTypes: ["cybercrime", "grievance_email"], icon: "🛡" },
    { id: "data_misuse", title: "Data misuse complaint", description: "For alleged contact/data misuse behavior.", bestUsedFor: "Contact list abuse and data concerns", outputTypes: ["cybercrime", "consumer_helpline"], icon: "🔒" },
    { id: "payment_not_updated", title: "Payment made but loan not updated", description: "For repayment reflected issues.", bestUsedFor: "Payment not updated/closure delays", outputTypes: ["grievance_email", "consumer_helpline"], icon: "💳" },
  ],
  selectedTemplate: {
    id: "recovery_harassment",
    category: "Recovery harassment complaint",
    outputType: "grievance_email",
    fields: {
      userName: "",
      userEmail: "",
      userPhone: "",
      loanAppName: "",
      companyName: "",
      claimedNbfcPartner: "",
      loanReferenceId: "",
      loanAmount: "",
      disbursalDate: "",
      repaymentDate: "",
      incidentDate: "",
      incidentTime: "",
      recoveryAgentNumber: "",
      shortSummary: "",
      detailedDescription: "",
      evidenceAvailable: [],
      desiredResolution: "",
    },
    generatedPreview: { subject: "", recipient: "", body: "" },
  },
  savedDrafts: [
    { id: "d1", templateType: "Recovery harassment", loanAppName: "SwiftCash Loan", lastEditedAt: "2026-05-31", completionPercent: 64 },
  ],
  faq: [
    { question: "Can I use these templates as legal notice?", answer: "These templates are drafting support. For legal advice or formal notice strategy, consult a qualified advocate." },
    { question: "Should I send complaint by email or portal?", answer: "You may consider using official grievance channels and relevant portals, and keep acknowledgement references." },
  ],
};
