import { Prisma, ReviewStatus, RiskLevel, VerificationStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { UpdateScoringConfigInput } from "./scoring.validators.js";

const defaultConfig = {
  name: "default",
  active: true,
};

export const scoringRepository = {
  async getActiveConfig() {
    const existing = await prisma.scoringConfig.findFirst({ where: { active: true } });
    if (existing) return existing;
    return prisma.scoringConfig.create({ data: defaultConfig });
  },

  async updateActiveConfig(input: UpdateScoringConfigInput) {
    const active = await this.getActiveConfig();
    return prisma.scoringConfig.update({
      where: { id: active.id },
      data: input,
    });
  },

  getAppScoreData(appId: string) {
    return prisma.loanApp.findUnique({
      where: { id: appId },
      include: {
        reviews: {
          where: { status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] } },
          include: { companyResponses: true },
        },
        complaintSummaries: true,
      },
    });
  },

  async updateAppScore(appId: string, trustScore: number, riskLevel: RiskLevel) {
    return prisma.loanApp.update({
      where: { id: appId },
      data: { trustScore, riskLevel },
    });
  },

  async listAppIds() {
    const apps = await prisma.loanApp.findMany({ select: { id: true } });
    return apps.map((app) => app.id);
  },

  async rebuildComplaintSummary(appId: string) {
    const reviews = await prisma.review.findMany({
      where: { loanAppId: appId, status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] } },
      select: { tags: true },
    });
    const total = reviews.length || 1;
    const counts = new Map<string, number>();
    reviews.flatMap((review) => review.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));

    await prisma.$transaction(
      Array.from(counts.entries()).map(([tag, count]) =>
        prisma.complaintSummary.upsert({
          where: { loanAppId_tag: { loanAppId: appId, tag } },
          create: { loanAppId: appId, tag, count, percentage: Math.round((count / total) * 10000) / 100 },
          update: { count, percentage: Math.round((count / total) * 10000) / 100, lastCalculatedAt: new Date() },
        }),
      ),
    );
  },

  async getVerificationSignal(appId: string) {
    const app = await prisma.loanApp.findUnique({
      where: { id: appId },
      select: {
        verificationStatus: true,
        grievanceEmail: true,
        supportEmail: true,
        supportPhone: true,
      },
    });
    return {
      verificationStatus: app?.verificationStatus ?? VerificationStatus.UNDER_VERIFICATION,
      grievanceAvailable: Boolean(app?.grievanceEmail || app?.supportEmail || app?.supportPhone),
    };
  },

  async rawTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction(callback);
  },

  getPublishedReviewStats(loanAppId: string) {
    return prisma.review.findMany({
      where: {
        loanAppId,
        status: { in: [ReviewStatus.PUBLISHED, ReviewStatus.PARTIALLY_PUBLISHED] },
      },
      select: { rating: true, tags: true },
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

  updateLoanAppMetrics(input: {
    loanAppId: string;
    averageRating: number;
    reviewCount: number;
    trustScore: number;
    riskLevel: RiskLevel;
  }) {
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
