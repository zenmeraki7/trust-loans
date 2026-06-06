"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { apiLoanAppSchema, type ApiLoanApp, type PaginatedResponse } from "@/types/apiDtos";
import type { AdminCorrectionDisputeQueueData, QueueStatus, RequestType, Urgency } from "@/types/adminCorrectionDisputeQueue";
import type { AdminLoanAppDatabase, ClaimStatus, ProfileStatus, VerificationStatus } from "@/types/adminLoanAppDatabase";
import type { ModerationDashboardData, ModerationStatus } from "@/types/adminModeration";
import type { RiskLevel } from "@/types/loanAppProfile";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";
const adminAuth = { userId: DEV_USER_ID, userRole: "ADMIN" } as const;

type AdminReviewDto = {
  id: string;
  loanAppId?: string | null;
  loanApp?: { id: string; slug: string; name: string } | null;
  title: string;
  body?: string;
  rating: number;
  reviewType?: string;
  status?: string;
  displayMode?: string;
  tags?: string[];
  evidenceSubmitted?: boolean;
  redactionsApplied?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type CorrectionDto = {
  id: string;
  requestType: string;
  status: string;
  publicItemType: string;
  publicItemId: string;
  explanation: string;
  currentValue?: string | null;
  proposedValue?: string | null;
  sourceUrl?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type CreateAdminLoanAppInput = {
  slug: string;
  name: string;
  logoUrl?: string;
  developerName?: string;
  companyName?: string;
  claimedNbfcPartner?: string;
  supportEmail?: string;
  supportPhone?: string;
  grievanceEmail?: string;
  playStoreUrl?: string;
  websiteUrl?: string;
  status?: "DRAFT" | "PUBLISHED" | "UNDER_REVIEW" | "HIDDEN" | "ARCHIVED";
  verificationStatus?: "UNVERIFIED" | "PARTIALLY_VERIFIED" | "VERIFIED" | "UNDER_VERIFICATION" | "CONFLICTING_INFORMATION" | "NEEDS_MANUAL_REVIEW";
  claimStatus?: "UNCLAIMED" | "CLAIM_PENDING" | "CLAIMED" | "DISPUTED_CLAIM";
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "SEVERE_COMPLAINT_PATTERN" | "UNDER_REVIEW" | "INSUFFICIENT_DATA";
  trustScore?: number;
  averageRating?: number;
  reviewCount?: number;
};

const toIso = (value?: string | Date | null) => (value ? new Date(value).toISOString() : "");
const asRiskLevel = (value?: string): RiskLevel => {
  const normalized = value?.toLowerCase();
  if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "severe") return normalized;
  return "medium";
};

const asProfileStatus = (value?: string): ProfileStatus => {
  const normalized = value?.toLowerCase();
  if (normalized === "draft" || normalized === "published" || normalized === "under_review" || normalized === "hidden" || normalized === "archived") return normalized;
  return "under_review";
};

const asVerificationStatus = (value?: string): VerificationStatus => {
  const normalized = value?.toLowerCase();
  if (normalized === "verified" || normalized === "partially_verified" || normalized === "conflicting_information" || normalized === "needs_manual_review") return normalized;
  return "unverified";
};

const asClaimStatus = (value?: string): ClaimStatus => {
  const normalized = value?.toLowerCase();
  if (normalized === "claimed" || normalized === "claim_pending" || normalized === "disputed_claim") return normalized;
  return "unclaimed";
};

const asModerationStatus = (value?: string): ModerationStatus => {
  const normalized = value?.toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "approved" || normalized === "published") return "approved";
  if (normalized === "rejected") return "rejected";
  if (normalized === "redacted" || normalized === "needs_redaction") return "needs_redaction";
  if (normalized === "needs_info" || normalized === "more_information_needed") return "needs_more_info";
  if (normalized === "escalated") return "escalated";
  if (normalized === "removed") return "removed";
  return "in_review";
};

const asQueueStatus = (value?: string): QueueStatus => {
  const normalized = value?.toLowerCase();
  if (normalized === "accepted") return "accepted";
  if (normalized === "rejected") return "rejected";
  if (normalized === "escalated") return "escalated";
  if (normalized === "closed") return "closed";
  if (normalized === "more_information_needed" || normalized === "more_info_needed") return "more_info_needed";
  if (normalized === "under_review") return "under_review";
  return "new";
};

const asRequestType = (value?: string): RequestType => {
  const normalized = value?.toLowerCase();
  if (normalized === "privacy_concern" || normalized === "review_dispute" || normalized === "app_detail_correction" || normalized === "company_entity_correction" || normalized === "nbfc_relationship_dispute" || normalized === "duplicate_app_report" || normalized === "own_review_removal") return normalized;
  return "app_detail_correction";
};

const urgencyForCorrection = (item: CorrectionDto): Urgency => {
  const text = `${item.requestType} ${item.explanation}`.toLowerCase();
  if (text.includes("privacy")) return "privacy";
  if (text.includes("safety") || text.includes("threat")) return "safety";
  if (text.includes("legal")) return "legal";
  return "normal";
};

const emptyFilters: AdminLoanAppDatabase["filters"] = {
  query: "",
  status: "",
  verificationStatus: "",
  claimStatus: "",
  riskLevel: "",
  missingData: [],
};

const buildAdminApps = (items: ApiLoanApp[]): AdminLoanAppDatabase => {
  const apps = items.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug ?? app.id,
    logoUrl: app.logoUrl ?? "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
    packageName: app.packageName ?? "",
    platform: [app.playStoreUrl ? "android" : "website"],
    developerName: app.developerName ?? "Under verification",
    companyName: app.companyName ?? "Under verification",
    claimedNbfcPartner: app.claimedNbfcPartner ?? "Under verification",
    trustScore: app.trustScore,
    riskLevel: asRiskLevel(app.riskLevel),
    reviewCount: app.reviewCount,
    verificationStatus: asVerificationStatus(app.verificationStatus),
    claimStatus: asClaimStatus(app.claimStatus),
    profileStatus: asProfileStatus(app.status),
    lastUpdated: toIso(app.updatedAt).slice(0, 10),
  }));

  const selected = items[0];
  const selectedApp = {
    id: selected?.id ?? "",
    basicIdentity: {
      name: selected?.name ?? "",
      slug: selected?.slug ?? selected?.id ?? "",
      logoUrl: selected?.logoUrl ?? "",
      packageName: selected?.packageName ?? "",
      platform: [selected?.playStoreUrl ? "android" : "website"],
      shortDescription: selected?.summaryNote ?? "Public details are maintained from database records.",
      profileStatus: asProfileStatus(selected?.status),
    },
    companyDetails: {
      developerName: selected?.developerName ?? "",
      legalCompanyName: selected?.companyName ?? "",
      registrationNumber: "",
      website: selected?.websiteUrl ?? "",
      supportEmail: selected?.supportEmail ?? "",
      supportPhone: selected?.supportPhone ?? "",
      registeredAddress: selected?.registeredAddress ?? "",
      sourceUrl: selected?.websiteUrl ?? "",
      verificationStatus: asVerificationStatus(selected?.verificationStatus),
    },
    appStoreLinks: {
      playStoreUrl: selected?.playStoreUrl ?? "",
      appStoreUrl: selected?.appStoreUrl ?? "",
      websiteAppUrl: selected?.websiteUrl ?? "",
      lastCheckedAt: toIso(selected?.updatedAt).slice(0, 10),
      storeAvailabilityStatus: "unknown" as const,
    },
    nbfcPartner: {
      name: selected?.claimedNbfcPartner ?? "",
      website: "",
      rbiRegistrationClaim: "Claimed relationship should be independently verified.",
      relationshipType: "claimed_by_app" as const,
      verificationStatus: asVerificationStatus(selected?.verificationStatus),
      sourceUrl: "",
      lastVerifiedAt: "",
    },
    grievanceOfficer: {
      name: "Public grievance contact",
      email: selected?.grievanceEmail ?? selected?.supportEmail ?? "",
      phone: selected?.supportPhone ?? "",
      address: selected?.registeredAddress ?? "",
      sourceUrl: selected?.websiteUrl ?? "",
      verifiedAt: "",
      publicVisible: Boolean(selected?.grievanceEmail || selected?.supportEmail),
    },
    aliases: [],
    duplicateCandidates: [],
    verificationSources: [],
    riskMetadata: {
      riskLevel: asRiskLevel(selected?.riskLevel),
      trustScore: selected?.trustScore ?? 0,
      complaintVolume: selected?.complaintSummaries?.reduce((sum, item) => sum + item.count, 0) ?? 0,
      reviewCount: selected?.reviewCount ?? 0,
      topComplaintTags: selected?.complaintSummaries?.map((item) => item.tag).slice(0, 5) ?? [],
      harassmentPercent: 0,
      hiddenChargesPercent: 0,
      dataPrivacyPercent: 0,
      recoveryAbusePercent: 0,
      companyResponseStatus: "none" as const,
      manualRiskNote: selected?.publicSafetyNote ?? "",
    },
    auditLog: [],
  };

  return {
    stats: {
      totalApps: apps.length,
      underReview: apps.filter((app) => app.profileStatus === "under_review").length,
      verifiedPublicDetails: apps.filter((app) => app.verificationStatus === "verified").length,
      claimedProfiles: apps.filter((app) => app.claimStatus === "claimed").length,
      duplicateCandidates: 0,
      missingGrievanceDetails: items.filter((app) => !app.grievanceEmail && !app.supportEmail).length,
      missingCompanyDetails: items.filter((app) => !app.companyName).length,
      highRiskComplaintPatterns: apps.filter((app) => app.riskLevel === "high" || app.riskLevel === "severe").length,
    },
    filters: emptyFilters,
    apps,
    selectedApp,
  };
};

const buildModerationDashboard = (reviews: AdminReviewDto[]): ModerationDashboardData => {
  const mappedReviews = reviews.map((review) => ({
    id: review.id,
    appName: review.loanApp?.name ?? review.loanAppId ?? "Unknown app",
    title: review.title,
    displayMode: review.displayMode === "FIRST_NAME_ONLY" ? "first_name_only" as const : "anonymous" as const,
    rating: review.rating,
    tags: review.tags ?? [],
    submittedAt: toIso(review.createdAt),
    riskFlags: [
      ...(review.evidenceSubmitted ? ["evidence_submitted"] : []),
      ...(review.redactionsApplied ? ["redaction_applied"] : []),
    ],
    status: asModerationStatus(review.status),
    assignedModerator: "Unassigned",
  }));
  const first = reviews[0];
  return {
    stats: {
      pendingReviews: mappedReviews.filter((review) => review.status === "pending" || review.status === "in_review").length,
      pendingEvidence: 0,
      pendingCompanyResponses: 0,
      pendingBusinessClaims: 0,
      pendingCorrectionRequests: 0,
      highRiskSubmissions: mappedReviews.filter((review) => review.riskFlags.length > 0).length,
      rejectedToday: mappedReviews.filter((review) => review.status === "rejected").length,
      publishedToday: mappedReviews.filter((review) => review.status === "approved").length,
    },
    queues: {
      reviews: mappedReviews,
      evidence: [],
      companyResponses: [],
      businessClaims: [],
      correctionRequests: [],
      flaggedContent: [],
      duplicateReports: [],
      appeals: [],
    },
    selectedReview: {
      id: first?.id ?? "",
      appId: first?.loanAppId ?? first?.loanApp?.id ?? "",
      appName: first?.loanApp?.name ?? "Unknown app",
      title: first?.title ?? "No review selected",
      body: first?.body ?? "",
      rating: first?.rating ?? 0,
      tags: first?.tags ?? [],
      submittedAt: toIso(first?.createdAt),
      status: asModerationStatus(first?.status),
      reviewer: {
        displayName: "Reviewer",
        displayMode: first?.displayMode === "FIRST_NAME_ONLY" ? "first_name_only" : "anonymous",
        emailMasked: "",
      },
      riskFlags: [],
      sensitiveDataFlags: first?.redactionsApplied ? ["redactions_applied"] : [],
      evidenceFiles: [],
      moderationHistory: [],
    },
  };
};

const buildCorrectionQueue = (items: CorrectionDto[]): AdminCorrectionDisputeQueueData => {
  const requests = items.map((item) => ({
    id: item.id,
    requestType: asRequestType(item.requestType),
    publicItem: {
      id: item.publicItemId,
      type: item.publicItemType,
      title: `${item.publicItemType.replaceAll("_", " ")} ${item.publicItemId}`,
      publicUrl: "",
    },
    requester: { role: "user", nameMasked: "Requester", emailMasked: "", authorizedRepresentative: false },
    urgency: urgencyForCorrection(item),
    status: asQueueStatus(item.status),
    submittedAt: toIso(item.createdAt),
    assignedModerator: "Unassigned",
    evidenceCount: item.sourceUrl ? 1 : 0,
    privacyFlags: urgencyForCorrection(item) === "privacy" ? ["privacy_sensitive"] : [],
    lastActivityAt: toIso(item.updatedAt),
  }));
  const first = items[0];
  return {
    stats: {
      newRequests: requests.filter((request) => request.status === "new").length,
      privacyUrgent: requests.filter((request) => request.urgency === "privacy").length,
      reviewDisputes: requests.filter((request) => request.requestType === "review_dispute").length,
      appCompanyCorrections: requests.filter((request) => request.requestType === "app_detail_correction" || request.requestType === "company_entity_correction").length,
      duplicateReports: requests.filter((request) => request.requestType === "duplicate_app_report").length,
      nbfcRelationshipDisputes: requests.filter((request) => request.requestType === "nbfc_relationship_dispute").length,
      escalatedCases: requests.filter((request) => request.status === "escalated").length,
      resolvedToday: requests.filter((request) => request.status === "accepted" || request.status === "rejected").length,
    },
    filters: {
      query: "",
      requestType: "",
      status: "",
      urgency: "",
      assignedModerator: "",
      dateRange: { from: "", to: "" },
      publicItemType: "",
      requesterRole: "",
      hasEvidence: false,
      needsSeniorReview: false,
      privacySensitive: false,
    },
    requests,
    selectedRequest: {
      id: first?.id ?? "",
      requestType: asRequestType(first?.requestType),
      status: asQueueStatus(first?.status),
      urgency: first ? urgencyForCorrection(first) : "normal",
      publicItem: { id: first?.publicItemId ?? "", type: first?.publicItemType ?? "", title: first?.publicItemId ?? "", publicUrl: "", currentStatus: "published" },
      requestedCorrection: {
        currentValue: first?.currentValue ?? "",
        proposedValue: first?.proposedValue ?? "",
        explanation: first?.explanation ?? "",
        sourceUrls: first?.sourceUrl ? [first.sourceUrl] : [],
      },
      privacyConcern: { flags: first && urgencyForCorrection(first) === "privacy" ? ["privacy_sensitive"] : [], locationDescription: "", remediationStatus: "" },
      reviewDispute: { reviewId: first?.publicItemId ?? "", reviewTitle: "", reviewBody: "", disputeReason: first?.explanation ?? "", requestedAction: first?.requestType ?? "", previousModerationDecision: "" },
      duplicateReport: { leftRecord: {}, rightRecord: {}, mergeRecommendation: "" },
      relationshipDispute: { appId: "", entityId: "", currentRelationshipType: "", proposedRelationshipType: "", verificationStatus: "", sourceUrl: first?.sourceUrl ?? "", confidence: "medium" },
      requester: { role: "user", nameMasked: "Requester", emailMasked: "", organizationName: "", authorizedRepresentative: false },
      evidenceFiles: first?.sourceUrl ? [first.sourceUrl] : [],
      relatedRecords: [],
      similarRequests: [],
      internalNotes: [],
      auditLog: [],
    },
  };
};

export function useAdminLoanAppDatabase() {
  return useQuery({
    queryKey: ["adminLoanAppDatabase"],
    queryFn: async () => {
      const response = await apiClient<PaginatedResponse<ApiLoanApp> & { count?: number }>("/api/apps?limit=100", adminAuth);
      return buildAdminApps(response.items.map((item) => apiLoanAppSchema.parse(item)));
    },
  });
}

export function useCreateAdminLoanApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminLoanAppInput) =>
      apiClient<ApiLoanApp>("/api/apps", {
        ...adminAuth,
        method: "POST",
        body: {
          status: "PUBLISHED",
          verificationStatus: "UNDER_VERIFICATION",
          claimStatus: "UNCLAIMED",
          riskLevel: "UNDER_REVIEW",
          trustScore: 50,
          averageRating: 0,
          reviewCount: 0,
          ...input,
        },
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["adminLoanAppDatabase"] }),
  });
}

export function useAdminModerationDashboard() {
  return useQuery({
    queryKey: ["adminModerationDashboard"],
    queryFn: async () => {
      const response = await apiClient<PaginatedResponse<AdminReviewDto> & { count?: number }>("/api/admin/moderation/reviews?limit=100", adminAuth);
      return buildModerationDashboard(response.items ?? []);
    },
  });
}

export function useAdminCorrectionDisputeQueue() {
  return useQuery({
    queryKey: ["adminCorrectionDisputeQueue"],
    queryFn: async () => {
      const response = await apiClient<PaginatedResponse<CorrectionDto> & { count?: number }>("/api/admin/corrections?limit=100", adminAuth);
      return buildCorrectionQueue(response.items ?? []);
    },
  });
}
