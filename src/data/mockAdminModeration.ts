import type { ModerationDashboardData } from "@/types/adminModeration";

export const moderationDashboard: ModerationDashboardData = {
  stats: {
    pendingReviews: 124,
    pendingEvidence: 73,
    pendingCompanyResponses: 28,
    pendingBusinessClaims: 11,
    pendingCorrectionRequests: 19,
    highRiskSubmissions: 37,
    rejectedToday: 14,
    publishedToday: 52,
  },
  queues: {
    reviews: [
      {
        id: "REP-10021",
        appName: "SwiftCash Loan",
        title: "Threat calls after repayment delay",
        displayMode: "anonymous",
        rating: 1,
        tags: ["Threat calls", "Harassment"],
        submittedAt: "2026-05-30",
        riskFlags: ["contains_private_phone_number", "legal_accusation"],
        status: "pending",
        assignedModerator: "mod-anita",
      },
      {
        id: "REP-10022",
        appName: "QuickRupee",
        title: "Payment updated late",
        displayMode: "first_name_only",
        rating: 2,
        tags: ["Payment not updated"],
        submittedAt: "2026-05-30",
        riskFlags: [],
        status: "in_review",
        assignedModerator: "mod-rahul",
      },
    ],
    evidence: [
      { id: "EVD-9001", fileType: "image/png", uploadDate: "2026-05-30", linkedReportId: "REP-10021", safetyScanStatus: "flagged_phone_number", moderatorStatus: "pending" },
    ],
    companyResponses: [
      { id: "CR-101", companyName: "Swift Fintech Solutions", appName: "SwiftCash Loan", status: "pending", riskFlags: ["possible_legal_intimidation"] },
    ],
    businessClaims: [
      { id: "BC-220", appName: "SwiftCash Loan", representative: "Priya Sharma", businessEmail: "official@swiftfintech.com", status: "in_review" },
    ],
    correctionRequests: [
      { id: "COR-72", fieldName: "Claimed NBFC partner", currentValue: "Under verification", proposedValue: "Example Capital Finance Ltd.", status: "pending" },
    ],
    flaggedContent: [
      { id: "FLG-11", type: "review", reason: "possible doxxing", status: "pending" },
    ],
    duplicateReports: [
      { id: "DUP-8", reportId: "REP-10021", possibleDuplicateOf: "REP-9840", status: "pending" },
    ],
    appeals: [{ id: "APL-4", reportId: "REP-9321", reason: "User requested re-review after redaction", status: "in_review" }],
  },
  selectedReview: {
    id: "REP-10021",
    appId: "swift-cash",
    appName: "SwiftCash Loan",
    title: "Threat calls after repayment delay",
    body: "I received repeated calls. A private phone number and unverified legal threat text were included in original submission.",
    rating: 1,
    tags: ["Threat calls", "Harassment"],
    submittedAt: "2026-05-30",
    status: "pending",
    reviewer: {
      displayName: "User 4821",
      displayMode: "anonymous",
      emailMasked: "u***@mail.com",
    },
    riskFlags: ["contains_sensitive_phone", "legal_accusation", "possible_doxxing"],
    sensitiveDataFlags: ["private_phone_number", "direct_criminal_accusation"],
    evidenceFiles: [
      { id: "EVD-9001", nameMasked: "chat_****21.png", fileType: "image/png", uploadDate: "2026-05-30", safetyScanStatus: "flagged_phone_number", status: "pending" },
    ],
    moderationHistory: [
      {
        moderator: "mod-anita",
        action: "queue_created",
        previousStatus: "submitted",
        newStatus: "pending",
        timestamp: "2026-05-30T10:40:00Z",
        note: "Queued by policy engine.",
        redactionDetails: "none",
      },
    ],
  },
};
