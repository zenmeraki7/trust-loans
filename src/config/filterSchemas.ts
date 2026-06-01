import type { FilterSchema } from "@/types/filterEngine";

export const loanAppsDirectoryFilterSchema: FilterSchema = {
  context: "loan_apps_directory",
  searchableFields: ["name", "developerName", "companyName", "claimedNbfcPartner"],
  definitions: [
    { key: "riskLevel", category: "risk_level", type: "multi", label: "Risk Level", fieldPath: "riskLevel", options: [{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }, { label: "Severe", value: "severe" }] },
    { key: "trustScore", category: "trust_score", type: "range", label: "Trust Score", fieldPath: "trustScore" },
    { key: "rating", category: "rating", type: "range", label: "Rating", fieldPath: "averageRating" },
    { key: "complaintType", category: "complaint_type", type: "multi", label: "Complaint Type", fieldPath: "topComplaintTags" },
    { key: "verificationStatus", category: "verification_status", type: "multi", label: "Verification Status", fieldPath: "status" },
    { key: "claimStatus", category: "claim_status", type: "multi", label: "Claim Status", fieldPath: "status" },
    { key: "platform", category: "platform", type: "multi", label: "Platform", fieldPath: "platform" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "lastUpdated" },
  ],
};

export const adminModerationFilterSchema: FilterSchema = {
  context: "admin_moderation",
  searchableFields: ["id", "appName", "title", "assignedModerator"],
  definitions: [
    { key: "reviewStatus", category: "review_status", type: "multi", label: "Review Status", fieldPath: "status" },
    { key: "moderatorStatus", category: "moderator_status", type: "multi", label: "Moderator", fieldPath: "assignedModerator" },
    { key: "privacyFlag", category: "privacy_flag", type: "multi", label: "Privacy Flag", fieldPath: "riskFlags" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "submittedAt" },
  ],
};

export const adminAppDbFilterSchema: FilterSchema = {
  context: "admin_app_db",
  searchableFields: ["name", "packageName", "developerName", "companyName", "claimedNbfcPartner"],
  definitions: [
    { key: "riskLevel", category: "risk_level", type: "multi", label: "Risk Level", fieldPath: "riskLevel" },
    { key: "trustScore", category: "trust_score", type: "range", label: "Trust Score", fieldPath: "trustScore" },
    { key: "verificationStatus", category: "verification_status", type: "multi", label: "Verification Status", fieldPath: "verificationStatus" },
    { key: "claimStatus", category: "claim_status", type: "multi", label: "Claim Status", fieldPath: "claimStatus" },
    { key: "platform", category: "platform", type: "multi", label: "Platform", fieldPath: "platform" },
    { key: "appStoreStatus", category: "app_store_status", type: "multi", label: "App Store Status", fieldPath: "appStoreStatus" },
  ],
};

export const adminRiskIntelligenceFilterSchema: FilterSchema = {
  context: "admin_risk_intelligence",
  searchableFields: ["appName", "developerName", "claimedNbfcPartner", "moderationStatus"],
  definitions: [
    { key: "riskLevel", category: "risk_level", type: "multi", label: "Risk Level", fieldPath: "currentRiskLevel" },
    { key: "trustScore", category: "trust_score", type: "range", label: "Trust Score", fieldPath: "trustScore" },
    { key: "complaintType", category: "complaint_type", type: "multi", label: "Complaint Type", fieldPath: "topRisingComplaintTag" },
    { key: "moderatorStatus", category: "moderator_status", type: "multi", label: "Moderator Status", fieldPath: "moderationStatus" },
  ],
};

export const userDashboardFilterSchema: FilterSchema = {
  context: "user_dashboard",
  searchableFields: ["appName", "reviewTitle", "reviewType"],
  definitions: [
    { key: "reviewStatus", category: "review_status", type: "multi", label: "Review Status", fieldPath: "status" },
    { key: "evidenceStatus", category: "evidence_status", type: "multi", label: "Evidence Status", fieldPath: "evidenceStatus" },
    { key: "rating", category: "rating", type: "range", label: "Rating", fieldPath: "rating" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "submittedAt" },
  ],
};

export const evidenceVaultFilterSchema: FilterSchema = {
  context: "evidence_vault",
  searchableFields: ["id", "maskedFileName", "appOrEntityName", "assignedReviewer"],
  definitions: [
    { key: "evidenceStatus", category: "evidence_status", type: "multi", label: "Evidence Status", fieldPath: "status" },
    { key: "privacyFlag", category: "privacy_flag", type: "multi", label: "Privacy Flag", fieldPath: "sensitiveDataFlags" },
    { key: "moderatorStatus", category: "moderator_status", type: "multi", label: "Moderator Status", fieldPath: "assignedReviewer" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "uploadedAt" },
  ],
};

export const correctionQueueFilterSchema: FilterSchema = {
  context: "correction_queue",
  searchableFields: ["id", "publicItem.title", "requester.role", "assignedModerator"],
  definitions: [
    { key: "reviewStatus", category: "review_status", type: "multi", label: "Request Status", fieldPath: "status" },
    { key: "privacyFlag", category: "privacy_flag", type: "multi", label: "Privacy Flag", fieldPath: "privacyFlags" },
    { key: "duplicateStatus", category: "duplicate_status", type: "multi", label: "Duplicate Status", fieldPath: "requestType" },
    { key: "relationshipType", category: "relationship_type", type: "multi", label: "Relationship Type", fieldPath: "requestType" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "submittedAt" },
  ],
};

export const compareAppsFilterSchema: FilterSchema = {
  context: "compare_apps",
  searchableFields: ["name", "developerName", "companyName", "claimedNbfcPartner"],
  definitions: [
    { key: "riskLevel", category: "risk_level", type: "multi", label: "Risk Level", fieldPath: "riskLevel" },
    { key: "trustScore", category: "trust_score", type: "range", label: "Trust Score", fieldPath: "trustScore" },
    { key: "rating", category: "rating", type: "range", label: "Rating", fieldPath: "averageRating" },
    { key: "complaintType", category: "complaint_type", type: "multi", label: "Complaint Type", fieldPath: "topRisingComplaintTag" },
    { key: "companyResponseStatus", category: "company_response_status", type: "multi", label: "Company Response Status", fieldPath: "publicDetails.companyResponded" },
  ],
};

export const entityProfileFilterSchema: FilterSchema = {
  context: "entity_profile",
  searchableFields: ["name", "displayName", "details.legalName", "linkedApps.name"],
  definitions: [
    { key: "relationshipType", category: "relationship_type", type: "multi", label: "Relationship Type", fieldPath: "linkedApps.relationshipType" },
    { key: "verificationStatus", category: "verification_status", type: "multi", label: "Verification Status", fieldPath: "relationshipEvidence.verificationStatus" },
    { key: "riskLevel", category: "risk_level", type: "multi", label: "Risk Level", fieldPath: "linkedApps.riskLevel" },
    { key: "rating", category: "rating", type: "range", label: "Rating", fieldPath: "mentionedReviews.rating" },
    { key: "dateRange", category: "date_range", type: "date_range", label: "Date Range", fieldPath: "mentionedReviews.createdAt" },
  ],
};

export const complaintTemplateFilterSchema: FilterSchema = {
  context: "complaint_templates",
  searchableFields: ["title", "description", "bestUsedFor"],
  definitions: [
    { key: "complaintType", category: "complaint_type", type: "multi", label: "Complaint Type", fieldPath: "title" },
    { key: "platform", category: "platform", type: "multi", label: "Platform", fieldPath: "outputTypes" },
  ],
};
