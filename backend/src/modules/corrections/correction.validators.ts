import { CorrectionStatus } from "@prisma/client";
import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";
import { plainTextSchema, safeHttpsUrlSchema } from "../../security/publicContent.js";

export const createCorrectionSchema = z.object({
  body: z.object({
    requestType: z.enum([
      "privacy_violation",
      "review_dispute",
      "duplicate_profile",
      "wrong_nbfc_company_link",
      "own_review_removal",
      "app_detail_correction",
      "company_entity_correction",
    ]),
    publicItemType: plainTextSchema({ max: 80 }).optional(),
    publicItemId: plainTextSchema({ max: 120 }).optional(),
    explanation: plainTextSchema({ min: 10, max: 5000 }),
    currentValue: plainTextSchema({ max: 2000 }).optional(),
    proposedValue: plainTextSchema({ max: 2000 }).optional(),
    sourceUrl: safeHttpsUrlSchema.optional(),
  }).strict(),
});

export const correctionIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
});

export const listCorrectionsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.nativeEnum(CorrectionStatus).optional(),
    requestType: z.string().optional(),
  }),
});

export const correctionDecisionSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    reason: plainTextSchema({ min: 3, max: 1000 }).optional(),
  }).strict(),
});

export type CreateCorrectionInput = z.infer<typeof createCorrectionSchema>["body"];
