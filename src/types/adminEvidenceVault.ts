export type AdminEvidenceVaultData = {
  stats: {
    pendingEvidence: number;
    sensitiveDataDetected: number;
    redactionRequired: number;
    acceptedForVerification: number;
    rejectedForSafety: number;
    privateOnly: number;
    accessEventsToday: number;
    scheduledForDeletion: number;
  };
  filters: {
    query: string;
    evidenceStatus: string;
    fileType: string;
    sensitiveDataFlag: string;
    uploadedDateRange: { from: string; to: string };
    linkedItemType: string;
    appId: string;
    assignedModerator: string;
    reviewStatus: string;
    retentionStatus: string;
    accessedRecently: boolean;
    requiresSeniorReview: boolean;
  };
  evidenceFiles: Array<{
    id: string;
    maskedFileName: string;
    fileType: "image" | "pdf" | "audio" | "video" | "other";
    linkedItem: { id: string; type: "review" | "report" | "correction_request" | "company_claim"; title: string; publicUrl: string };
    appOrEntityName: string;
    uploadedBy: { type: "user" | "company_representative" | "moderator"; displayNameMasked: string; emailMasked: string };
    uploadedAt: string;
    safetyScanStatus: "pending" | "clean" | "flagged";
    sensitiveDataFlags: string[];
    status: "uploaded" | "scan_pending" | "sensitive_data_detected" | "pending_review" | "redaction_required" | "accepted_for_verification" | "private_only" | "rejected_for_safety" | "deleted" | "scheduled_for_deletion" | "escalated";
    assignedReviewer: string;
    retentionStatus: "active" | "scheduled" | "legal_hold";
  }>;
  selectedEvidence: {
    id: string;
    maskedFileName: string;
    fileType: string;
    fileSizeBytes: number;
    uploadedAt: string;
    uploadedBy: { type: string; displayNameMasked: string; emailMasked: string };
    linkedItems: string[];
    uploadContext: string;
    securePreviewRequired: boolean;
    securePreviewOpened: boolean;
    sensitiveDataFlags: Array<{
      type: string;
      confidence: "low" | "medium" | "high";
      suggestedAction: string;
      publicDisplayAllowed: boolean;
      requiresRedaction: boolean;
      requiresSeniorReview: boolean;
    }>;
    redaction: {
      status: "not_started" | "in_progress" | "completed";
      redactedCopyId: string;
      redactionReasons: string[];
      redactedBy: string;
      redactedAt: string;
    };
    decision: {
      status: string;
      reason: string;
      moderatorNote: string;
      notifyUploader: boolean;
      seniorApprovalRequired: boolean;
    };
    privacyIncident: {
      exists: boolean;
      incidentType: string;
      status: string;
      notes: string[];
    };
    retention: {
      retentionDays: number;
      scheduledDeletionAt: string;
      legalHold: boolean;
      deletionReason: string;
    };
    accessLog: string[];
    internalNotes: string[];
  };
  accessLogs: Array<{
    id: string;
    timestamp: string;
    actorName: string;
    actorRole: string;
    evidenceId: string;
    action: string;
    accessReason: string;
    ipDevicePlaceholder: string;
    result: string;
    internalNote: string;
  }>;
  communicationTemplates: Array<{
    id: string;
    title: string;
    body: string;
  }>;
};
