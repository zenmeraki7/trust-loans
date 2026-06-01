import { z } from "zod";

export const paginatedMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const apiLoanAppSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  developerName: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  claimedNbfcPartner: z.string().nullable().optional(),
  status: z.string(),
  verificationStatus: z.string().optional(),
  claimStatus: z.string().optional(),
  trustScore: z.number(),
  riskLevel: z.string(),
  averageRating: z.number(),
  reviewCount: z.number(),
  summaryNote: z.string().optional(),
  packageName: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  playStoreUrl: z.string().nullable().optional(),
  appStoreUrl: z.string().nullable().optional(),
  grievanceEmail: z.string().nullable().optional(),
  supportEmail: z.string().nullable().optional(),
  supportPhone: z.string().nullable().optional(),
  registeredAddress: z.string().nullable().optional(),
  complaintSummaries: z
    .array(
      z.object({
        tag: z.string(),
        count: z.number(),
        percentage: z.number(),
        lastCalculatedAt: z.string().or(z.date()).optional(),
      }),
    )
    .optional(),
  updatedAt: z.string().or(z.date()).optional(),
  publicSafetyNote: z.string().optional(),
});

export const apiReviewSchema = z.object({
  id: z.string(),
  loanAppId: z.string().optional(),
  title: z.string(),
  body: z.string(),
  rating: z.number(),
  reviewType: z.string().optional(),
  status: z.string().optional(),
  displayMode: z.string().optional(),
  incidentDate: z.string().or(z.date()).nullable().optional(),
  loanAmountRange: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  evidenceSubmitted: z.boolean().optional(),
  redactionsApplied: z.boolean().optional(),
  helpfulCount: z.number().default(0),
  publishedAt: z.string().or(z.date()).nullable().optional(),
  createdAt: z.string().or(z.date()).optional(),
  companyResponses: z
    .array(
      z.object({
        id: z.string(),
        companyName: z.string(),
        body: z.string(),
        category: z.string(),
        createdAt: z.string().or(z.date()),
      }),
    )
    .optional(),
  safetyNote: z.string().optional(),
});

export type ApiLoanApp = z.infer<typeof apiLoanAppSchema>;
export type ApiReview = z.infer<typeof apiReviewSchema>;

export type PaginatedResponse<T> = {
  items: T[];
  meta: z.infer<typeof paginatedMetaSchema>;
};

export type SubmitReviewResponse = {
  id: string;
  status: string;
  message: string;
  createdAt: string;
};

