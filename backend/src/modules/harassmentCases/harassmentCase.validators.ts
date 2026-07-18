import { CasePriority, CaseTimelineType, ExternalComplaintChannel, ExternalComplaintStatus, HarassmentCaseStatus, HarassmentCaseType } from "@prisma/client";
import { z } from "zod";

export const caseIdParamSchema = z.object({ params: z.object({ caseId: z.string().min(1) }) });
export const caseItemParamSchema = z.object({ params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }) });
export const complaintIdParamSchema = z.object({ params: z.object({ caseId: z.string().min(1), complaintId: z.string().min(1) }) });

export const createCaseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    caseType: z.nativeEnum(HarassmentCaseType),
    status: z.nativeEnum(HarassmentCaseStatus).optional(),
    loanAppId: z.string().optional(),
    summary: z.string().max(2000).optional(),
    incidentDate: z.coerce.date().optional(),
    loanReferenceId: z.string().max(120).optional(),
    loanAmountRange: z.string().max(120).optional(),
    decisionTreeSessionId: z.string().max(160).optional(),
    linkedReviewId: z.string().max(160).optional(),
    linkedEvidenceFileIds: z.array(z.string().min(1)).optional(),
    linkedComplaintDraftIds: z.array(z.string().min(1)).optional(),
    priority: z.nativeEnum(CasePriority).optional(),
  }),
});

export const updateCaseSchema = z.object({
  params: z.object({ caseId: z.string().min(1) }),
  body: z.object({
    title: z.string().trim().min(2).max(160).optional(),
    caseType: z.nativeEnum(HarassmentCaseType).optional(),
    status: z.nativeEnum(HarassmentCaseStatus).optional(),
    priority: z.nativeEnum(CasePriority).optional(),
    loanAppId: z.string().nullable().optional(),
    summary: z.string().max(2000).optional(),
    incidentDate: z.coerce.date().optional(),
    loanReferenceId: z.string().max(120).optional(),
    loanAmountRange: z.string().max(120).optional(),
    decisionTreeSessionId: z.string().max(160).optional(),
    linkedReviewId: z.string().max(160).optional(),
    linkedEvidenceFileIds: z.array(z.string().min(1)).optional(),
    linkedComplaintDraftIds: z.array(z.string().min(1)).optional(),
  }),
});

export const timelineSchema = z.object({
  body: z.object({
    type: z.nativeEnum(CaseTimelineType),
    title: z.string().min(2).max(160),
    description: z.string().max(2000).optional(),
    happenedAt: z.coerce.date().optional(),
    evidenceFileIds: z.array(z.string()).default([]),
  }),
});

export const updateTimelineSchema = z.object({
  params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }),
  body: z.object({
    type: z.nativeEnum(CaseTimelineType).optional(),
    title: z.string().min(2).max(160).optional(),
    description: z.string().max(2000).optional(),
    happenedAt: z.coerce.date().optional(),
    evidenceFileIds: z.array(z.string()).optional(),
  }),
});

export const checklistSchema = z.object({ body: z.object({ label: z.string().min(2).max(160), description: z.string().max(500).optional() }) });
export const updateChecklistSchema = z.object({ params: z.object({ caseId: z.string().min(1), itemId: z.string().min(1) }), body: z.object({ label: z.string().min(2).max(160).optional(), description: z.string().max(500).optional(), completed: z.boolean().optional() }) });

export const externalComplaintSchema = z.object({ body: z.object({ channel: z.nativeEnum(ExternalComplaintChannel), complaintNumber: z.string().max(160).optional(), submittedAt: z.coerce.date().optional(), status: z.nativeEnum(ExternalComplaintStatus).optional(), notes: z.string().max(2000).optional(), documentUrl: z.string().url().optional() }) });
export const updateExternalComplaintSchema = z.object({ params: z.object({ caseId: z.string().min(1), complaintId: z.string().min(1) }), body: z.object({ complaintNumber: z.string().max(160).optional(), submittedAt: z.coerce.date().optional(), status: z.nativeEnum(ExternalComplaintStatus).optional(), notes: z.string().max(2000).optional(), documentUrl: z.string().url().optional() }) });

export const linkCaseSchema = z.object({ body: z.object({ id: z.string().min(1) }) });

export type CreateCaseInput = z.infer<typeof createCaseSchema>["body"];
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>["body"];
