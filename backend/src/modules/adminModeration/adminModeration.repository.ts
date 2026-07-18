import { Prisma, ReviewStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

export const adminModerationRepository = {
  async findReviews(input: { skip: number; take: number; status?: ReviewStatus; loanAppId?: string }) {
    const where: Prisma.ReviewWhereInput = {
      status: input.status,
      loanAppId: input.loanAppId,
    };

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: { updatedAt: "desc" },
        include: { loanApp: { select: { id: true, slug: true, name: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    return { items, total };
  },

  findReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: { loanApp: { select: { id: true, slug: true, name: true } } },
    });
  },

  updateReview(input: {
    id: string;
    status: ReviewStatus;
    publicBody?: string | null;
    redactionsApplied?: boolean;
    publishedAt?: Date | null;
  }) {
    return prisma.review.update({
      where: { id: input.id },
      data: {
        status: input.status,
        publicBody: input.publicBody,
        redactionsApplied: input.redactionsApplied,
        publishedAt: input.publishedAt,
      },
      include: { loanApp: { select: { id: true, slug: true, name: true } } },
    });
  },
};

