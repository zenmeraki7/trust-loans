import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const publicDirectorySchema = z.object({
  query: paginationQuerySchema.extend({
    q: z.string().trim().max(120).optional(),
    type: z.enum(["all", "loan_app", "nbfc", "bank", "digital_lender"]).default("all"),
    verificationStatus: z.string().trim().max(80).optional(),
    riskLevel: z.string().trim().max(80).optional(),
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
  }),
});

export type PublicDirectoryQuery = z.infer<typeof publicDirectorySchema>["query"];
