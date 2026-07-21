import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";
import { plainTextSchema, safeHttpsUrlSchema, safePublicImageUrlSchema } from "../../security/publicContent.js";

const shortText = (max = 200) => plainTextSchema({ max });

export const listLoanAppsSchema = z.object({
  query: paginationQuerySchema.extend({
    q: z.string().optional(),
    riskLevel: z.string().optional(),
    verificationStatus: z.string().optional(),
    sort: z.enum(["trust_desc", "trust_asc", "reviews_desc", "recent", "reported", "updated"]).optional(),
  }),
});

export type LoanAppSort = NonNullable<z.infer<typeof listLoanAppsSchema>["query"]["sort"]>;

export const slugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }).strict(),
});

export const appIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  query: paginationQuerySchema,
});

export const suggestLoanAppSchema = z.object({
  body: z.object({
    name: plainTextSchema({ min: 2, max: 200 }),
    developerName: shortText().optional(),
    companyName: shortText().optional(),
    claimedNbfcPartner: shortText().optional(),
    websiteUrl: safeHttpsUrlSchema.optional(),
    playStoreUrl: safeHttpsUrlSchema.optional(),
    appStoreUrl: safeHttpsUrlSchema.optional(),
    note: shortText(2000).optional(),
  }).strict(),
});

export const createLoanAppSchema = z.object({
  body: z.object({
    slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    name: plainTextSchema({ min: 2, max: 200 }),
    logoUrl: safePublicImageUrlSchema.optional(),
    packageName: shortText(255).optional(),
    developerName: shortText().optional(),
    companyName: shortText().optional(),
    legalEntityName: shortText(300).optional(),
    businessType: shortText(120).optional(),
    websiteUrl: safeHttpsUrlSchema.optional(),
    playStoreUrl: safeHttpsUrlSchema.optional(),
    appStoreUrl: safeHttpsUrlSchema.optional(),
    claimedNbfcPartner: shortText().optional(),
    associatedRegulatedEntity: shortText().optional(),
    rbiRegistrationNumber: shortText(160).optional(),
    rbiRegistrationVerifiedAt: z.coerce.date().optional(),
    rbiRegistrationSourceUrl: safeHttpsUrlSchema.optional(),
    interestRateRange: shortText().optional(),
    processingFees: shortText().optional(),
    latePaymentCharges: shortText().optional(),
    loanTenure: shortText().optional(),
    privacyDisclosure: shortText(4000).optional(),
    contactAccessDisclosure: shortText(4000).optional(),
    recoveryPracticeInfo: shortText(4000).optional(),
    knownComplaintCategories: z.array(plainTextSchema({ min: 1, max: 80 })).max(30).optional(),
    publicWarningLabels: z.array(plainTextSchema({ min: 1, max: 120 })).max(20).optional(),
    dataSource: shortText(500).optional(),
    lastReviewedAt: z.coerce.date().optional(),
    grievanceEmail: z.string().email().optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: shortText(40).optional(),
    registeredAddress: shortText(1000).optional(),
  }).strict(),
});

export type SuggestLoanAppInput = z.infer<typeof suggestLoanAppSchema>["body"];
export type CreateLoanAppInput = z.infer<typeof createLoanAppSchema>["body"];
