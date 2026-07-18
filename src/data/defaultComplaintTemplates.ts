import type { ComplaintOutputType, ComplaintTemplate } from "@/types/complaintTemplates";

const outputTypes: ComplaintOutputType[] = [
  "GRIEVANCE_EMAIL",
  "RBI_CMS_TEXT",
  "CYBERCRIME_TEXT",
  "CONSUMER_HELPLINE_TEXT",
  "ADVOCATE_BRIEFING_NOTE",
  "PERSONAL_RECORD",
];

const templates = [
  ["recovery_harassment", "Recovery Harassment", "HARASSMENT"],
  ["threat_calls", "Threat Calls", "HARASSMENT"],
  ["relatives_contacted", "Relatives Contacted", "HARASSMENT"],
  ["office_harassment", "Office Harassment", "HARASSMENT"],
  ["photo_morphing_threat", "Photo Morphing Threat", "PHOTO_MORPHING"],
  ["data_misuse", "Data Misuse", "DATA_MISUSE"],
  ["fake_legal_notice", "Fake Legal Notice", "FAKE_LEGAL_NOTICE"],
  ["hidden_charges", "Hidden Charges", "HIDDEN_CHARGES"],
  ["payment_made_not_updated", "Payment Made Not Updated", "PAYMENT_NOT_UPDATED"],
  ["loan_closed_still_active", "Loan Closed Still Active", "LOAN_NOT_CLOSED"],
  ["grievance_officer_escalation", "Grievance Officer Escalation", "GRIEVANCE_ESCALATION"],
  ["rbi_cms_complaint", "RBI CMS Complaint", "RBI_CMS"],
  ["cybercrime_complaint", "Cybercrime Complaint", "CYBERCRIME"],
  ["consumer_helpline_complaint", "Consumer Helpline Complaint", "CONSUMER_HELPLINE"],
  ["advocate_briefing_note", "Advocate Briefing Note", "ADVOCATE_BRIEFING"],
] as const;

export const defaultComplaintTemplates: ComplaintTemplate[] = templates.map(([key, title, category]) => ({
  id: key,
  key,
  title,
  category,
  description: `Template for ${title.toLowerCase()} complaints.`,
  outputTypes,
  isActive: true,
}));
