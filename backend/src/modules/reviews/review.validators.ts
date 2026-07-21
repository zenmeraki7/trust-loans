import { ReviewType, DisplayMode } from "@prisma/client";
import { z } from "zod";
import { plainTextSchema } from "../../security/publicContent.js";

export const createReviewSchema = z.object({
  body: z.object({
    loanAppId: z.string().min(1),
    title: plainTextSchema({ min: 3, max: 180 }),
    body: plainTextSchema({ min: 20, max: 10000 }),
    rating: z.number().int().min(1).max(5),
    reviewType: z.nativeEnum(ReviewType).default(ReviewType.GENERAL_REVIEW),
    displayMode: z.nativeEnum(DisplayMode).default(DisplayMode.ANONYMOUS),
    incidentDate: z.coerce.date().optional(),
    loanAmountRange: plainTextSchema({ max: 80 }).optional(),
    tags: z.array(plainTextSchema({ min: 1, max: 80 })).max(20).default([]),
  }).strict(),
});

export const reviewIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
});

export const reportReviewSchema = z.object({
  body: z.object({
    reviewId: z.string().min(1),
    reason: plainTextSchema({ min: 1, max: 120 }),
    note: plainTextSchema({ max: 2000 }).optional(),
  }).strict(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type ReportReviewInput = z.infer<typeof reportReviewSchema>["body"];
