export type ModerationStatus =
  | "pending"
  | "in_review"
  | "needs_redaction"
  | "needs_more_info"
  | "approved"
  | "partially_approved"
  | "rejected"
  | "escalated"
  | "removed";

export type QueueKey =
  | "reviews"
  | "evidence"
  | "companyResponses"
  | "businessClaims"
  | "correctionRequests"
  | "flaggedContent"
  | "duplicateReports"
  | "appeals";

export type ModerationDashboardData = {
  stats: {
    pendingReviews: number;
    pendingEvidence: number;
    pendingCompanyResponses: number;
    pendingBusinessClaims: number;
    pendingCorrectionRequests: number;
    highRiskSubmissions: number;
    rejectedToday: number;
    publishedToday: number;
  };
  queues: {
    reviews: Array<{
      id: string;
      appName: string;
      title: string;
      displayMode: "anonymous" | "first_name_only";
      rating: number;
      tags: string[];
      submittedAt: string;
      riskFlags: string[];
      status: ModerationStatus;
      assignedModerator: string;
    }>;
    evidence: Array<{ id: string; fileType: string; uploadDate: string; linkedReportId: string; safetyScanStatus: string; moderatorStatus: ModerationStatus }>;
    companyResponses: Array<{ id: string; companyName: string; appName: string; status: ModerationStatus; riskFlags: string[] }>;
    businessClaims: Array<{ id: string; appName: string; representative: string; businessEmail: string; status: ModerationStatus }>;
    correctionRequests: Array<{ id: string; fieldName: string; currentValue: string; proposedValue: string; status: ModerationStatus }>;
    flaggedContent: Array<{ id: string; type: string; reason: string; status: ModerationStatus }>;
    duplicateReports: Array<{ id: string; reportId: string; possibleDuplicateOf: string; status: ModerationStatus }>;
    appeals: Array<{ id: string; reportId: string; reason: string; status: ModerationStatus }>;
  };
  selectedReview: {
    id: string;
    appId: string;
    appName: string;
    title: string;
    body: string;
    rating: number;
    tags: string[];
    submittedAt: string;
    status: ModerationStatus;
    reviewer: {
      displayName: string;
      displayMode: "anonymous" | "first_name_only";
      emailMasked: string;
    };
    riskFlags: string[];
    sensitiveDataFlags: string[];
    evidenceFiles: Array<{ id: string; nameMasked: string; fileType: string; uploadDate: string; safetyScanStatus: string; status: ModerationStatus }>;
    moderationHistory: Array<{ moderator: string; action: string; previousStatus: string; newStatus: string; timestamp: string; note: string; redactionDetails: string }>;
  };
};
