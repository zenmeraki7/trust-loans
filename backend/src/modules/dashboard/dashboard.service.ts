import { ComplaintDraftStatus, Prisma, ReviewStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { toDashboardReviewStatus, toDashboardRiskLevel, toIso } from "./dashboard.dto.js";

const openCaseStatuses = ["OPEN", "WAITING_FOR_RESPONSE", "ACTION_NEEDED"] as const;

type DashboardCase = Prisma.HarassmentCaseGetPayload<{
  include: { timelineItems: true; checklistItems: true; externalComplaints: true };
}>;

const emptyCaseFolder = {
  reportId: "",
  reportTitle: "No active harassment case folder",
  reportStatus: "draft",
  evidenceFiles: [],
  callLogTimeline: [],
  complaintTemplatesUsed: [],
  grievanceOfficerEmailSent: { sent: false, sentAt: "", subject: "" },
  cybercrimeComplaintNumber: "",
  rbiCmsComplaintNumber: "",
  companyResponse: { available: false, summary: "No company response linked to a case folder yet.", respondedAt: "" },
  statusTimeline: [],
  nextActions: ["Submit a review or report to start a case folder."],
};

export const dashboardService = {
  async getUserDashboard(userId: string) {
    const [user, reviews, draftCount, activeCase] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.review.findMany({
        where: { userId },
        include: {
          loanApp: true,
          companyResponses: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.complaintDraft.count({ where: { userId, status: { not: ComplaintDraftStatus.DELETED } } }),
      prisma.harassmentCase.findFirst({
        where: { userId, status: { in: [...openCaseStatuses] } },
        include: { timelineItems: true, checklistItems: true, externalComplaints: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const reports = reviews.map((review) => ({
      id: review.id,
      appId: review.loanAppId,
      appName: review.loanApp.name,
      appLogoUrl: review.loanApp.logoUrl ?? "https://dummyimage.com/64x64/111827/ffffff.png&text=APP",
      reviewTitle: review.title,
      reviewType: review.reviewType,
      status: toDashboardReviewStatus(review.status),
      rating: review.rating,
      tags: review.tags,
      submittedAt: toIso(review.createdAt),
      updatedAt: toIso(review.updatedAt),
      evidenceStatus: "not_collected",
      evidenceFiles: [],
      publicUrl: `/reviews/${review.id}`,
      moderationNotes: moderationNotesForStatus(review.status, review.redactionsApplied),
      privacy: {
        displayMode: review.displayMode === "FIRST_NAME_ONLY" ? "first_name_only" : "anonymous",
        evidencePrivate: true,
      },
      timeline: reviewTimeline(review.status, review.createdAt, review.updatedAt, review.publishedAt),
    }));

    const savedApps = Array.from(new Map(reviews.map((review) => [review.loanApp.id, review.loanApp])).values()).slice(0, 4).map((app) => ({
      id: app.slug,
      name: app.name,
      logoUrl: app.logoUrl ?? "https://dummyimage.com/64x64/111827/ffffff.png&text=APP",
      riskLevel: toDashboardRiskLevel(app.riskLevel),
      trustScore: app.trustScore,
      latestTrend: "Linked to your submitted reviews or reports.",
    }));

    return {
      user: {
        id: userId,
        displayName: user?.name ?? "Current user",
        email: user?.email ?? "Private",
        emailVerified: Boolean(user?.emailVerified),
      },
      summary: {
        totalReviews: reviews.length,
        published: reviews.filter((review) => review.status === ReviewStatus.PUBLISHED || review.status === ReviewStatus.PARTIALLY_PUBLISHED).length,
        underModeration: reviews.filter((review) => ["SUBMITTED", "UNDER_MODERATION", "ESCALATED"].includes(review.status)).length,
        needsMoreInfo: reviews.filter((review) => review.status === ReviewStatus.NEEDS_MORE_INFO).length,
        rejected: reviews.filter((review) => review.status === ReviewStatus.REJECTED).length,
        drafts: reviews.filter((review) => review.status === ReviewStatus.DRAFT).length + draftCount,
        evidenceReminders: 0,
      },
      reports,
      harassmentCaseFolder: activeCase ? mapCaseFolder(activeCase) : emptyCaseFolder,
      evidenceVault: {
        totalReminders: 0,
        filesStoredByTrustLoans: 0,
        uploadsEnabled: false,
        externalSubmissionRequired: true,
      },
      savedApps,
    };
  },
};

function moderationNotesForStatus(status: ReviewStatus, redactionsApplied: boolean) {
  if (status === ReviewStatus.NEEDS_MORE_INFO) return ["Moderator requested more information before publication."];
  if (status === ReviewStatus.REJECTED) return ["Review was not published after moderation."];
  if (redactionsApplied) return ["Sensitive details were redacted before publication."];
  return [];
}

function reviewTimeline(status: ReviewStatus, createdAt: Date, updatedAt: Date, publishedAt?: Date | null) {
  const items = [{ label: "Review submitted", date: toIso(createdAt), description: "Your review was received by Trust Loans." }];
  if (publishedAt) items.push({ label: "Review published", date: toIso(publishedAt), description: "Your review is visible publicly with privacy controls." });
  if (status === ReviewStatus.NEEDS_MORE_INFO) items.push({ label: "More information requested", date: toIso(updatedAt), description: "Please review moderator feedback." });
  if (status === ReviewStatus.REJECTED) items.push({ label: "Review rejected", date: toIso(updatedAt), description: "The review was not published due to moderation policy." });
  return items;
}

function mapCaseFolder(item: DashboardCase) {
  const cybercrime = item.externalComplaints.find((entry) => entry.channel === "CYBERCRIME_PORTAL");
  const rbi = item.externalComplaints.find((entry) => entry.channel === "RBI_CMS");
  const callLogTimeline = item.timelineItems
    .filter((entry) => ["CALL_RECEIVED", "THREAT_RECEIVED", "RELATIVE_CONTACTED", "OFFICE_CONTACTED"].includes(entry.type))
    .map((entry) => ({ date: toIso(entry.happenedAt ?? entry.createdAt), detail: entry.title }));
  const statusTimeline = item.timelineItems.map((entry) => ({ label: entry.title, date: toIso(entry.happenedAt ?? entry.createdAt), note: entry.description ?? entry.type }));
  const nextActions = item.checklistItems.filter((entry) => !entry.completed).slice(0, 5).map((entry) => entry.label);

  return {
    reportId: item.linkedReviewId ?? item.id,
    reportTitle: item.title,
    reportStatus: item.status === "ARCHIVED" ? "removed_by_user" : "under_moderation",
    evidenceFiles: item.linkedEvidenceFileIds,
    callLogTimeline,
    complaintTemplatesUsed: item.linkedComplaintDraftIds,
    grievanceOfficerEmailSent: { sent: false, sentAt: "", subject: "" },
    cybercrimeComplaintNumber: cybercrime?.complaintNumber ?? "",
    rbiCmsComplaintNumber: rbi?.complaintNumber ?? "",
    companyResponse: { available: false, summary: "No company response linked to this case folder yet.", respondedAt: "" },
    statusTimeline,
    nextActions: nextActions.length ? nextActions : ["Update your case folder when new evidence or complaint numbers are available."],
  };
}
