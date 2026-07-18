export type OutputType =
  | "grievance_email"
  | "rbi_cms"
  | "cybercrime"
  | "consumer_helpline"
  | "advocate_briefing"
  | "internal_record";

export type ComplaintTemplateLibraryData = {
  categories: Array<{
    id: string;
    title: string;
    description: string;
    bestUsedFor: string;
    outputTypes: OutputType[];
    icon: string;
  }>;
  selectedTemplate: {
    id: string;
    category: string;
    outputType: OutputType;
    fields: {
      userName: string;
      userEmail: string;
      userPhone: string;
      loanAppName: string;
      companyName: string;
      claimedNbfcPartner: string;
      loanReferenceId: string;
      loanAmount: string;
      disbursalDate: string;
      repaymentDate: string;
      incidentDate: string;
      incidentTime: string;
      recoveryAgentNumber: string;
      shortSummary: string;
      detailedDescription: string;
      evidenceAvailable: string[];
      desiredResolution: string;
    };
    generatedPreview: {
      subject: string;
      recipient: string;
      body: string;
    };
  };
  savedDrafts: Array<{
    id: string;
    templateType: string;
    loanAppName: string;
    lastEditedAt: string;
    completionPercent: number;
  }>;
  faq: Array<{ question: string; answer: string }>;
};
