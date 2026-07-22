import { z } from "zod";

export const compareListSchema = z.object({
  query: z.object({
    ids: z.string().trim().optional(),
    q: z.string().trim().max(120).optional(),
    legalEntity: z.string().trim().max(120).optional(),
    nbfc: z.string().trim().max(120).optional(),
    interestRate: z.string().trim().max(120).optional(),
    processingFee: z.string().trim().max(120).optional(),
    loanTenure: z.string().trim().max(120).optional(),
    complaintVolume: z.enum(["any", "has_complaints", "high_volume"]).default("any"),
    minComplaintVolume: z.coerce.number().int().min(0).optional(),
    complaintCategory: z.string().trim().max(120).optional(),
    recoveryConcern: z.string().trim().max(120).optional(),
    regulatoryStatus: z.enum(["all", "verified", "claimed", "under_verification"]).default("all"),
    appStoreAvailability: z.enum(["any", "play_store", "app_store", "both", "store_available"]).default("any"),
    safetyLevel: z.enum(["all", "low", "medium", "high", "severe"]).default("all"),
  }).strict(),
});

export type CompareListQuery = z.infer<typeof compareListSchema>["query"];
