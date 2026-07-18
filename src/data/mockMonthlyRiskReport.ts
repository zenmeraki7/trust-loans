import type { MonthlyRiskReportData } from "@/types/monthlyRiskReport";

export const monthlyRiskReport: MonthlyRiskReportData = {
  month: "May 2026",
  lastUpdatedAt: "2026-05-31",
  metrics: {
    totalReviews: 58412,
    newComplaintReports: 3246,
    appsNewlyListed: 37,
    reviewsModerated: 4210,
    companyResponses: 214,
    privacyRedactions: 612,
    correctionRequestsResolved: 149,
  },
  complaintBreakdown: [
    { category: "Harassment", count: 1438, changePercent: 18 },
    { category: "Hidden charges", count: 1191, changePercent: 11 },
    { category: "Contact list abuse", count: 882, changePercent: 14 },
    { category: "Data misuse", count: 732, changePercent: 7 },
    { category: "Photo morphing threats", count: 187, changePercent: 22 },
    { category: "Payment not updated", count: 644, changePercent: 9 },
    { category: "Loan not closed", count: 402, changePercent: 6 },
  ],
  risingPatterns: [
    { id: "rp1", title: "Categories increasing", insight: "User-reported harassment and image-threat patterns increased compared with the prior month." },
    { id: "rp2", title: "Apps under review count", insight: "67 apps are currently under review for recurring complaint pattern analysis." },
    { id: "rp3", title: "Regions with rising reports", insight: "Aggregated rise observed in multiple urban regions with privacy thresholds applied." },
    { id: "rp4", title: "Common payment issues", insight: "Payment not updated and loan closure status delays remained frequent user-reported issues." },
  ],
  companyActivity: {
    profilesClaimed: 42,
    responsesSubmitted: 214,
    grievanceDetailsUpdated: 87,
    correctionRequestsAccepted: 39,
  },
  moderationTransparency: {
    reviewsApproved: 3364,
    partiallyRedacted: 508,
    rejectedForPrivacySafety: 338,
    evidenceKeptPrivate: 721,
    sensitiveDataRemovals: 612,
  },
  safetyTips: [
    "Verify repayment channels from official app and website before paying.",
    "Preserve screenshots, receipts, and timestamps when reporting issues.",
    "Avoid sharing OTPs or private documents over unsecured chat channels.",
    "Use grievance and correction channels when details appear outdated or conflicting.",
  ],
};
