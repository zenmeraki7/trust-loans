export type AdminPlatformSettingsData = {
  status: {
    activeScoringVersion: string;
    draftConfigurationVersion: string;
    lastPublishedAt: string;
    lastPublishedBy: string;
    pendingChanges: number;
    rulesRequiringReview: number;
    privacyRulesEnabled: boolean;
    auditLoggingEnabled: boolean;
  };
  trustScore: {
    averageRatingWeight: number;
    reviewVolumeWeight: number;
    recentReviewWeight: number;
    complaintSeverityWeight: number;
    companyResponseWeight: number;
    verifiedBorrowerWeight: number;
    grievanceDetailsWeight: number;
    publicDetailVerificationWeight: number;
    reviewIntegrityPenaltyWeight: number;
    recencyDecayFactor: number;
  };
  riskLabels: Array<{
    key: string;
    label: string;
    minScore: number;
    maxScore: number;
    displayColor: string;
    publicExplanation: string;
    internalDescription: string;
    requiresManualReview: boolean;
    hideScoreIfInsufficientData: boolean;
  }>;
  complaintWeights: Array<{
    key: string;
    label: string;
    severity: "low" | "medium" | "high" | "severe";
    weightPoints: number;
    moderatorGuidance: string;
    requiresEvidenceReview: boolean;
    requiresPrivacyScan: boolean;
    escalationThreshold: number;
  }>;
  reviewModeration: Record<string, boolean>;
  privacyRedaction: Record<string, boolean>;
  evidenceHandling: {
    privateByDefault: boolean;
    allowedFileTypes: string[];
    maxFileSizeMb: number;
    virusScanRequired: boolean;
    sensitiveContentScanRequired: boolean;
    visibleToRoles: string[];
    companyCanAccessEvidence: boolean;
    retentionDays: number;
    unsafeEvidenceDeletionWorkflow: boolean;
  };
  companyResponses: {
    requireVerifiedCompany: boolean;
    requireModeration: boolean;
    allowOfficialContactChannel: boolean;
    blockBorrowerPersonalDetails: boolean;
    blockThreatsOrLegalIntimidation: boolean;
    blockPrivateLoanDetails: boolean;
    allowedResponseCategories: string[];
  };
  userVerification: {
    requireEmailBeforePublishing: boolean;
    allowAnonymousDisplay: boolean;
    requireEvidenceForVerifiedBorrower: boolean;
    preventDuplicateReviewsPerApp: boolean;
    reviewCooldownHours: number;
    rateLimitSubmissions: boolean;
  };
  reviewIntegrity: {
    repeatedTextDetection: boolean;
    spikeDetection: boolean;
    ipDevicePatternPlaceholder: boolean;
    sameEmailDomainPattern: boolean;
    shortPeriodVolumeDetection: boolean;
    companyEmployeeSuspicion: boolean;
    integrityFlagActions: string[];
  };
  publicDisplay: {
    showTrustScore: boolean;
    showRiskLabel: boolean;
    showReviewCount: boolean;
    showComplaintPercentages: boolean;
    showCompanyResponseBadge: boolean;
    showGrievanceDetails: boolean;
    showClaimedNbfcPartner: boolean;
    showVerificationStatus: boolean;
    showPublicDisclaimer: boolean;
    showRedactionModerationNote: boolean;
    hideLowSamplePercentages: boolean;
    regionalPrivacyThreshold: number;
  };
  notifications: { userEvents: string[]; adminEvents: string[]; channels: string[] };
  auditVersions: Array<{
    version: string;
    changedBy: string;
    changedAt: string;
    changeSummary: string;
    approvalStatus: "draft" | "approved" | "rejected";
    publishedStatus: "published" | "unpublished";
  }>;
  impactPreview: {
    appsAffected: number;
    riskLabelsChanged: number;
    trustScoresChanged: number;
    reviewsRequiringReprocessing: number;
    publicPagesAffected: number;
    moderationWorkloadImpact: string;
    warnings: string[];
  };
};
