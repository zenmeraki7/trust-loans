import { ComplaintDraftStatus, ComplaintOutputType, ComplaintTemplateCategory } from "@prisma/client";
import { z } from "zod";

const commonFieldsSchema = z.object({
  userName: z.string().trim().min(1).optional(),
  userEmail: z.string().email().optional(),
  userPhone: z.string().trim().optional(),
  loanAppName: z.string().trim().min(1),
  companyName: z.string().trim().optional(),
  claimedNbfcPartner: z.string().trim().optional(),
  loanReferenceId: z.string().trim().optional(),
  loanAmount: z.string().trim().optional(),
  disbursalDate: z.string().trim().optional(),
  repaymentDate: z.string().trim().optional(),
  incidentDate: z.string().trim().optional(),
  incidentTime: z.string().trim().optional(),
  recoveryAgentNumber: z.string().trim().optional(),
  shortSummary: z.string().trim().min(1).max(500),
  detailedDescription: z.string().trim().min(1).max(4000),
  evidenceAvailable: z.string().trim().optional(),
  desiredResolution: z.string().trim().min(1).max(1000),
});

export const listComplaintTemplatesSchema = z.object({
  query: z.object({
    category: z.nativeEnum(ComplaintTemplateCategory).optional(),
    activeOnly: z.coerce.boolean().default(true),
  }),
});

export const complaintTemplateKeyParamSchema = z.object({
  params: z.object({ key: z.string().trim().min(1) }),
});

export const generateComplaintTemplateSchema = z.object({
  body: z.object({
    templateKey: z.string().trim().min(1),
    outputType: z.nativeEnum(ComplaintOutputType),
    formData: commonFieldsSchema,
  }),
});

export const createComplaintTemplateSchema = z.object({
  body: z.object({
    key: z.string().trim().min(1),
    title: z.string().trim().min(2),
    category: z.nativeEnum(ComplaintTemplateCategory),
    description: z.string().trim().min(2),
    outputTypes: z.array(z.nativeEnum(ComplaintOutputType)).min(1),
    isActive: z.boolean().default(true),
  }),
});

export const updateComplaintTemplateSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }),
  body: z.object({
    title: z.string().trim().min(2).optional(),
    category: z.nativeEnum(ComplaintTemplateCategory).optional(),
    description: z.string().trim().min(2).optional(),
    outputTypes: z.array(z.nativeEnum(ComplaintOutputType)).min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const templateIdParamSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }),
});

export const createComplaintDraftSchema = z.object({
  body: z.object({
    templateId: z.string().trim().optional(),
    loanAppId: z.string().trim().optional(),
    title: z.string().trim().min(2),
    templateKey: z.string().trim().min(1),
    outputType: z.nativeEnum(ComplaintOutputType),
    status: z.nativeEnum(ComplaintDraftStatus).optional(),
    formData: commonFieldsSchema,
    generatedSubject: z.string().trim().optional(),
    generatedBody: z.string().trim().min(20),
  }),
});

export const updateComplaintDraftSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }),
  body: z.object({
    title: z.string().trim().min(2).optional(),
    status: z.nativeEnum(ComplaintDraftStatus).optional(),
    formData: commonFieldsSchema.optional(),
    generatedSubject: z.string().trim().optional(),
    generatedBody: z.string().trim().min(20).optional(),
    outputType: z.nativeEnum(ComplaintOutputType).optional(),
  }),
});

export const complaintDraftIdParamSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }),
});

export type GenerateComplaintTemplateInput = z.infer<typeof generateComplaintTemplateSchema>["body"];
export type CreateComplaintTemplateInput = z.infer<typeof createComplaintTemplateSchema>["body"];
export type UpdateComplaintTemplateInput = z.infer<typeof updateComplaintTemplateSchema>["body"];
export type CreateComplaintDraftInput = z.infer<typeof createComplaintDraftSchema>["body"];
export type UpdateComplaintDraftInput = z.infer<typeof updateComplaintDraftSchema>["body"];
