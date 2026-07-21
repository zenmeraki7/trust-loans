import { ReviewStatus, RiskLevel } from "@prisma/client";

const riskLevelMap: Record<RiskLevel, "low" | "medium" | "high" | "severe"> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  SEVERE_COMPLAINT_PATTERN: "severe",
  UNDER_REVIEW: "medium",
  INSUFFICIENT_DATA: "medium",
};

const reviewStatusMap: Record<ReviewStatus, string> = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_MODERATION: "under_moderation",
  NEEDS_MORE_INFO: "needs_more_info",
  PUBLISHED: "published",
  PARTIALLY_PUBLISHED: "partially_published",
  REJECTED: "rejected",
  REMOVED_BY_USER: "removed_by_user",
  ESCALATED: "under_moderation",
};

export const toDashboardReviewStatus = (status: ReviewStatus) => reviewStatusMap[status];

export const toDashboardRiskLevel = (riskLevel: RiskLevel) => riskLevelMap[riskLevel];

export const toIso = (value?: Date | null) => (value ? value.toISOString() : "");
