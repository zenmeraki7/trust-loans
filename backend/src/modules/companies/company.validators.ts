import { z } from "zod";
import { plainTextSchema, safeHttpsUrlSchema, safePublicImageUrlSchema } from "../../security/publicContent.js";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const shortText = (max = 200) => plainTextSchema({ max });

export const enrichCompanyProfileSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
  body: z.object({
    logoUrl: z.preprocess(emptyToUndefined, safePublicImageUrlSchema.optional()),
    officialWebsite: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    businessType: z.preprocess(emptyToUndefined, shortText(120).optional()),
    playStoreUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    appStoreUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    supportEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceOfficerName: z.preprocess(emptyToUndefined, shortText(160).optional()),
    supportPhone: z.preprocess(emptyToUndefined, shortText(40).optional()),
    registeredAddress: z.preprocess(emptyToUndefined, shortText(1000).optional()),
    nbfcRegistrationClaim: z.preprocess(emptyToUndefined, shortText(500).optional()),
    rbiRegistrationNumber: z.preprocess(emptyToUndefined, shortText(160).optional()),
    rbiRegistrationVerifiedAt: z.coerce.date().optional(),
    rbiRegistrationSourceUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    associatedRegulatedEntity: z.preprocess(emptyToUndefined, shortText(200).optional()),
    interestRateRange: z.preprocess(emptyToUndefined, shortText(200).optional()),
    processingFees: z.preprocess(emptyToUndefined, shortText(200).optional()),
    latePaymentCharges: z.preprocess(emptyToUndefined, shortText(200).optional()),
    loanTenure: z.preprocess(emptyToUndefined, shortText(200).optional()),
    privacyDisclosure: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    contactAccessDisclosure: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    recoveryPracticeInfo: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    knownComplaintCategories: z.array(plainTextSchema({ min: 1, max: 80 })).max(30).optional(),
    publicWarningLabels: z.array(plainTextSchema({ min: 1, max: 120 })).max(20).optional(),
    dataSource: z.preprocess(emptyToUndefined, shortText(500).optional()),
    lastReviewedAt: z.coerce.date().optional(),
    companyDescription: z.preprocess(emptyToUndefined, shortText(2000).optional()),
  }).strict(),
});

export const createCompanyProfileSchema = z.object({
  body: z.object({
    name: plainTextSchema({ min: 2, max: 200 }),
    slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only").optional(),
    logoUrl: z.preprocess(emptyToUndefined, safePublicImageUrlSchema.optional()),
    officialWebsite: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    businessType: z.preprocess(emptyToUndefined, shortText(120).optional()),
    playStoreUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    appStoreUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    supportEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceOfficerName: z.preprocess(emptyToUndefined, shortText(160).optional()),
    supportPhone: z.preprocess(emptyToUndefined, shortText(40).optional()),
    registeredAddress: z.preprocess(emptyToUndefined, shortText(1000).optional()),
    nbfcRegistrationClaim: z.preprocess(emptyToUndefined, shortText(500).optional()),
    rbiRegistrationNumber: z.preprocess(emptyToUndefined, shortText(160).optional()),
    rbiRegistrationVerifiedAt: z.coerce.date().optional(),
    rbiRegistrationSourceUrl: z.preprocess(emptyToUndefined, safeHttpsUrlSchema.optional()),
    associatedRegulatedEntity: z.preprocess(emptyToUndefined, shortText(200).optional()),
    interestRateRange: z.preprocess(emptyToUndefined, shortText(200).optional()),
    processingFees: z.preprocess(emptyToUndefined, shortText(200).optional()),
    latePaymentCharges: z.preprocess(emptyToUndefined, shortText(200).optional()),
    loanTenure: z.preprocess(emptyToUndefined, shortText(200).optional()),
    privacyDisclosure: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    contactAccessDisclosure: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    recoveryPracticeInfo: z.preprocess(emptyToUndefined, shortText(4000).optional()),
    knownComplaintCategories: z.array(plainTextSchema({ min: 1, max: 80 })).max(30).optional(),
    publicWarningLabels: z.array(plainTextSchema({ min: 1, max: 120 })).max(20).optional(),
    dataSource: z.preprocess(emptyToUndefined, shortText(500).optional()),
    companyDescription: z.preprocess(emptyToUndefined, shortText(2000).optional()),
    lastReviewedAt: z.coerce.date().optional(),
  }).strict(),
});

export type EnrichCompanyProfileInput = z.infer<typeof enrichCompanyProfileSchema>["body"];
export type CreateCompanyProfileInput = z.infer<typeof createCompanyProfileSchema>["body"];
