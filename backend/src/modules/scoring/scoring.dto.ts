import type { ScoringConfig } from "@prisma/client";
import type { ScoreBreakdown } from "./scoring.types.js";

export const toScoringConfigDto = (config: ScoringConfig) => ({
  id: config.id,
  name: config.name,
  active: config.active,
  weights: {
    regulatoryIdentityClarity: config.publicDetailVerificationWeight,
    interestFeeTransparency: config.hiddenChargeComplaintPenalty,
    grievanceContactAvailability: config.grievanceAvailabilityWeight,
    privacyDisclosureClarity: config.privacyComplaintPenalty,
    recoveryRelatedComplaints: config.complaintSeverityWeight,
    contactAccessComplaints: config.privacyComplaintPenalty,
    repeatedHarassmentReports: config.recentComplaintTrendWeight,
    appStoreDomainConsistency: config.reviewIntegrityWeight,
    confirmedRegulatoryActions: config.staleVerificationPenalty,
    complaintResponsiveness: config.companyResponseWeight,
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
