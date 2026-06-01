import type { AdminRiskIntelligenceDashboard } from "@/types/adminRiskIntelligence";

export const riskIntelligenceDashboard: AdminRiskIntelligenceDashboard = {
  filters: {
    dateRange: { from: "2026-05-01", to: "2026-05-31" },
    appId: "",
    companyId: "",
    claimedNbfcPartnerId: "",
    complaintCategory: "",
    riskLevel: "",
    region: "",
    platform: "",
  },
  metrics: {
    totalReviews: 58412,
    newComplaintReports: 3246,
    appsWithRisingComplaints: 37,
    highRiskAppsUnderReview: 67,
    harassmentReports: 1438,
    hiddenChargeReports: 1191,
    dataPrivacyReports: 732,
    photoMorphingReports: 187,
    companyResponsesReceived: 214,
    businessClaimsPending: 11,
    reviewsFlaggedForModeration: 406,
  },
  metricTrends: {
    totalReviews: { changePercent: 12, direction: "up", statusLabel: "Rising" },
    newComplaintReports: { changePercent: 18, direction: "up", statusLabel: "Needs Review" },
    appsWithRisingComplaints: { changePercent: 9, direction: "up", statusLabel: "Needs Review" },
    highRiskAppsUnderReview: { changePercent: 3, direction: "up", statusLabel: "High Priority" },
    harassmentReports: { changePercent: 18, direction: "up", statusLabel: "Needs Review" },
    hiddenChargeReports: { changePercent: 11, direction: "up", statusLabel: "Rising" },
    dataPrivacyReports: { changePercent: 7, direction: "up", statusLabel: "Rising" },
    photoMorphingReports: { changePercent: 4, direction: "up", statusLabel: "Needs Review" },
    companyResponsesReceived: { changePercent: 6, direction: "up", statusLabel: "Stable" },
    businessClaimsPending: { changePercent: -2, direction: "down", statusLabel: "Stable" },
    reviewsFlaggedForModeration: { changePercent: 15, direction: "up", statusLabel: "High Priority" },
  },
  trends: {
    reviewsOverTime: [{ date: "2026-05-01", value: 1400 }, { date: "2026-05-10", value: 1700 }, { date: "2026-05-20", value: 1900 }, { date: "2026-05-31", value: 2100 }],
    complaintsOverTime: [{ date: "2026-05-01", value: 420 }, { date: "2026-05-10", value: 560 }, { date: "2026-05-20", value: 620 }, { date: "2026-05-31", value: 740 }],
    harassmentTrend: [{ date: "2026-05-01", value: 180 }, { date: "2026-05-31", value: 260 }],
    hiddenChargesTrend: [{ date: "2026-05-01", value: 150 }, { date: "2026-05-31", value: 210 }],
    dataPrivacyTrend: [{ date: "2026-05-01", value: 95 }, { date: "2026-05-31", value: 130 }],
    photoMorphingTrend: [{ date: "2026-05-01", value: 20 }, { date: "2026-05-31", value: 39 }],
    fakeLegalNoticeTrend: [{ date: "2026-05-01", value: 40 }, { date: "2026-05-31", value: 59 }],
    paymentNotUpdatedTrend: [{ date: "2026-05-01", value: 88 }, { date: "2026-05-31", value: 121 }],
  },
  emergingRiskSignals: [
    { appId: "swift-cash", appName: "SwiftCash Loan", logoUrl: "https://dummyimage.com/48x48/1f2937/ffffff.png&text=SC", developerName: "Swift Fintech Solutions", claimedNbfcPartner: "Example Capital Finance Ltd.", currentRiskLevel: "high", trustScore: 32, reviewCountChange: 144, topRisingComplaintTag: "Threat calls", spikePercent: 38, moderationStatus: "needs_review" },
  ],
  complaintCategories: [
    { key: "harassment", label: "Harassment", count: 1438, percentOfTotal: 44, changePercent: 18, topApps: ["SwiftCash Loan", "QuickRupee"] },
    { key: "hidden_charges", label: "Hidden charges", count: 1191, percentOfTotal: 37, changePercent: 11, topApps: ["QuickRupee", "EasyCredit Now"] },
  ],
  watchlist: [
    { appId: "quick-rupee", appName: "QuickRupee", logoUrl: "https://dummyimage.com/48x48/0f172a/ffffff.png&text=QR", riskLevel: "severe", trustScore: 27, mainConcern: "Rising data misuse and fake notice reports", reasonAdded: "Spike detected", addedBy: "analyst-01", addedAt: "2026-05-29", lastReviewedAt: "2026-05-31", status: "needs_review" },
  ],
  companyClusters: [
    { id: "cluster-1", clusterName: "QR Lending Cluster", linkedAppCount: 4, sharedDetails: ["Shared support domain", "Similar package naming"], averageTrustScore: 33, totalReviews: 4820, topComplaintTags: ["Hidden charges", "Threat calls"], verificationConfidence: "medium" },
  ],
  reviewIntegritySignals: [
    { id: "sig-1", appId: "cash-lane", appName: "CashLane", signalType: "sudden_positive_spike", severity: "medium", description: "Unusual positive rating cluster in short window.", detectedAt: "2026-05-30", status: "open" },
  ],
  regionalSignals: [
    { region: "Karnataka", reportCount: 420, topComplaintCategory: "Harassment", hiddenForPrivacy: false },
    { region: "Small Sample Region", reportCount: 3, topComplaintCategory: "Data misuse", hiddenForPrivacy: true },
  ],
  nbfcClaimMonitoring: [
    { claimedNbfcPartnerId: "nbfc-1", claimedNbfcPartnerName: "Example Capital Finance Ltd.", linkedAppCount: 12, complaintVolume: 2380, verificationStatus: "under_verification", conflictingClaims: 3, missingProofCount: 5 },
  ],
  moderatorWorkload: {
    pendingByModerator: [{ moderator: "mod-anita", pendingCount: 84 }, { moderator: "mod-rahul", pendingCount: 63 }],
    averageModerationTimeHours: 18.4,
    evidenceBacklog: 73,
    companyResponseBacklog: 28,
    correctionRequestBacklog: 19,
    rejectionReasons: [{ label: "private personal data", count: 49 }],
    redactionReasons: [{ label: "phone number masking", count: 112 }],
  },
  insightSummary: [
    "Harassment-related reports increased by 18% compared with the previous period.",
    "5 apps show sudden increases in hidden charge-related reports.",
    "3 app records have conflicting claimed NBFC partner details.",
    "12 reviews require sensitive data redaction before publication.",
    "One developer cluster needs manual verification.",
  ],
};
