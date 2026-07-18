import type { ScoringConfig } from "@prisma/client";
import type { ScoreBreakdown } from "./scoring.types.js";

export const toScoringConfigDto = (config: ScoringConfig) => ({
  id: config.id,
  name: config.name,
  active: config.active,
  weights: {
    averageRating: config.averageRatingWeight,
    reviewVolume: config.reviewVolumeWeight,
    recentComplaintTrend: config.recentComplaintTrendWeight,
    complaintSeverity: config.complaintSeverityWeight,
    verifiedBorrowerSignals: config.verifiedBorrowerWeight,
    companyResponseActivity: config.companyResponseWeight,
    grievanceAvailability: config.grievanceAvailabilityWeight,
    publicDetailVerification: config.publicDetailVerificationWeight,
    reviewIntegrity: config.reviewIntegrityWeight,
  },
  penalties: {
    severeComplaint: config.severeComplaintPenalty,
    privacyComplaint: config.privacyComplaintPenalty,
    hiddenChargeComplaint: config.hiddenChargeComplaintPenalty,
    staleVerification: config.staleVerificationPenalty,
  },
  updatedAt: config.updatedAt,
});

export const toScoreBreakdownDto = (breakdown: ScoreBreakdown) => breakdown;

