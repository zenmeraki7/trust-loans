import type { RiskLevel } from "@prisma/client";

export type ScoreComponentKey =
  | "regulatoryIdentityClarity"
  | "interestFeeTransparency"
  | "grievanceContactAvailability"
  | "privacyDisclosureClarity"
  | "recoveryRelatedComplaints"
  | "contactAccessComplaints"
  | "repeatedHarassmentReports"
  | "appStoreDomainConsistency"
  | "confirmedRegulatoryActions"
  | "complaintResponsiveness";

export type ScoreComponent = {
  key: ScoreComponentKey;
  label: string;
  score: number;
  weight: number;
  explanation: string;
};

export type ScoreBreakdown = {
  appId: string;
  trustScore: number;
  riskLevel: RiskLevel;
  components: ScoreComponent[];
  complaintPatternPercentages: Array<{ tag: string; percentage: number; count: number }>;
  penalties: Array<{ key: string; value: number; explanation: string }>;
  publicNote: string;
  calculatedAt: string;
};

export type ScoringJobName =
  | "score.recalculate.app"
  | "score.recalculate.entity"
  | "score.recalculate.all"
  | "complaint.summary.rebuild"
  | "risk.signal.detect";
