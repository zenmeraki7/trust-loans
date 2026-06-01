import { complaintTemplateLibrary } from "@/data/mockComplaintTemplateLibrary";
import type { ComplaintTemplateLibraryData, OutputType } from "@/types/complaintTemplateLibrary";

type TemplateCategory = ComplaintTemplateLibraryData["categories"][number];
type TemplateFields = ComplaintTemplateLibraryData["selectedTemplate"]["fields"];

export type GeneratedComplaintDraft = {
  id: string;
  templateId: string;
  outputType: OutputType;
  subject: string;
  recipient: string;
  body: string;
  createdAt: string;
};

export type SavedTemplateDraft = {
  id: string;
  templateId: string;
  outputType: OutputType;
  loanAppName: string;
  fields: TemplateFields;
  generatedPreview: GeneratedComplaintDraft;
  lastEditedAt: string;
  completionPercent: number;
};

const nowIso = () => new Date().toISOString();

const templatesDb = new Map<string, TemplateCategory>(
  complaintTemplateLibrary.categories.map((template) => [template.id, template]),
);

const savedDraftsDb = new Map<string, SavedTemplateDraft>();

complaintTemplateLibrary.savedDrafts.forEach((draft) => {
  const template = complaintTemplateLibrary.categories[0];
  const fields = {
    ...complaintTemplateLibrary.selectedTemplate.fields,
    loanAppName: draft.loanAppName,
  };
  savedDraftsDb.set(draft.id, {
    id: draft.id,
    templateId: template.id,
    outputType: template.outputTypes[0],
    loanAppName: draft.loanAppName,
    fields,
    generatedPreview: {
      id: `gen-${draft.id}`,
      templateId: template.id,
      outputType: template.outputTypes[0],
      subject: "Complaint regarding user-reported loan app issue",
      recipient: "Official grievance channel",
      body: "Draft saved for completion. Add factual details, dates, references, and evidence descriptions before sending.",
      createdAt: draft.lastEditedAt,
    },
    lastEditedAt: draft.lastEditedAt,
    completionPercent: draft.completionPercent,
  });
});

const recipientByOutputType: Record<OutputType, string> = {
  grievance_email: "App grievance officer / support email",
  rbi_cms: "RBI CMS complaint portal",
  cybercrime: "National Cyber Crime Reporting Portal",
  consumer_helpline: "National Consumer Helpline",
  advocate_briefing: "Qualified advocate / legal counsel",
  internal_record: "Private platform record",
};

const calculateCompletion = (fields: TemplateFields) => {
  const values = Object.values(fields).flat();
  const filled = values.filter((value) => String(value).trim().length > 0).length;
  return Math.round((filled / values.length) * 100);
};

export const listTemplates = () => Array.from(templatesDb.values());

export const getTemplateById = (id: string) => templatesDb.get(id) || null;

export const generateTemplateDraft = (payload: {
  templateId: string;
  outputType?: OutputType;
  fields?: Partial<TemplateFields>;
}) => {
  const template = getTemplateById(payload.templateId);
  if (!template) return null;

  const outputType = payload.outputType ?? template.outputTypes[0];
  const fields: TemplateFields = {
    ...complaintTemplateLibrary.selectedTemplate.fields,
    ...payload.fields,
  };
  const subject = `${template.title}: ${fields.loanAppName || "loan app issue"}`;
  const incidentLine = fields.incidentDate
    ? `The incident was observed on ${fields.incidentDate}${fields.incidentTime ? ` around ${fields.incidentTime}` : ""}.`
    : "The incident date and time should be added if available.";
  const evidenceLine = fields.evidenceAvailable.length
    ? `Evidence preserved: ${fields.evidenceAvailable.join(", ")}.`
    : "Evidence details can be added if available.";

  const body = [
    `I am submitting this complaint based on my personal experience with ${fields.loanAppName || "the loan app"}.`,
    fields.companyName ? `Company/developer mentioned: ${fields.companyName}.` : "",
    fields.claimedNbfcPartner ? `Claimed NBFC/lender partner: ${fields.claimedNbfcPartner}.` : "",
    fields.loanReferenceId ? `Loan/reference ID: ${fields.loanReferenceId}.` : "",
    incidentLine,
    fields.shortSummary ? `Summary: ${fields.shortSummary}` : "",
    fields.detailedDescription ? `Details: ${fields.detailedDescription}` : "",
    evidenceLine,
    fields.desiredResolution ? `Requested resolution: ${fields.desiredResolution}` : "",
    "Please review the matter through the appropriate official channel. This draft is factual drafting support and is not legal advice.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const generated: GeneratedComplaintDraft = {
    id: `gen-${Date.now()}`,
    templateId: template.id,
    outputType,
    subject,
    recipient: recipientByOutputType[outputType],
    body,
    createdAt: nowIso(),
  };

  return generated;
};

export const saveTemplateDraft = (payload: {
  templateId: string;
  outputType?: OutputType;
  fields?: Partial<TemplateFields>;
}) => {
  const generated = generateTemplateDraft(payload);
  if (!generated) return null;

  const fields: TemplateFields = {
    ...complaintTemplateLibrary.selectedTemplate.fields,
    ...payload.fields,
  };
  const draft: SavedTemplateDraft = {
    id: `draft-${Date.now()}`,
    templateId: payload.templateId,
    outputType: generated.outputType,
    loanAppName: fields.loanAppName || "Unknown loan app",
    fields,
    generatedPreview: generated,
    lastEditedAt: nowIso(),
    completionPercent: calculateCompletion(fields),
  };
  savedDraftsDb.set(draft.id, draft);
  return draft;
};

export const listMyTemplateDrafts = () =>
  Array.from(savedDraftsDb.values()).sort(
    (a, b) => new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime(),
  );

