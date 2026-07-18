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
  website: app.websiteUrl ?? "",
  playStoreUrl: app.playStoreUrl ?? "",
  appStoreUrl: app.appStoreUrl ?? "",
  claimedNbfcPartner: app.claimedNbfcPartner ?? "Under verification",
  rbiRegistrationClaim: "Claimed relationship should be independently verified before borrowing.",
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
    { key: "overall", label: "Overall Score", score: app.trustScore, explanation: "Based on available public details and user-submitted reviews." },
    ...(app.complaintSummaries ?? []).slice(0, 7).map((summary) => ({
      key: summary.tag.toLowerCase().replaceAll(" ", "_"),
      label: summary.tag,
      score: Math.max(0, 100 - Math.round(summary.percentage)),
      explanation: `${summary.percentage}% of public review patterns mention this tag.`,
    })),
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

