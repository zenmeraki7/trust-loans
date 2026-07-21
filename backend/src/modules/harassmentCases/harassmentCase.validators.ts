import { CaseTimelineType, ExternalComplaintChannel, HarassmentCaseType } from "@prisma/client";
import { z } from "zod";
import { safeHttpsUrlSchema } from "../../security/publicContent.js";

export const caseIdParamSchema = z.object({ params: z.object({ caseId: z.string().min(1) }).strict() });
export const caseItemParamSchema = z.object({ params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }).strict() });
export const complaintIdParamSchema = z.object({ params: z.object({ caseId: z.string().min(1), complaintId: z.string().min(1) }).strict() });

export const createCaseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    caseType: z.nativeEnum(HarassmentCaseType),
    loanAppId: z.string().optional(),
    summary: z.string().max(2000).optional(),
    incidentDate: z.coerce.date().optional(),
    loanReferenceId: z.string().max(120).optional(),
    loanAmountRange: z.string().max(120).optional(),
  }).strict(),
});

export const updateCaseSchema = z.object({
  params: z.object({ caseId: z.string().min(1) }).strict(),
  body: z.object({
    title: z.string().trim().min(2).max(160).optional(),
    caseType: z.nativeEnum(HarassmentCaseType).optional(),
    loanAppId: z.string().nullable().optional(),
    summary: z.string().max(2000).optional(),
    incidentDate: z.coerce.date().optional(),
    loanReferenceId: z.string().max(120).optional(),
    loanAmountRange: z.string().max(120).optional(),
  }).strict(),
});

export const timelineSchema = z.object({
  body: z.object({
    type: z.nativeEnum(CaseTimelineType),
    title: z.string().min(2).max(160),
    description: z.string().max(2000).optional(),
    happenedAt: z.coerce.date().optional(),
    evidenceFileIds: z.array(z.string()).default([]),
  }).strict(),
});

export const updateTimelineSchema = z.object({
  params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }).strict(),
  body: z.object({
    type: z.nativeEnum(CaseTimelineType).optional(),
    title: z.string().min(2).max(160).optional(),
    description: z.string().max(2000).optional(),
    happenedAt: z.coerce.date().optional(),
    evidenceFileIds: z.array(z.string()).optional(),
  }).strict(),
});

export const checklistSchema = z.object({ body: z.object({ label: z.string().min(2).max(160), description: z.string().max(500).optional() }).strict() });
export const updateChecklistSchema = z.object({ params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }).strict(), body: z.object({ label: z.string().min(2).max(160).optional(), description: z.string().max(500).optional(), completed: z.boolean().optional() }).strict() });

export const externalComplaintSchema = z.object({ body: z.object({ channel: z.nativeEnum(ExternalComplaintChannel), complaintNumber: z.string().max(160).optional(), submittedAt: z.coerce.date().optional(), notes: z.string().max(2000).optional(), documentUrl: safeHttpsUrlSchema.optional() }).strict() });
export const updateExternalComplaintSchema = z.object({ params: z.object({ caseId: z.string().min(1), complaintId: z.string().min(1) }).strict(), body: z.object({ complaintNumber: z.string().max(160).optional(), submittedAt: z.coerce.date().optional(), notes: z.string().max(2000).optional(), documentUrl: safeHttpsUrlSchema.optional() }).strict() });

export const linkCaseSchema = z.object({ body: z.object({ id: z.string().min(1) }).strict() });

export type CreateCaseInput = z.infer<typeof createCaseSchema>["body"];
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>["body"];
