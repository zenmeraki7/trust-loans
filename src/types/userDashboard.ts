import type { RiskLevel } from "@/types/loanAppProfile";

export type ReportStatus =
  | "draft"
  | "submitted"
  | "under_moderation"
  | "needs_more_info"
  | "published"
  | "partially_published"
  | "rejected"
  | "removed_by_user";

export type EvidenceStatus =
  | "none"
  | "not_collected";

export type UserDashboardData = {
  user: {
    id: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
  };
  summary: {
    totalReviews: number;
    published: number;
    underModeration: number;
    needsMoreInfo: number;
    rejected: number;
    drafts: number;
    evidenceReminders: number;
  };
  reports: Array<{
    id: string;
    appId: string;
    appName: string;
    appLogoUrl: string;
    reviewTitle: string;
    reviewType: string;
    status: ReportStatus;
    rating: number;
    tags: string[];
    submittedAt: string;
    updatedAt: string;
    evidenceStatus: EvidenceStatus;
    evidenceFiles: string[];
    publicUrl: string;
    moderationNotes: string[];
    privacy: {
      displayMode: "anonymous" | "first_name_only";
    evidencePrivate: boolean;
    };
    timeline: Array<{
      label: string;
      date: string;
      description: string;
    }>;
  }>;
  harassmentCaseFolder: {
    reportId: string;
    reportTitle: string;
    reportStatus: ReportStatus;
    evidenceFiles: string[];
    callLogTimeline: Array<{ date: string; detail: string }>;
    complaintTemplatesUsed: string[];
    grievanceOfficerEmailSent: {
      sent: boolean;
      sentAt: string;
      subject: string;
    };
    cybercrimeComplaintNumber: string;
    rbiCmsComplaintNumber: string;
    companyResponse: {
      available: boolean;
      summary: string;
      respondedAt: string;
    };
    statusTimeline: Array<{ label: string; date: string; note: string }>;
    nextActions: string[];
  };
  evidenceVault: {
    totalReminders: number;
    filesStoredByTrustLoans: number;
    uploadsEnabled: boolean;
    externalSubmissionRequired: boolean;
  };
  savedApps: Array<{
    id: string;
    name: string;
    logoUrl: string;
    riskLevel: RiskLevel;
    trustScore: number;
    latestTrend: string;
  }>;
};
