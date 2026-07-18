import { z } from "zod";
import { ClaimStatus, ProfileStatus, RiskLevel, VerificationStatus } from "@prisma/client";
import { paginationQuerySchema } from "../../utils/pagination.js";

const logoValueSchema = z.string().url().or(z.string().regex(/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/));

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

export const createLoanAppSchema = z.object({
  body: z.object({
    slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    name: z.string().min(2),
    logoUrl: logoValueSchema.optional(),
    packageName: z.string().optional(),
    developerName: z.string().optional(),
    companyName: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    appStoreUrl: z.string().url().optional(),
    claimedNbfcPartner: z.string().optional(),
    status: z.nativeEnum(ProfileStatus).optional(),
    verificationStatus: z.nativeEnum(VerificationStatus).optional(),
    claimStatus: z.nativeEnum(ClaimStatus).optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    trustScore: z.number().int().min(0).max(100).optional(),
    averageRating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().min(0).optional(),
    grievanceEmail: z.string().email().optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().optional(),
    registeredAddress: z.string().optional(),
  }),
});

export type SuggestLoanAppInput = z.infer<typeof suggestLoanAppSchema>["body"];
export type CreateLoanAppInput = z.infer<typeof createLoanAppSchema>["body"];

