import { CorrectionStatus, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { ownedByRequester } from "../../security/ownerScope.js";
import type { CreateCorrectionInput } from "./correction.validators.js";

export const correctionRepository = {
  create(input: CreateCorrectionInput, requesterId: string) {
    return prisma.correctionRequest.create({
      data: {
        requesterId,
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

  findByIdForAdmin(id: string) {
    return prisma.correctionRequest.findUnique({ where: { id } });
  },

  findByIdForRequester(id: string, requesterId: string) {
    return prisma.correctionRequest.findFirst({ where: ownedByRequester(id, requesterId) });
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

  async updateStatusForAdmin(id: string, allowedCurrentStatuses: readonly CorrectionStatus[], status: CorrectionStatus) {
    const result = await prisma.correctionRequest.updateMany({
      where: { id, status: { in: [...allowedCurrentStatuses] } },
      data: { status },
    });
    if (result.count !== 1) return null;
    return prisma.correctionRequest.findUnique({ where: { id } });
  },
};
