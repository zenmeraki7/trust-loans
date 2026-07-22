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
  legalEntityName: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  claimedNbfcPartner: z.string().nullable().optional(),
  associatedRegulatedEntity: z.string().nullable().optional(),
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
  rbiRegistrationNumber: z.string().nullable().optional(),
  rbiRegistrationVerifiedAt: z.string().or(z.date()).nullable().optional(),
  rbiRegistrationSourceUrl: z.string().nullable().optional(),
  interestRateRange: z.string().nullable().optional(),
  processingFees: z.string().nullable().optional(),
  latePaymentCharges: z.string().nullable().optional(),
  loanTenure: z.string().nullable().optional(),
  privacyDisclosure: z.string().nullable().optional(),
  contactAccessDisclosure: z.string().nullable().optional(),
  recoveryPracticeInfo: z.string().nullable().optional(),
  knownComplaintCategories: z.array(z.string()).optional(),
  publicWarningLabels: z.array(z.string()).optional(),
  dataSource: z.string().nullable().optional(),
  lastReviewedAt: z.string().or(z.date()).nullable().optional(),
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
  regulatoryActions: z
    .array(
      z.object({
        id: z.string(),
        authorityName: z.string(),
        authorityJurisdiction: z.string().nullable().optional(),
        actionType: z.string(),
        severity: z.string(),
        status: z.string(),
        title: z.string(),
        summary: z.string().nullable().optional(),
        orderNumber: z.string().nullable().optional(),
        sourceUrl: z.string().nullable().optional(),
        sourceDocumentUrl: z.string().nullable().optional(),
        sourcePublishedAt: z.string().or(z.date()).nullable().optional(),
        effectiveFrom: z.string().or(z.date()).nullable().optional(),
        effectiveUntil: z.string().or(z.date()).nullable().optional(),
        verifiedAt: z.string().or(z.date()).nullable().optional(),
      }),
    )
    .optional(),
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
