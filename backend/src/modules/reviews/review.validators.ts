import { ReviewType, DisplayMode } from "@prisma/client";
import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    loanAppId: z.string().min(1),
    userId: z.string().optional(),
    title: z.string().min(3).max(180),
    body: z.string().min(20).max(10000),
    rating: z.number().int().min(1).max(5),
    reviewType: z.nativeEnum(ReviewType).default(ReviewType.GENERAL_REVIEW),
    displayMode: z.nativeEnum(DisplayMode).default(DisplayMode.ANONYMOUS),
    incidentDate: z.coerce.date().optional(),
    loanAmountRange: z.string().max(80).optional(),
    tags: z.array(z.string().min(1).max(80)).max(20).default([]),
    evidenceSubmitted: z.boolean().default(false),
  }),
});

export const reviewIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const reportReviewSchema = z.object({
  body: z.object({
    reviewId: z.string().min(1),
    reason: z.string().min(1).max(120),
    note: z.string().max(2000).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type ReportReviewInput = z.infer<typeof reportReviewSchema>["body"];
