import { ReviewStatus } from "@prisma/client";
import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const listModerationReviewsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.nativeEnum(ReviewStatus).optional(),
    loanAppId: z.string().optional(),
  }),
});

export const moderationReviewIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
});

export const approveReviewSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    status: z.enum(["PUBLISHED", "PARTIALLY_PUBLISHED"]).default("PUBLISHED"),
    publicBody: z.string().max(10000).optional(),
    reason: z.string().max(1000).optional(),
  }).strict(),
});

export const rejectReviewSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    reason: z.string().min(3).max(1000),
  }).strict(),
});

export const requestInfoReviewSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    reason: z.string().min(3).max(1000).optional(),
  }).strict(),
});

export const redactReviewSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    publicBody: z.string().min(1).max(10000),
    reason: z.string().min(3).max(1000).optional(),
  }).strict(),
});
