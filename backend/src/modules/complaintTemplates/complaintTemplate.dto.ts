import type { ComplaintDraft, ComplaintTemplate } from "@prisma/client";

export const toComplaintTemplateDto = (template: ComplaintTemplate) => ({
  id: template.id,
  key: template.key,
  title: template.title,
  category: template.category,
  description: template.description,
  outputTypes: template.outputTypes,
  isActive: template.isActive,
  createdAt: template.createdAt,
  updatedAt: template.updatedAt,
});

export const toComplaintDraftDto = (draft: ComplaintDraft) => ({
  id: draft.id,
  userId: draft.userId,
  templateId: draft.templateId,
  loanAppId: draft.loanAppId,
  title: draft.title,
  templateKey: draft.templateKey,
  outputType: draft.outputType,
  status: draft.status,
  formData: draft.formData,
  generatedSubject: draft.generatedSubject,
  generatedBody: draft.generatedBody,
  createdAt: draft.createdAt,
  updatedAt: draft.updatedAt,
});
