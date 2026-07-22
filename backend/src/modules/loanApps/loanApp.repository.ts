import { Prisma, ProfileStatus, RegulatoryActionStatus, ReviewStatus, RiskLevel } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { CreateLoanAppInput, SuggestLoanAppInput } from "./loanApp.validators.js";

export const loanAppRepository = {
  async findMany(input: { skip: number; take: number; q?: string; riskLevel?: string; verificationStatus?: string }) {
    const where: Prisma.LoanAppWhereInput = {
      status: { not: ProfileStatus.ARCHIVED },
      ...(input.q
        ? {
            OR: [
              { name: { contains: input.q, mode: "insensitive" } },
              { developerName: { contains: input.q, mode: "insensitive" } },
              { companyName: { contains: input.q, mode: "insensitive" } },
              { claimedNbfcPartner: { contains: input.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.riskLevel ? { riskLevel: input.riskLevel as never } : {}),
      ...(input.verificationStatus ? { verificationStatus: input.verificationStatus as never } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.loanApp.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: [{ trustScore: "desc" }, { updatedAt: "desc" }],
      }),
      prisma.loanApp.count({ where }),
    ]);

    return { items, total };
  },

  findBySlug(slug: string) {
    return prisma.loanApp.findUnique({
      where: { slug },
      include: {
        complaintSummaries: true,
        regulatoryActions: {
          where: { status: { in: [RegulatoryActionStatus.ACTIVE, RegulatoryActionStatus.UNDER_REVIEW] } },
          orderBy: [{ sourcePublishedAt: "desc" }, { updatedAt: "desc" }],
        },
      },
    });
  },

  findById(id: string) {
    return prisma.loanApp.findUnique({
      where: { id },
      include: {
        complaintSummaries: true,
        regulatoryActions: {
          where: { status: { in: [RegulatoryActionStatus.ACTIVE, RegulatoryActionStatus.UNDER_REVIEW] } },
          orderBy: [{ sourcePublishedAt: "desc" }, { updatedAt: "desc" }],
        },
      },
    });
  },

  findPublishedReviewsByAppId(input: { appId: string; skip: number; take: number }) {
    return prisma.review.findMany({
      where: {
        loanAppId: input.appId,
        status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] },
      },
      skip: input.skip,
      take: input.take,
      orderBy: { publishedAt: "desc" },
      include: { companyResponses: { where: { status: "APPROVED" } } },
    });
  },

  countPublishedReviewsByAppId(appId: string) {
    return prisma.review.count({
      where: {
        loanAppId: appId,
        status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] },
      },
    });
  },

  suggestApp(input: SuggestLoanAppInput) {
    const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${Date.now()}`;
    return prisma.loanApp.create({
      data: {
        slug,
        name: input.name,
        developerName: input.developerName,
        companyName: input.companyName,
        claimedNbfcPartner: input.claimedNbfcPartner,
        websiteUrl: input.websiteUrl,
        playStoreUrl: input.playStoreUrl,
        appStoreUrl: input.appStoreUrl,
        status: ProfileStatus.DRAFT,
      },
    });
  },

  createApp(input: CreateLoanAppInput) {
    return prisma.loanApp.create({
      data: {
        slug: input.slug,
        name: input.name,
        logoUrl: input.logoUrl,
        packageName: input.packageName,
        developerName: input.developerName,
        companyName: input.companyName,
        legalEntityName: input.legalEntityName,
        businessType: input.businessType,
        websiteUrl: input.websiteUrl,
        playStoreUrl: input.playStoreUrl,
        appStoreUrl: input.appStoreUrl,
        claimedNbfcPartner: input.claimedNbfcPartner,
        associatedRegulatedEntity: input.associatedRegulatedEntity,
        rbiRegistrationNumber: input.rbiRegistrationNumber,
        rbiRegistrationVerifiedAt: input.rbiRegistrationVerifiedAt,
        rbiRegistrationSourceUrl: input.rbiRegistrationSourceUrl,
        interestRateRange: input.interestRateRange,
        processingFees: input.processingFees,
        latePaymentCharges: input.latePaymentCharges,
        loanTenure: input.loanTenure,
        privacyDisclosure: input.privacyDisclosure,
        contactAccessDisclosure: input.contactAccessDisclosure,
        recoveryPracticeInfo: input.recoveryPracticeInfo,
        knownComplaintCategories: input.knownComplaintCategories,
        publicWarningLabels: input.publicWarningLabels,
        dataSource: input.dataSource,
        lastReviewedAt: input.lastReviewedAt,
        status: ProfileStatus.UNDER_REVIEW,
        verificationStatus: "UNDER_VERIFICATION",
        claimStatus: "UNCLAIMED",
        riskLevel: "INSUFFICIENT_DATA",
        trustScore: 0,
        averageRating: 0,
        reviewCount: 0,
        grievanceEmail: input.grievanceEmail,
        supportEmail: input.supportEmail,
        supportPhone: input.supportPhone,
        registeredAddress: input.registeredAddress,
      },
      include: { complaintSummaries: true },
    });
  },

  findPublishedReviewStats(loanAppId: string) {
    return prisma.review.findMany({
      where: {
        loanAppId,
        status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] },
      },
      select: {
        rating: true,
        tags: true,
      },
    });
  },

  replaceComplaintSummaries(input: { loanAppId: string; summaries: Array<{ tag: string; count: number; percentage: number }> }) {
    return prisma.$transaction([
      prisma.complaintSummary.deleteMany({ where: { loanAppId: input.loanAppId } }),
      ...input.summaries.map((summary) =>
        prisma.complaintSummary.create({
          data: {
            loanAppId: input.loanAppId,
            tag: summary.tag,
            count: summary.count,
            percentage: summary.percentage,
          },
        }),
      ),
    ]);
  },

  updateMetrics(input: { loanAppId: string; averageRating: number; reviewCount: number; trustScore: number; riskLevel: RiskLevel }) {
    return prisma.loanApp.update({
      where: { id: input.loanAppId },
      data: {
        averageRating: input.averageRating,
        reviewCount: input.reviewCount,
        trustScore: input.trustScore,
        riskLevel: input.riskLevel,
      },
    });
  },
};
