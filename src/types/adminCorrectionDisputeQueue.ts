export type QueueStatus = "new" | "triage" | "under_review" | "more_info_needed" | "accepted" | "partially_accepted" | "rejected" | "escalated" | "closed";
export type Urgency = "normal" | "privacy" | "safety" | "legal";
export type RequestType =
  | "privacy_concern"
  | "review_dispute"
  | "app_detail_correction"
  | "company_entity_correction"
  | "nbfc_relationship_dispute"
  | "duplicate_app_report"
  | "own_review_removal";

export type AdminCorrectionDisputeQueueData = {
  stats: {
    newRequests: number;
    privacyUrgent: number;
    reviewDisputes: number;
    appCompanyCorrections: number;
    duplicateReports: number;
    nbfcRelationshipDisputes: number;
    escalatedCases: number;
    resolvedToday: number;
  };
  filters: {
    query: string;
    requestType: string;
    status: string;
    urgency: string;
    assignedModerator: string;
    dateRange: { from: string; to: string };
    publicItemType: string;
    requesterRole: string;
    hasEvidence: boolean;
    needsSeniorReview: boolean;
    privacySensitive: boolean;
  };
  requests: Array<{
    id: string;
    requestType: RequestType;
    publicItem: { id: string; type: string; title: string; publicUrl: string };
    requester: { role: string; nameMasked: string; emailMasked: string; authorizedRepresentative: boolean };
    urgency: Urgency;
    status: QueueStatus;
    submittedAt: string;
    assignedModerator: string;
    evidenceCount: number;
    privacyFlags: string[];
    lastActivityAt: string;
  }>;
  selectedRequest: {
    id: string;
    requestType: RequestType;
    status: QueueStatus;
    urgency: Urgency;
    publicItem: { id: string; type: string; title: string; publicUrl: string; currentStatus: string };
    requestedCorrection: { currentValue: string; proposedValue: string; explanation: string; sourceUrls: string[] };
    privacyConcern: { flags: string[]; locationDescription: string; remediationStatus: string };
    reviewDispute: { reviewId: string; reviewTitle: string; reviewBody: string; disputeReason: string; requestedAction: string; previousModerationDecision: string };
    duplicateReport: { leftRecord: Record<string, string>; rightRecord: Record<string, string>; mergeRecommendation: string };
    relationshipDispute: { appId: string; entityId: string; currentRelationshipType: string; proposedRelationshipType: string; verificationStatus: string; sourceUrl: string; confidence: "low" | "medium" | "high" };
    requester: { role: string; nameMasked: string; emailMasked: string; organizationName: string; authorizedRepresentative: boolean };
    evidenceFiles: string[];
    relatedRecords: string[];
    similarRequests: string[];
    internalNotes: string[];
    auditLog: Array<{ moderator: string; action: string; statusChange: string; fieldsChanged: string; previousValue: string; newValue: string; reason: string; timestamp: string; notificationSent: boolean }>;
  };
};
