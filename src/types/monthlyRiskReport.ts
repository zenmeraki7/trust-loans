export type MonthlyRiskReportData = {
  month: string;
  lastUpdatedAt: string;
  metrics: {
    totalReviews: number;
    newComplaintReports: number;
    appsNewlyListed: number;
    reviewsModerated: number;
    companyResponses: number;
    privacyRedactions: number;
    correctionRequestsResolved: number;
  };
  complaintBreakdown: Array<{
    category: string;
    count: number;
    changePercent: number;
  }>;
  risingPatterns: Array<{
    id: string;
    title: string;
    insight: string;
  }>;
  companyActivity: {
    profilesClaimed: number;
    responsesSubmitted: number;
    grievanceDetailsUpdated: number;
    correctionRequestsAccepted: number;
  };
  moderationTransparency: {
    reviewsApproved: number;
    partiallyRedacted: number;
    rejectedForPrivacySafety: number;
    evidenceKeptPrivate: number;
    sensitiveDataRemovals: number;
  };
  safetyTips: string[];
};
