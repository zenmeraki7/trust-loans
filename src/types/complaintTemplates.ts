export type ComplaintOutputType =
  | "GRIEVANCE_EMAIL"
  | "RBI_CMS_TEXT"
  | "CYBERCRIME_TEXT"
  | "CONSUMER_HELPLINE_TEXT"
  | "ADVOCATE_BRIEFING_NOTE"
  | "PERSONAL_RECORD";

export type ComplaintTemplate = {
  id: string;
  key: string;
  title: string;
  category: string;
  description: string;
  outputTypes: ComplaintOutputType[];
  isActive: boolean;
};

export type ComplaintFormData = {
  loanAppName: string;
  shortSummary: string;
  detailedDescription: string;
  desiredResolution: string;
  companyName?: string;
  claimedNbfcPartner?: string;
  loanReferenceId?: string;
  loanAmount?: string;
  incidentDate?: string;
  incidentTime?: string;
  evidenceAvailable?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
};

export type GeneratedComplaint = {
  generatedSubject: string;
  generatedBody: string;
  warnings: string[];
  sanitizedFormData: ComplaintFormData;
};

export type ComplaintDraft = {
  id: string;
  title: string;
  templateKey: string;
  outputType: ComplaintOutputType;
  status: "DRAFT" | "COMPLETED" | "ARCHIVED" | "DELETED";
  formData: ComplaintFormData;
  generatedSubject?: string | null;
  generatedBody: string;
  loanAppId?: string | null;
  updatedAt: string;
};
