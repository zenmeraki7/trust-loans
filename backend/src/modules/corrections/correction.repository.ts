import { CorrectionStatus, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { CreateCorrectionInput } from "./correction.validators.js";

export const correctionRepository = {
  create(input: CreateCorrectionInput) {
    return prisma.correctionRequest.create({
      data: {
        requesterId: input.requesterId,
        requestType: input.requestType,
        publicItemType: input.publicItemType,
        publicItemId: input.publicItemId,
        explanation: input.explanation,
        currentValue: input.currentValue,
        proposedValue: input.proposedValue,
        sourceUrl: input.sourceUrl,
        status: CorrectionStatus.SUBMITTED,
      },
    });
  },

  findById(id: string) {
    return prisma.correctionRequest.findUnique({ where: { id } });
  },

  async findMany(input: { skip: number; take: number; status?: CorrectionStatus; requestType?: string; requesterId?: string }) {
    const where: Prisma.CorrectionRequestWhereInput = {
      status: input.status,
      requestType: input.requestType,
      requesterId: input.requesterId,
    };
    const [items, total] = await Promise.all([
      prisma.correctionRequest.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.correctionRequest.count({ where }),
    ]);
    return { items, total };
  },

  updateStatus(id: string, status: CorrectionStatus) {
    return prisma.correctionRequest.update({
      where: { id },
      data: { status },
    });
  },
};

