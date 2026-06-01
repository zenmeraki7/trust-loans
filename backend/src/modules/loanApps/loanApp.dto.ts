import type { LoanApp, ComplaintSummary } from "@prisma/client";

export const toPublicLoanAppListItemDto = (app: LoanApp) => ({
  id: app.id,
  slug: app.slug,
  name: app.name,
  logoUrl: app.logoUrl,
  developerName: app.developerName,
  companyName: app.companyName,
  claimedNbfcPartner: app.claimedNbfcPartner,
  status: app.status,
  verificationStatus: app.verificationStatus,
  claimStatus: app.claimStatus,
  trustScore: app.trustScore,
  riskLevel: app.riskLevel,
  averageRating: app.averageRating,
  reviewCount: app.reviewCount,
  summaryNote: "Scores and labels are awareness indicators based on available public details and user-submitted reviews.",
  updatedAt: app.updatedAt,
});

export const toPublicLoanAppProfileDto = (app: LoanApp & { complaintSummaries: ComplaintSummary[] }) => ({
  ...toPublicLoanAppListItemDto(app),
  packageName: app.packageName,
  websiteUrl: app.websiteUrl,
  playStoreUrl: app.playStoreUrl,
  appStoreUrl: app.appStoreUrl,
  grievanceEmail: app.grievanceEmail,
  supportEmail: app.supportEmail,
  supportPhone: app.supportPhone,
  registeredAddress: app.registeredAddress,
  complaintSummaries: app.complaintSummaries.map((summary) => ({
    tag: summary.tag,
    count: summary.count,
    percentage: summary.percentage,
    lastCalculatedAt: summary.lastCalculatedAt,
  })),
  publicSafetyNote:
    "This profile shows public details, app-provided claims, and user-reported patterns. It does not make final legal findings.",
});

