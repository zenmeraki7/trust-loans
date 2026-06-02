import { ProfileStatus, ReviewStatus, type LoanApp, type ComplaintSummary, type Review, type CompanyResponse } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

type CompanyReview = Pick<Review, "id" | "loanAppId" | "title" | "publicBody" | "body" | "rating" | "tags" | "createdAt"> & {
  companyResponses: Array<Pick<CompanyResponse, "id" | "body" | "createdAt" | "status" | "companyName">>;
};

type CompanyApp = LoanApp & {
  complaintSummaries: ComplaintSummary[];
  reviews: CompanyReview[];
};

const publishedStatuses = [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const riskLevelMap = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  SEVERE_COMPLAINT_PATTERN: "severe",
  UNDER_REVIEW: "medium",
  INSUFFICIENT_DATA: "medium",
} as const;

const verificationMap = {
  VERIFIED: "verified_public_details",
  PARTIALLY_VERIFIED: "partially_verified",
  UNVERIFIED: "user_submitted",
  UNDER_VERIFICATION: "under_verification",
  CONFLICTING_INFORMATION: "conflicting_information",
  NEEDS_MANUAL_REVIEW: "under_verification",
} as const;

const relationshipVerificationMap = {
  VERIFIED: "verified",
  PARTIALLY_VERIFIED: "partially_verified",
  UNVERIFIED: "not_enough_information",
  UNDER_VERIFICATION: "under_verification",
  CONFLICTING_INFORMATION: "disputed",
  NEEDS_MANUAL_REVIEW: "under_verification",
} as const;

const candidateNames = (app: LoanApp) =>
  [app.companyName, app.claimedNbfcPartner, app.developerName].filter((value): value is string => Boolean(value?.trim()));

const getEntityName = (apps: LoanApp[], slug: string) => {
  for (const app of apps) {
    const matched = candidateNames(app).find((name) => slugify(name) === slug);
    if (matched) return matched;
  }
  return slug.replaceAll("-", " ");
};

const summaryPercent = (apps: CompanyApp[], terms: string[]) => {
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const matched = apps.flatMap((app) =>
    app.complaintSummaries.filter((summary) => {
      const tag = summary.tag.toLowerCase();
      return lowerTerms.some((term) => tag.includes(term));
    }),
  );
  if (matched.length > 0) {
    return Math.round(matched.reduce((sum, summary) => sum + summary.percentage, 0) / matched.length);
  }

  const reviews = apps.flatMap((app) => app.reviews);
  if (reviews.length === 0) return 0;
  const count = reviews.filter((review) =>
    review.tags.some((tag) => {
      const lower = tag.toLowerCase();
      return lowerTerms.some((term) => lower.includes(term));
    }),
  ).length;
  return Math.round((count / reviews.length) * 100);
};

const topTags = (app: CompanyApp) =>
  app.complaintSummaries
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((summary) => summary.tag);

const mostSevereRisk = (apps: CompanyApp[]) => {
  const order = ["low", "medium", "high", "severe"] as const;
  return apps
    .map((app) => riskLevelMap[app.riskLevel])
    .reduce<(typeof order)[number]>((current, next) => (order.indexOf(next) > order.indexOf(current) ? next : current), "low");
};

const buildProfile = (slug: string, apps: CompanyApp[]) => {
  const first = apps[0];
  const entityName = getEntityName(apps, slug);
  const totalReviews = apps.reduce((sum, app) => sum + app.reviewCount, 0);
  const averageTrust = apps.length === 0 ? 0 : Math.round(apps.reduce((sum, app) => sum + app.trustScore, 0) / apps.length);
  const allReviews = apps.flatMap((app) => app.reviews.map((review) => ({ ...review, app })));
  const riskDistribution = apps.reduce(
    (acc, app) => {
      const risk = riskLevelMap[app.riskLevel];
      if (risk === "severe") acc.severe += 1;
      else acc[risk] += 1;
      if (app.riskLevel === "UNDER_REVIEW" || app.riskLevel === "INSUFFICIENT_DATA") acc.underReview += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0, severe: 0, underReview: 0 },
  );

  return {
    id: slug,
    slug,
    name: entityName,
    displayName: entityName,
    entityType: "company",
    verificationStatus: first ? verificationMap[first.verificationStatus] : "under_verification",
    riskSignalLevel: mostSevereRisk(apps),
    averageLinkedAppTrustScore: averageTrust,
    totalLinkedApps: apps.length,
    totalReviewsAcrossApps: totalReviews,
    details: {
      legalName: entityName,
      website: first?.websiteUrl ?? "",
      supportEmail: first?.supportEmail ?? "",
      supportPhone: first?.supportPhone ?? "",
      registeredAddress: first?.registeredAddress ?? "",
      registrationNumber: "",
      rbiRegistrationClaim: first?.claimedNbfcPartner ?? "",
      sourceUrls: [first?.websiteUrl, first?.playStoreUrl, first?.appStoreUrl].filter((value): value is string => Boolean(value)),
      lastVerifiedAt: first?.updatedAt.toISOString().slice(0, 10) ?? "",
      verificationConfidence: first?.verificationStatus === "VERIFIED" ? "high" : first?.verificationStatus === "PARTIALLY_VERIFIED" ? "medium" : "low",
    },
    grievance: {
      officerName: "",
      email: first?.grievanceEmail ?? first?.supportEmail ?? "",
      phone: first?.supportPhone ?? "",
      address: first?.registeredAddress ?? "",
      sourceUrl: first?.websiteUrl ?? "",
      lastVerifiedAt: first?.updatedAt.toISOString().slice(0, 10) ?? "",
    },
    linkedApps: apps.map((app) => ({
      id: app.id,
      name: app.name,
      slug: app.slug,
      logoUrl: app.logoUrl ?? "/images/default-app-logo.svg",
      developerName: app.developerName ?? "Unknown developer",
      companyName: app.companyName ?? entityName,
      relationshipType: slugify(app.claimedNbfcPartner ?? "") === slug ? "claimed_nbfc_partner" : "company_owner",
      relationshipVerificationStatus: relationshipVerificationMap[app.verificationStatus],
      trustScore: app.trustScore,
      averageRating: app.averageRating,
      reviewCount: app.reviewCount,
      riskLevel: riskLevelMap[app.riskLevel],
      topComplaintTags: topTags(app),
      profileUrl: `/loan-apps/${app.slug}`,
    })),
    relationshipEvidence: apps.map((app) => ({
      appId: app.id,
      appName: app.name,
      relationshipType: slugify(app.claimedNbfcPartner ?? "") === slug ? "claimed_nbfc_partner" : "company_owner",
      verificationStatus: relationshipVerificationMap[app.verificationStatus],
      sourceType: app.websiteUrl ? "website" : app.playStoreUrl ? "store_listing" : "profile_metadata",
      sourceUrl: app.websiteUrl ?? app.playStoreUrl ?? app.appStoreUrl ?? "",
      lastCheckedAt: app.updatedAt.toISOString().slice(0, 10),
      confidence: app.verificationStatus === "VERIFIED" ? "high" : app.verificationStatus === "PARTIALLY_VERIFIED" ? "medium" : "low",
      notes: "Derived from linked loan app public metadata.",
    })),
    complaintPatterns: {
      totalReviews,
      harassmentPercent: summaryPercent(apps, ["harassment", "threat", "abusive"]),
      hiddenChargesPercent: summaryPercent(apps, ["hidden", "charge", "fee"]),
      contactListAbusePercent: summaryPercent(apps, ["contact", "relative", "office"]),
      dataMisusePercent: summaryPercent(apps, ["data", "privacy"]),
      fakeLegalNoticePercent: summaryPercent(apps, ["fake legal", "legal notice"]),
      paymentNotUpdatedPercent: summaryPercent(apps, ["payment", "not updated"]),
      loanNotClosedPercent: summaryPercent(apps, ["loan not closed", "closure"]),
      positiveReviewPercent: summaryPercent(apps, ["positive", "good support", "fast"]),
    },
    riskDistribution,
    officialResponses: allReviews.flatMap((review) =>
      review.companyResponses.map((response) => ({
        id: response.id,
        responseBody: response.body,
        responseDate: response.createdAt.toISOString().slice(0, 10),
        verificationStatus: "verified",
        contactChannel: response.companyName,
        addressedApps: [review.app.name],
      })),
    ),
    relatedEntities: [],
    mentionedReviews: allReviews.slice(0, 6).map((review) => ({
      id: review.id,
      appId: review.app.id,
      appName: review.app.name,
      reviewerDisplayName: "Public reviewer",
      rating: review.rating,
      title: review.title,
      excerpt: (review.publicBody ?? review.body).slice(0, 180),
      tags: review.tags,
      createdAt: review.createdAt.toISOString().slice(0, 10),
      verificationBadge: "unverified_review",
      reviewUrl: `/reviews/${review.id}`,
    })),
    faq: [
      {
        question: "Does this page confirm the entity is the lender?",
        answer: "No. It summarizes public metadata, app claims, and user reports. Verify lender and NBFC details independently before borrowing.",
      },
      {
        question: "How can incorrect entity details be corrected?",
        answer: "Submit a correction request with an official source URL or supporting explanation.",
      },
    ],
  };
};

const loadApps = () =>
  prisma.loanApp.findMany({
    where: { status: { not: ProfileStatus.ARCHIVED } },
    orderBy: [{ trustScore: "desc" }, { updatedAt: "desc" }],
    include: {
      complaintSummaries: true,
      reviews: {
        where: { status: { in: publishedStatuses } },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          loanAppId: true,
          title: true,
          publicBody: true,
          body: true,
          rating: true,
          tags: true,
          createdAt: true,
          companyResponses: {
            where: { status: "APPROVED" },
            select: { id: true, body: true, createdAt: true, status: true, companyName: true },
          },
        },
      },
    },
  });

export const companyService = {
  async list() {
    const apps = await loadApps();
    const groups = new Map<string, CompanyApp[]>();
    for (const app of apps) {
      const name = app.companyName ?? app.claimedNbfcPartner ?? app.developerName;
      if (!name) continue;
      const slug = slugify(name);
      groups.set(slug, [...(groups.get(slug) ?? []), app]);
    }
    const items = [...groups.entries()].map(([slug, groupedApps]) => {
      const profile = buildProfile(slug, groupedApps);
      return {
        id: profile.id,
        slug: profile.slug,
        name: profile.name,
        displayName: profile.displayName,
        entityType: profile.entityType,
        verificationStatus: profile.verificationStatus,
        riskSignalLevel: profile.riskSignalLevel,
        totalLinkedApps: profile.totalLinkedApps,
        totalReviewsAcrossApps: profile.totalReviewsAcrossApps,
      };
    });
    return { items, meta: { total: items.length, page: 1, limit: items.length, totalPages: 1 } };
  },

  async getBySlug(slug: string) {
    const normalized = slugify(slug);
    const apps = await loadApps();
    const matchedApps = apps.filter((app) => candidateNames(app).some((name) => slugify(name) === normalized));
    if (matchedApps.length === 0) return null;
    return buildProfile(normalized, matchedApps);
  },
};
