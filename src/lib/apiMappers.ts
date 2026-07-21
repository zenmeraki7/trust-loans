import type { ApiLoanApp, ApiReview } from "@/types/apiDtos";
import type { LoanAppDirectoryItem } from "@/types/loanAppsDirectory";
import type { AppProfile, Review, RiskLevel } from "@/types/loanAppProfile";

export const mapRiskLevel = (value?: string): RiskLevel => {
  const normalized = value?.toLowerCase();
  if (normalized === "low") return "low";
  if (normalized === "medium") return "medium";
  if (normalized === "high") return "high";
  if (normalized === "severe" || normalized === "severe_complaint_pattern") return "severe";
  return "medium";
};

export const mapStatus = (value?: string): AppProfile["status"] => {
  const normalized = value?.toLowerCase();
  if (normalized === "published" || normalized === "claimed") return "claimed";
  if (normalized === "draft" || normalized === "unclaimed") return "unclaimed";
  if (normalized === "under_review") return "under_review";
  return "reported_by_users";
};

export const mapApiLoanAppToDirectoryItem = (app: ApiLoanApp): LoanAppDirectoryItem => {
  const complaintCounts = Object.fromEntries((app.complaintSummaries ?? []).map((item) => [item.tag.toLowerCase(), item.count]));
  return {
    id: app.slug ?? app.id,
    name: app.name,
    logoUrl: app.logoUrl ?? "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
    developerName: app.developerName ?? "Under verification",
    companyName: app.companyName ?? "Under verification",
    claimedNbfcPartner: app.claimedNbfcPartner ?? "Under verification",
    trustScore: app.trustScore,
    averageRating: app.averageRating,
    reviewCount: app.reviewCount,
    riskLevel: mapRiskLevel(app.riskLevel),
    status: app.status?.toLowerCase() === "published" ? "claimed" : "under_review",
    topComplaintTags: (app.complaintSummaries ?? []).map((item) => item.tag).slice(0, 4),
    summary: app.summaryNote ?? "Public details and user-reported patterns are under review.",
    platform: [app.playStoreUrl ? "android" : "website"],
    lastUpdated: String(app.updatedAt ?? ""),
    complaintCounts: {
      harassment: Number(complaintCounts.harassment ?? 0),
      hiddenCharges: Number(complaintCounts["hidden charges"] ?? 0),
      dataPrivacy: Number(complaintCounts["data misuse"] ?? 0),
    },
    grievanceDetailsAvailable: Boolean(app.grievanceEmail || app.supportEmail || app.supportPhone),
  };
};

export const mapApiLoanAppToProfile = (app: ApiLoanApp): AppProfile => ({
  id: app.id,
  name: app.name,
  logoUrl: app.logoUrl ?? "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
  developerName: app.developerName ?? "Under verification",
  companyName: app.companyName ?? "Under verification",
  publicName: app.name,
  legalEntityName: app.legalEntityName ?? app.companyName ?? "",
  businessType: app.businessType ?? "Loan app / digital lending interface",
  website: app.websiteUrl ?? "",
  playStoreUrl: app.playStoreUrl ?? "",
  appStoreUrl: app.appStoreUrl ?? "",
  claimedNbfcPartner: app.claimedNbfcPartner ?? "Under verification",
  associatedRegulatedEntity: app.associatedRegulatedEntity ?? app.claimedNbfcPartner ?? "",
  rbiRegistrationClaim: app.rbiRegistrationNumber ? "RBI registration independently verified where source is listed." : "Claimed relationship should be independently verified before borrowing.",
  rbiRegistrationNumber: app.rbiRegistrationNumber ?? "",
  rbiRegistrationVerifiedAt: String(app.rbiRegistrationVerifiedAt ?? ""),
  rbiRegistrationSourceUrl: app.rbiRegistrationSourceUrl ?? "",
  interestRateRange: app.interestRateRange ?? "",
  processingFees: app.processingFees ?? "",
  latePaymentCharges: app.latePaymentCharges ?? "",
  loanTenure: app.loanTenure ?? "",
  privacyDisclosure: app.privacyDisclosure ?? "",
  contactAccessDisclosure: app.contactAccessDisclosure ?? "",
  recoveryPracticeInfo: app.recoveryPracticeInfo ?? "",
  knownComplaintCategories: app.knownComplaintCategories ?? [],
  publicWarningLabels: app.publicWarningLabels ?? [],
  regulatoryActions: (app.regulatoryActions ?? []).map((action) => ({
    id: action.id,
    authorityName: action.authorityName,
    authorityJurisdiction: action.authorityJurisdiction ?? "",
    actionType: action.actionType,
    severity: action.severity,
    status: action.status,
    title: action.title,
    summary: action.summary ?? "",
    orderNumber: action.orderNumber ?? "",
    sourceUrl: action.sourceUrl ?? "",
    sourceDocumentUrl: action.sourceDocumentUrl ?? "",
    sourcePublishedAt: String(action.sourcePublishedAt ?? ""),
    effectiveFrom: String(action.effectiveFrom ?? ""),
    effectiveUntil: String(action.effectiveUntil ?? ""),
    verifiedAt: String(action.verifiedAt ?? ""),
  })),
  dataSource: app.dataSource ?? "Public app metadata and moderated user reports",
  lastReviewedAt: String(app.lastReviewedAt ?? app.updatedAt ?? ""),
  grievanceOfficer: {
    name: "Public grievance contact",
    email: app.grievanceEmail ?? app.supportEmail ?? "",
    phone: app.supportPhone ?? "",
    address: app.registeredAddress ?? "",
  },
  support: {
    email: app.supportEmail ?? "",
    phone: app.supportPhone ?? "",
  },
  status: mapStatus(app.status),
  riskLevel: mapRiskLevel(app.riskLevel),
  trustScore: app.trustScore,
  reviewCount: app.reviewCount,
  averageRating: app.averageRating,
  summaryLine: app.publicSafetyNote ?? app.summaryNote ?? "This profile is based on public details and moderated user-submitted reviews.",
  lastUpdated: String(app.updatedAt ?? ""),
  scoreBreakdown: [
    {
      key: "regulatory_identity_clarity",
      label: "Regulatory identity clarity",
      score: app.rbiRegistrationNumber || app.associatedRegulatedEntity || app.claimedNbfcPartner ? 80 : 35,
      explanation: "Checks legal entity, associated regulated entity, RBI registration details, and source clarity.",
    },
    {
      key: "interest_fee_transparency",
      label: "Interest and fee transparency",
      score: [app.interestRateRange, app.processingFees, app.latePaymentCharges, app.loanTenure].filter(Boolean).length * 25,
      explanation: "Checks whether interest range, processing fee, late-payment charges, and loan tenure are disclosed.",
    },
    {
      key: "grievance_contacts",
      label: "Availability of grievance contacts",
      score: app.grievanceEmail || app.supportEmail || app.supportPhone ? 100 : 20,
      explanation: "Checks whether public customer-support or grievance contacts are available.",
    },
    {
      key: "privacy_disclosures",
      label: "Privacy disclosures",
      score: [app.privacyDisclosure, app.contactAccessDisclosure].filter(Boolean).length * 50,
      explanation: "Checks privacy and contact-access disclosure availability.",
    },
    ...[
      ["recovery_related_complaints", "Recovery-related complaints", ["harassment", "threat", "recovery", "fake legal"]],
      ["contact_access_complaints", "Contact-access complaints", ["contact", "relative", "office", "privacy"]],
      ["repeated_harassment_reports", "Repeated harassment reports", ["harassment", "threat", "abusive", "repeated"]],
    ].map(([key, label, terms]) => {
      const percent = (app.complaintSummaries ?? [])
        .filter((summary) => (terms as string[]).some((term) => summary.tag.toLowerCase().includes(term)))
        .reduce((sum, summary) => sum + summary.percentage, 0);
      return {
        key: String(key),
        label: String(label),
        score: Math.max(0, 100 - Math.round(percent * 2)),
        explanation: `${Math.round(percent)}% of known complaint patterns currently match this factor.`,
      };
    }),
    {
      key: "app_store_domain_consistency",
      label: "App-store and domain consistency",
      score: app.websiteUrl && (app.playStoreUrl || app.appStoreUrl) ? 100 : app.websiteUrl || app.playStoreUrl || app.appStoreUrl ? 65 : 25,
      explanation: "Checks whether official domain and app-store links are listed together.",
    },
    {
      key: "confirmed_regulatory_actions",
      label: "Confirmed regulatory actions",
      score: app.regulatoryActions?.some((action) => action.severity === "CRITICAL")
        ? 5
        : app.regulatoryActions?.some((action) => action.severity === "HIGH")
          ? 20
          : (app.publicWarningLabels ?? []).some((label) => /regulatory|rbi|order|enforcement|ban|blacklist|action/i.test(label))
            ? 20
            : app.rbiRegistrationNumber
              ? 90
              : 70,
      explanation: app.regulatoryActions?.length
        ? `Uses ${app.regulatoryActions.length} structured regulatory action record${app.regulatoryActions.length === 1 ? "" : "s"} linked to this profile.`
        : "Uses explicit public warning labels for regulatory actions; absence of a warning is not proof of regulatory approval.",
    },
    {
      key: "complaint_responsiveness",
      label: "Responsiveness to complaints",
      score: app.grievanceEmail || app.supportEmail ? 70 : 40,
      explanation: "Uses available complaint-response signals and grievance contact availability when public response data is limited.",
    },
  ],
});

export const mapApiReviewToReview = (review: ApiReview): Review => ({
  id: review.id,
  reviewerName: review.displayMode === "FIRST_NAME_ONLY" ? "Reviewer" : "Anonymous reviewer",
  isVerifiedBorrower: false,
  rating: review.rating,
  title: review.title,
  body: review.body,
  tags: review.tags,
  createdAt: String(review.publishedAt ?? review.createdAt ?? ""),
  helpfulCount: review.helpfulCount,
});
