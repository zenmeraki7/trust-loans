import { reviews as seedReviews } from "@/data/mockLoanAppProfile";
import type { Review } from "@/types/loanAppProfile";
import type { ReviewSubmission } from "@/types/reviewSubmission";

export type ModerationStatus = "pending" | "approved" | "rejected" | "redacted" | "needs_info";

export type CompanyResponse = {
  body: string;
  respondedAt: string;
  responderName: string;
};

export type ReviewRecord = Review & {
  appId: string;
  moderationStatus: ModerationStatus;
  privacyMode: "anonymous" | "first_name_only" | "verified_badge_only";
  incidentAnswers: {
    repaymentDelayed: boolean | null;
    contactedRelatives: boolean | null;
    threatened: boolean | null;
    accessedContacts: boolean | null;
    misusedPhotos: boolean | null;
    claimedNbfcRepresentation: boolean | null;
    fakeLegalNotice: boolean | null;
    abusiveLanguage: boolean | null;
  };
  helpfulVotes: number;
  reportCount: number;
  reportedReasons: string[];
  companyResponse: CompanyResponse | null;
  createdAt: string;
  updatedAt: string;
};

const nowIso = () => new Date().toISOString();

const seeded: ReviewRecord[] = seedReviews.map((review) => ({
  ...review,
  appId: "swift-cash",
  moderationStatus: "approved",
  privacyMode: "first_name_only",
  incidentAnswers: {
    repaymentDelayed: null,
    contactedRelatives: null,
    threatened: null,
    accessedContacts: null,
    misusedPhotos: null,
    claimedNbfcRepresentation: null,
    fakeLegalNotice: null,
    abusiveLanguage: null,
  },
  helpfulVotes: review.helpfulCount,
  reportCount: 0,
  reportedReasons: [],
  companyResponse: null,
  createdAt: review.createdAt,
  updatedAt: nowIso(),
}));

const reviewsDb = new Map<string, ReviewRecord>(seeded.map((review) => [review.id, review]));

export const listReviews = () => Array.from(reviewsDb.values());

export const findReviewById = (id: string) => reviewsDb.get(id) || null;

export const listReviewsByApp = (appId: string) => listReviews().filter((review) => review.appId === appId);

export const createReview = (payload: ReviewSubmission) => {
  const id = `rev-${Date.now()}`;
  const created = nowIso();
  const review: ReviewRecord = {
    id,
    appId: payload.appId,
    reviewerName: payload.privacy.displayName || "Anonymous User",
    isVerifiedBorrower: false,
    rating: payload.rating.overall,
    title: payload.title,
    body: payload.body,
    tags: payload.tags,
    createdAt: created,
    helpfulCount: 0,
    moderationStatus: "pending",
    privacyMode: payload.privacy.displayMode,
    incidentAnswers: {
      repaymentDelayed: payload.repaymentDelayed,
      contactedRelatives: payload.contactedRelatives,
      threatened: payload.threatened,
      accessedContacts: payload.accessedContacts,
      misusedPhotos: payload.misusedPhotos,
      claimedNbfcRepresentation: payload.claimedNbfcRepresentation,
      fakeLegalNotice: payload.fakeLegalNotice,
      abusiveLanguage: payload.abusiveLanguage,
    },
    helpfulVotes: 0,
    reportCount: 0,
    reportedReasons: [],
    companyResponse: null,
    updatedAt: created,
  };
  reviewsDb.set(id, review);
  return review;
};

export const updateReview = (id: string, patch: Partial<ReviewRecord>) => {
  const existing = findReviewById(id);
  if (!existing) return null;

  const updated: ReviewRecord = {
    ...existing,
    ...patch,
    id: existing.id,
    appId: existing.appId,
    updatedAt: nowIso(),
  };
  reviewsDb.set(id, updated);
  return updated;
};

export const deleteReview = (id: string) => reviewsDb.delete(id);

export const addHelpfulVote = (id: string) => {
  const review = findReviewById(id);
  if (!review) return null;
  return updateReview(id, {
    helpfulVotes: review.helpfulVotes + 1,
    helpfulCount: review.helpfulCount + 1,
  });
};

export const reportReview = (id: string, reason: string) => {
  const review = findReviewById(id);
  if (!review) return null;
  return updateReview(id, {
    reportCount: review.reportCount + 1,
    reportedReasons: Array.from(new Set([...review.reportedReasons, reason])),
  });
};

export const listModerationQueue = () =>
  listReviews().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const approveReview = (id: string) => updateReview(id, { moderationStatus: "approved" });

export const rejectReview = (id: string, reason?: string) =>
{
  const review = findReviewById(id);
  if (!review) return null;
  return updateReview(id, {
    moderationStatus: "rejected",
    reportedReasons: reason ? Array.from(new Set([...review.reportedReasons, reason])) : review.reportedReasons,
  });
};

export const redactReview = (id: string, redactionNote?: string) => {
  const existing = findReviewById(id);
  if (!existing) return null;
  return updateReview(id, {
    moderationStatus: "redacted",
    body: redactionNote ? `[Redacted by moderation] ${redactionNote}` : "[Redacted by moderation for privacy/safety]",
  });
};

export const requestInfoReview = (id: string, note?: string) =>
{
  const review = findReviewById(id);
  if (!review) return null;
  return updateReview(id, {
    moderationStatus: "needs_info",
    reportedReasons: note ? Array.from(new Set([...review.reportedReasons, note])) : review.reportedReasons,
  });
};
