import { z } from "zod";

export const scoreBreakdownParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
});

export const updateScoringConfigSchema = z.object({
  body: z.object({
    averageRatingWeight: z.number().min(0).max(100).optional(),
    reviewVolumeWeight: z.number().min(0).max(100).optional(),
    recentComplaintTrendWeight: z.number().min(0).max(100).optional(),
    complaintSeverityWeight: z.number().min(0).max(100).optional(),
    verifiedBorrowerWeight: z.number().min(0).max(100).optional(),
    companyResponseWeight: z.number().min(0).max(100).optional(),
    grievanceAvailabilityWeight: z.number().min(0).max(100).optional(),
    publicDetailVerificationWeight: z.number().min(0).max(100).optional(),
    reviewIntegrityWeight: z.number().min(0).max(100).optional(),
    severeComplaintPenalty: z.number().min(0).max(100).optional(),
    privacyComplaintPenalty: z.number().min(0).max(100).optional(),
    hiddenChargeComplaintPenalty: z.number().min(0).max(100).optional(),
    staleVerificationPenalty: z.number().min(0).max(100).optional(),
  }).strict(),
});

export const recalculateScoringSchema = z.object({
  body: z.object({
    job: z
      .enum([
        "score.recalculate.app",
        "score.recalculate.entity",
        "score.recalculate.all",
        "complaint.summary.rebuild",
        "risk.signal.detect",
      ])
      .default("score.recalculate.all"),
    appId: z.string().optional(),
    entityId: z.string().optional(),
    reason: z.string().max(500).optional(),
  }).strict(),
});

export type UpdateScoringConfigInput = z.infer<typeof updateScoringConfigSchema>["body"];
export type RecalculateScoringInput = z.infer<typeof recalculateScoringSchema>["body"];
