import { ComplaintOutputType, ComplaintTemplateCategory } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

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

export async function seedComplaintTemplates() {
  for (const [key, title, category] of templates) {
    await prisma.complaintTemplate.upsert({
      where: { key },
      update: {
        title,
        category: category as ComplaintTemplateCategory,
        description: `Template for ${title.toLowerCase()} complaints.`,
        outputTypes: [
          ComplaintOutputType.GRIEVANCE_EMAIL,
          ComplaintOutputType.RBI_CMS_TEXT,
          ComplaintOutputType.CYBERCRIME_TEXT,
          ComplaintOutputType.CONSUMER_HELPLINE_TEXT,
          ComplaintOutputType.ADVOCATE_BRIEFING_NOTE,
          ComplaintOutputType.PERSONAL_RECORD,
        ],
        isActive: true,
      },
      create: {
        key,
        title,
        category: category as ComplaintTemplateCategory,
        description: `Template for ${title.toLowerCase()} complaints.`,
        outputTypes: [
          ComplaintOutputType.GRIEVANCE_EMAIL,
          ComplaintOutputType.RBI_CMS_TEXT,
          ComplaintOutputType.CYBERCRIME_TEXT,
          ComplaintOutputType.CONSUMER_HELPLINE_TEXT,
          ComplaintOutputType.ADVOCATE_BRIEFING_NOTE,
          ComplaintOutputType.PERSONAL_RECORD,
        ],
      },
    });
  }
}
