import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const listLoanAppsSchema = z.object({
  query: paginationQuerySchema.extend({
    q: z.string().optional(),
    riskLevel: z.string().optional(),
    verificationStatus: z.string().optional(),
  }),
});

export const slugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const appIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: paginationQuerySchema,
});

export const suggestLoanAppSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    developerName: z.string().optional(),
    companyName: z.string().optional(),
    claimedNbfcPartner: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    appStoreUrl: z.string().url().optional(),
    note: z.string().max(2000).optional(),
  }),
});

export type SuggestLoanAppInput = z.infer<typeof suggestLoanAppSchema>["body"];

