import { ComplaintOutputType, ComplaintTemplateCategory } from "@prisma/client";
import { z } from "zod";
import { plainTextSchema } from "../../security/publicContent.js";

const text = (max = 500) => plainTextSchema({ max });

const commonFieldsSchema = z.object({
  userName: plainTextSchema({ min: 1, max: 160 }).optional(),
  userEmail: z.string().email().optional(),
  userPhone: text(40).optional(),
  loanAppName: plainTextSchema({ min: 1, max: 200 }),
  companyName: text(200).optional(),
  claimedNbfcPartner: text(200).optional(),
  loanReferenceId: text(160).optional(),
  loanAmount: text(100).optional(),
  disbursalDate: text(80).optional(),
  repaymentDate: text(80).optional(),
  incidentDate: text(80).optional(),
  incidentTime: text(80).optional(),
  recoveryAgentNumber: text(160).optional(),
  shortSummary: plainTextSchema({ min: 1, max: 500 }),
  detailedDescription: plainTextSchema({ min: 1, max: 4000 }),
  evidenceAvailable: text(500).optional(),
  desiredResolution: plainTextSchema({ min: 1, max: 1000 }),
}).strict();

export const listComplaintTemplatesSchema = z.object({
  query: z.object({
    category: z.nativeEnum(ComplaintTemplateCategory).optional(),
    activeOnly: z.coerce.boolean().default(true),
  }).strict(),
});

export const complaintTemplateKeyParamSchema = z.object({
  params: z.object({ key: z.string().trim().min(1) }).strict(),
});

export const generateComplaintTemplateSchema = z.object({
  body: z.object({
    templateKey: z.string().trim().min(1),
    outputType: z.nativeEnum(ComplaintOutputType),
    formData: commonFieldsSchema,
  }).strict(),
});

export const createComplaintTemplateSchema = z.object({
  body: z.object({
    key: z.string().trim().min(1),
    title: plainTextSchema({ min: 2, max: 200 }),
    category: z.nativeEnum(ComplaintTemplateCategory),
    description: plainTextSchema({ min: 2, max: 2000 }),
    outputTypes: z.array(z.nativeEnum(ComplaintOutputType)).min(1),
    isActive: z.boolean().default(true),
  }).strict(),
});

export const updateComplaintTemplateSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }).strict(),
  body: z.object({
    title: plainTextSchema({ min: 2, max: 200 }).optional(),
    category: z.nativeEnum(ComplaintTemplateCategory).optional(),
    description: plainTextSchema({ min: 2, max: 2000 }).optional(),
    outputTypes: z.array(z.nativeEnum(ComplaintOutputType)).min(1).optional(),
    isActive: z.boolean().optional(),
  }).strict(),
});

export const templateIdParamSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }).strict(),
});

export const createComplaintDraftSchema = z.object({
  body: z.object({
    templateId: z.string().trim().optional(),
    loanAppId: z.string().trim().optional(),
    title: plainTextSchema({ min: 2, max: 200 }),
    templateKey: z.string().trim().min(1),
    outputType: z.nativeEnum(ComplaintOutputType),
    formData: commonFieldsSchema,
    generatedSubject: text(500).optional(),
    generatedBody: plainTextSchema({ min: 20, max: 20000 }),
  }).strict(),
});

export const updateComplaintDraftSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }).strict(),
  body: z.object({
    title: plainTextSchema({ min: 2, max: 200 }).optional(),
    formData: commonFieldsSchema.optional(),
    generatedSubject: text(500).optional(),
    generatedBody: plainTextSchema({ min: 20, max: 20000 }).optional(),
    outputType: z.nativeEnum(ComplaintOutputType).optional(),
  }).strict(),
});

export const complaintDraftIdParamSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }).strict(),
});

export type GenerateComplaintTemplateInput = z.infer<typeof generateComplaintTemplateSchema>["body"];
export type CreateComplaintTemplateInput = z.infer<typeof createComplaintTemplateSchema>["body"];
export type UpdateComplaintTemplateInput = z.infer<typeof updateComplaintTemplateSchema>["body"];
export type CreateComplaintDraftInput = z.infer<typeof createComplaintDraftSchema>["body"];
export type UpdateComplaintDraftInput = z.infer<typeof updateComplaintDraftSchema>["body"];
