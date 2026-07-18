import type { RiskLevel } from "@/types/loanAppProfile";

export type AdminRiskIntelligenceDashboard = {
  filters: {
    dateRange: { from: string; to: string };
    appId: string;
    companyId: string;
    claimedNbfcPartnerId: string;
    complaintCategory: string;
    riskLevel: string;
    region: string;
    platform: string;
  };
  metrics: Record<
    | "totalReviews"
    | "newComplaintReports"
    | "appsWithRisingComplaints"
    | "highRiskAppsUnderReview"
    | "harassmentReports"
    | "hiddenChargeReports"
    | "dataPrivacyReports"
    | "photoMorphingReports"
    | "companyResponsesReceived"
    | "businessClaimsPending"
    | "reviewsFlaggedForModeration",
    number
  >;
  metricTrends: Record<string, { changePercent: number; direction: "up" | "down" | "flat"; statusLabel: "Stable" | "Rising" | "Needs Review" | "High Priority" }>;
  trends: Record<string, Array<{ date: string; value: number }>>;
  emergingRiskSignals: Array<{
    appId: string;
    appName: string;
    logoUrl: string;
    developerName: string;
    claimedNbfcPartner: string;
    currentRiskLevel: RiskLevel;
    trustScore: number;
    reviewCountChange: number;
    topRisingComplaintTag: string;
    spikePercent: number;
    moderationStatus: "needs_review" | "under_review" | "queued";
  }>;
  complaintCategories: Array<{ key: string; label: string; count: number; percentOfTotal: number; changePercent: number; topApps: string[] }>;
  watchlist: Array<{ appId: string; appName: string; logoUrl: string; riskLevel: RiskLevel; trustScore: number; mainConcern: string; reasonAdded: string; addedBy: string; addedAt: string; lastReviewedAt: string; status: "watching" | "needs_review" | "escalated" | "stable" | "archived" }>;
  companyClusters: Array<{ id: string; clusterName: string; linkedAppCount: number; sharedDetails: string[]; averageTrustScore: number; totalReviews: number; topComplaintTags: string[]; verificationConfidence: "low" | "medium" | "high" }>;
  reviewIntegritySignals: Array<{ id: string; appId: string; appName: string; signalType: string; severity: "low" | "medium" | "high"; description: string; detectedAt: string; status: "open" | "queued" | "resolved" }>;
  regionalSignals: Array<{ region: string; reportCount: number; topComplaintCategory: string; hiddenForPrivacy: boolean }>;
  nbfcClaimMonitoring: Array<{ claimedNbfcPartnerId: string; claimedNbfcPartnerName: string; linkedAppCount: number; complaintVolume: number; verificationStatus: "under_verification" | "verified" | "conflicting_information"; conflictingClaims: number; missingProofCount: number }>;
  moderatorWorkload: {
    pendingByModerator: Array<{ moderator: string; pendingCount: number }>;
    averageModerationTimeHours: number;
    evidenceBacklog: number;
    companyResponseBacklog: number;
    correctionRequestBacklog: number;
    rejectionReasons: Array<{ label: string; count: number }>;
    redactionReasons: Array<{ label: string; count: number }>;
  };
  insightSummary: string[];
};
