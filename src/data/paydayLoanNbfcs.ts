import { isHighRiskPaydayApp, paydayLoanApps } from "@/data/paydayLoanApps";
import type { EntityProfileData } from "@/types/entityProfile";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const paydayLoanNbfcs = [...new Set(paydayLoanApps.map((app) => app.nbfcName).filter((name): name is string => Boolean(name)))].map((name) => {
  const apps = paydayLoanApps.filter((app) => app.nbfcName === name);
  return {
    id: slugify(name),
    slug: slugify(name),
    name,
    displayName: name,
    entityType: "claimed_nbfc_partner" as const,
    verificationStatus: "under_verification" as const,
    riskSignalLevel: apps.some(isHighRiskPaydayApp) ? "high" as const : "medium" as const,
    totalLinkedApps: apps.length,
    totalReviewsAcrossApps: 0,
  };
});

export function getPaydayNbfcProfile(slug: string): EntityProfileData | null {
  const nbfc = paydayLoanNbfcs.find((item) => item.slug === slugify(slug));
  if (!nbfc) return null;
  const apps = paydayLoanApps.filter((app) => app.nbfcName === nbfc.name);
  const highRiskCount = apps.filter(isHighRiskPaydayApp).length;
  const linkedApps: EntityProfileData["linkedApps"] = apps.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.id,
    logoUrl: `https://placehold.co/96x96/1d4ed8/ffffff?text=${encodeURIComponent(app.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2))}`,
    developerName: "Under verification",
    companyName: "Under verification",
    relationshipType: "claimed_nbfc_partner",
    relationshipVerificationStatus: "under_verification",
    trustScore: 0,
    averageRating: 0,
    reviewCount: 0,
    riskLevel: isHighRiskPaydayApp(app) ? "high" : "medium",
    topComplaintTags: isHighRiskPaydayApp(app) ? ["Harassment reports", "Contact-list misuse", "Threat calls"] : [],
    profileUrl: `/payday-loan-apps/${app.id}`,
  }));

  return {
    ...nbfc,
    averageLinkedAppTrustScore: 0,
    details: {
      legalName: nbfc.name,
      website: "",
      businessType: "Claimed NBFC partner",
      playStoreUrl: "",
      appStoreUrl: "",
      supportEmail: "",
      supportPhone: "",
      registeredAddress: "",
      registrationNumber: "",
      rbiRegistrationClaim: nbfc.name,
      rbiRegistrationVerifiedAt: "",
      rbiRegistrationSourceUrl: "",
      associatedRegulatedEntity: nbfc.name,
      interestRateRange: "",
      processingFees: "",
      latePaymentCharges: "",
      loanTenure: "",
      privacyDisclosure: "",
      contactAccessDisclosure: "",
      recoveryPracticeInfo: "",
      knownComplaintCategories: [],
      publicWarningLabels: highRiskCount ? ["High complaint signal in linked apps"] : [],
      dataSource: "Static payday loan app reference data",
      lastReviewedAt: "",
      sourceUrls: [],
      lastVerifiedAt: "",
      verificationConfidence: "low",
    },
    grievance: { officerName: "", email: "", phone: "", address: "", sourceUrl: "", lastVerifiedAt: "" },
    linkedApps,
    relationshipEvidence: linkedApps.map((app) => ({ appId: app.id, appName: app.name, relationshipType: "claimed_nbfc_partner", verificationStatus: "under_verification", sourceType: "provided_directory_data", sourceUrl: "", lastCheckedAt: "", confidence: "low", notes: "Claimed association; independent verification pending." })),
    complaintPatterns: { totalReviews: 0, harassmentPercent: 0, hiddenChargesPercent: 0, contactListAbusePercent: 0, dataMisusePercent: 0, fakeLegalNoticePercent: 0, paymentNotUpdatedPercent: 0, loanNotClosedPercent: 0, positiveReviewPercent: 0 },
    riskDistribution: { low: 0, medium: apps.length - highRiskCount, high: highRiskCount, severe: 0, underReview: apps.length },
    officialResponses: [], relatedEntities: [], mentionedReviews: [],
    faq: [{ question: "Does this confirm the NBFC relationship?", answer: "No. These are claimed associations and remain under independent verification." }],
  };
}
