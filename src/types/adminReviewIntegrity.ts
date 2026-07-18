export type AdminReviewIntegrityData = {
  stats: {
    suspiciousReviews: number;
    duplicateCandidates: number;
    spamCandidates: number;
    positiveSpikeAlerts: number;
    negativeSpikeAlerts: number;
    sameDevicePatterns: number;
    sameTextPatterns: number;
    companyLinkedSignals: number;
    reviewsHeldForIntegrity: number;
    casesClosedToday: number;
  };
  filters: {
    query: string;
    signalType: string;
    severity: string;
    confidence: string;
    status: string;
    appId: string;
    riskLevel: string;
    rating: string;
    dateRange: { from: string; to: string };
    assignedModerator: string;
    companyResponseExists: boolean;
    evidenceSubmitted: boolean;
    reviewerVerificationLevel: string;
    sameTextDetected: boolean;
    spikeDetected: boolean;
    escalatedOnly: boolean;
  };
  signals: Array<{
    id: string;
    signalType: string;
    appId: string;
    appName: string;
    reviewCountInvolved: number;
    ratingPattern: string;
    severity: "low" | "medium" | "high";
    confidence: "low" | "medium" | "high";
    detectionReason: string;
    firstDetectedAt: string;
    lastActivityAt: string;
    status: "new" | "under_review" | "needs_moderator_review" | "needs_senior_review" | "confirmed_policy_issue" | "no_action_needed" | "rate_limited" | "reviews_held" | "closed";
    assignedReviewer: string;
  }>;
  selectedSignal: {
    id: string;
    signalType: string;
    summary: string;
    app: { id: string; name: string; riskLevel: "low" | "medium" | "high" | "severe"; trustScore: number };
    involvedReviews: Array<{
      id: string;
      title: string;
      bodyExcerpt: string;
      rating: number;
      reviewerDisplayName: string;
      reviewerEmailMasked: string;
      verificationLevel: string;
      submittedAt: string;
      status: string;
    }>;
    involvedAccounts: string[];
    timeline: string[];
    duplicateComparison: {
      similarityPercent: number;
      sharedTextBlocks: string[];
      sameReviewer: boolean;
      sameApp: boolean;
      submissionTimeDifferenceMinutes: number;
    };
    spikeAnalysis: {
      spikeType: string;
      reviewsBeforeSpike: number;
      reviewsDuringSpike: number;
      ratingDistributionBefore: Record<string, number>;
      ratingDistributionDuring: Record<string, number>;
      verifiedReviewerRatio: number;
      unverifiedReviewerRatio: number;
    };
    reviewerIntegrity: {
      totalReviewsSubmitted: number;
      rejectedReviews: number;
      extremeRatingRatio: number;
      repeatedViolationCount: number;
      accountStatus: string;
    };
    companyLinkedSignal: {
      exists: boolean;
      reason: string;
      companyClaimId: string;
      representativeAccountId: string;
      confidence: "low" | "medium" | "high";
    };
    appIntegritySummary: {
      totalReviews: number;
      reviewsUnderIntegrityReview: number;
      duplicateCandidates: number;
      spamCandidates: number;
      spikeAlerts: number;
      verifiedBorrowerRatio: number;
      anonymousReviewRatio: number;
      rejectedReviewCount: number;
      companyResponses: number;
      correctionDisputeCount: number;
      integrityConfidence: "normal" | "watch" | "needs_review" | "high_integrity_concern";
    };
    decision: {
      decisionType: string;
      reason: string;
      internalNote: string;
      notifyAffectedUser: boolean;
      recalculateAppScore: boolean;
      reprocessPublicStats: boolean;
    };
    auditLog: string[];
  };
  activeRules: Array<{
    id: string;
    ruleName: string;
    ruleType: string;
    threshold: string;
    enabled: boolean;
    severity: "low" | "medium" | "high";
    lastUpdatedAt: string;
  }>;
};
