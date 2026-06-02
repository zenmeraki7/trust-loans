import { ProfileStatus, ReviewStatus, type LoanApp, type ComplaintSummary, type Review, type CompanyResponse } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

type CompareReview = Pick<Review, "rating" | "tags"> & {
  companyResponses: Array<Pick<CompanyResponse, "status">>;
};

type CompareLoanAppRecord = LoanApp & {
  complaintSummaries: ComplaintSummary[];
  reviews: CompareReview[];
};

const publishedStatuses = [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED];

const riskLevelMap = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  SEVERE_COMPLAINT_PATTERN: "severe",
  UNDER_REVIEW: "medium",
  INSUFFICIENT_DATA: "medium",
} as const;

const statusForApp = (app: LoanApp, companyResponded: boolean) => {
  if (companyResponded) return "company_responded";
  if (app.claimStatus === "CLAIMED") return "claimed";
  if (app.claimStatus === "CLAIM_PENDING" || app.claimStatus === "DISPUTED_CLAIM") return "under_review";
  return "unclaimed";
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const summaryPercent = (app: CompareLoanAppRecord, terms: string[]) => {
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const matched = app.complaintSummaries.find((summary) => {
    const tag = summary.tag.toLowerCase();
    return lowerTerms.some((term) => tag.includes(term));
  });
  if (matched) return clampPercent(matched.percentage);

  if (app.reviews.length === 0) return 0;
  const matchedReviews = app.reviews.filter((review) =>
    review.tags.some((tag) => {
      const lower = tag.toLowerCase();
      return lowerTerms.some((term) => lower.includes(term));
    }),
  );
  return clampPercent((matchedReviews.length / app.reviews.length) * 100);
};

const qualityScore = (complaintPercent: number, fallback: number) => clampPercent(applyFinite(100 - complaintPercent, fallback));

const applyFinite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

const distributionPercent = (reviews: CompareReview[], star: number) => {
  if (reviews.length === 0) return 0;
  return clampPercent((reviews.filter((review) => review.rating === star).length / reviews.length) * 100);
};

const toCompareItem = (app: CompareLoanAppRecord) => {
  const harassment = summaryPercent(app, ["harassment", "threat", "abusive"]);
  const contactListAbuse = summaryPercent(app, ["contact", "relative", "office"]);
  const hiddenCharges = summaryPercent(app, ["hidden", "charge", "fee"]);
  const dataMisuse = summaryPercent(app, ["data", "privacy"]);
  const fakeLegalNotice = summaryPercent(app, ["fake legal", "legal notice"]);
  const photoMorphing = summaryPercent(app, ["photo", "morph"]);
  const paymentNotUpdated = summaryPercent(app, ["payment", "not updated"]);
  const loanNotClosed = summaryPercent(app, ["loan not closed", "closure"]);
  const companyResponded = app.reviews.some((review) => review.companyResponses.some((response) => response.status === "APPROVED"));
  const hasGrievance = Boolean(app.grievanceEmail || app.supportEmail || app.supportPhone);

  return {
    id: app.id,
    name: app.name,
    logoUrl: app.logoUrl ?? "/images/default-app-logo.svg",
    developerName: app.developerName ?? "Unknown developer",
    companyName: app.companyName ?? "Unknown company",
    claimedNbfcPartner: app.claimedNbfcPartner ?? "Not available",
    riskLevel: riskLevelMap[app.riskLevel],
    status: statusForApp(app, companyResponded),
    trustScore: app.trustScore,
    averageRating: app.averageRating,
    reviewCount: app.reviewCount,
    profileUrl: `/loan-apps/${app.slug}`,
    scores: {
      harassment: qualityScore(harassment, app.trustScore),
      hiddenCharges: qualityScore(hiddenCharges, app.trustScore),
      dataPrivacy: qualityScore(dataMisuse, app.trustScore),
      recoveryBehaviour: qualityScore(Math.max(harassment, contactListAbuse), app.trustScore),
      customerSupport: qualityScore(paymentNotUpdated, app.trustScore),
      transparency: qualityScore(hiddenCharges, app.trustScore),
      grievanceResponse: hasGrievance ? 80 : 30,
    },
    complaintPatterns: {
      harassmentReportsPercent: harassment,
      contactListAbusePercent: contactListAbuse,
      hiddenChargesPercent: hiddenCharges,
      dataMisusePercent: dataMisuse,
      fakeLegalNoticePercent: fakeLegalNotice,
      photoMorphingPercent: photoMorphing,
      paymentNotUpdatedPercent: paymentNotUpdated,
      loanNotClosedPercent: loanNotClosed,
    },
    ratingDistribution: {
      fiveStar: distributionPercent(app.reviews, 5),
      fourStar: distributionPercent(app.reviews, 4),
      threeStar: distributionPercent(app.reviews, 3),
      twoStar: distributionPercent(app.reviews, 2),
      oneStar: distributionPercent(app.reviews, 1),
    },
    publicDetails: {
      nbfcPartnerAvailable: Boolean(app.claimedNbfcPartner),
      grievanceOfficerAvailable: hasGrievance,
      companyResponded,
      lastUpdated: app.updatedAt.toISOString().slice(0, 10),
    },
  };
};

export const compareService = {
  async list(ids: string[] = []) {
    const requested = ids.map((id) => id.trim()).filter(Boolean).slice(0, 3);
    const apps = await prisma.loanApp.findMany({
      where:
        requested.length > 0
          ? { OR: [{ id: { in: requested } }, { slug: { in: requested } }], status: { not: ProfileStatus.ARCHIVED } }
          : { status: { not: ProfileStatus.ARCHIVED } },
      take: requested.length > 0 ? undefined : 3,
      orderBy: [{ trustScore: "desc" }, { reviewCount: "desc" }, { updatedAt: "desc" }],
      include: {
        complaintSummaries: true,
        reviews: {
          where: { status: { in: publishedStatuses } },
          select: {
            rating: true,
            tags: true,
            companyResponses: {
              where: { status: "APPROVED" },
              select: { status: true },
            },
          },
        },
      },
    });

    const sorted =
      requested.length === 0
        ? apps
        : [...apps].sort((a, b) => {
            const left = requested.indexOf(a.id) >= 0 ? requested.indexOf(a.id) : requested.indexOf(a.slug);
            const right = requested.indexOf(b.id) >= 0 ? requested.indexOf(b.id) : requested.indexOf(b.slug);
            return left - right;
          });

    return { items: sorted.map((app) => toCompareItem(app)) };
  },
};
