import { CorrectionStatus } from "@prisma/client";
import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const createCorrectionSchema = z.object({
  body: z.object({
    requesterId: z.string().optional(),
    requestType: z.enum([
      "privacy_violation",
      "review_dispute",
      "duplicate_profile",
      "wrong_nbfc_company_link",
      "own_review_removal",
      "app_detail_correction",
      "company_entity_correction",
    ]),
    publicItemType: z.string().max(80).optional(),
    publicItemId: z.string().max(120).optional(),
    explanation: z.string().min(10).max(5000),
    currentValue: z.string().max(2000).optional(),
    proposedValue: z.string().max(2000).optional(),
    sourceUrl: z.string().url().optional(),
  }),
});

export const correctionIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listCorrectionsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.nativeEnum(CorrectionStatus).optional(),
    requestType: z.string().optional(),
  }),
});

export const correctionDecisionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    reason: z.string().min(3).max(1000).optional(),
  }),
});

export type CreateCorrectionInput = z.infer<typeof createCorrectionSchema>["body"];

