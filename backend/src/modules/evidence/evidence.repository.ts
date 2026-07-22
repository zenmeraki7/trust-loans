import { EvidenceStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { ownedByUser } from "../../security/ownerScope.js";
import type { CompleteUploadInput } from "./evidence.validators.js";

export const evidenceRepository = {
  create(input: { userId: string; maskedFileName: string; originalFileNameHash: string; serverStatus: EvidenceStatus } & CompleteUploadInput) {
    return prisma.evidenceFile.create({
      data: {
        userId: input.userId,
        loanAppId: input.loanAppId,
        reviewId: input.reviewId,
        storageKey: input.storageKey,
        maskedFileName: input.maskedFileName,
        originalFileNameHash: input.originalFileNameHash,
        mimeType: input.mimeType,
        fileSizeBytes: input.fileSizeBytes,
        status: input.serverStatus,
        sensitiveFlags: input.sensitiveFlags,
        redactionStatus: "NOT_STARTED",
      },
    });
  },

  findByIdForAdminReview(id: string) {
    return prisma.evidenceFile.findUnique({ where: { id } });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.evidenceFile.findFirst({ where: ownedByUser(id, userId, { status: { not: EvidenceStatus.DELETED } }) });
  },

  listForAdmin(input: { status?: EvidenceStatus; reviewId?: string }) {
    return prisma.evidenceFile.findMany({ where: { status: input.status, reviewId: input.reviewId }, orderBy: { uploadedAt: "desc" } });
  },

  updateStatusForAdminReview(id: string, status: EvidenceStatus) {
    return prisma.evidenceFile.update({ where: { id }, data: { status } });
  },

  async markDeletedForUser(id: string, userId: string) {
    const result = await prisma.evidenceFile.updateMany({
      where: ownedByUser(id, userId, { status: { not: EvidenceStatus.DELETED } }),
      data: { status: EvidenceStatus.DELETED },
    });
    if (result.count !== 1) return null;
    return prisma.evidenceFile.findFirst({ where: ownedByUser(id, userId) });
  },

  ownedReviewExists(reviewId: string, userId: string) {
    return prisma.review.count({ where: ownedByUser(reviewId, userId) });
  },

  markReviewEvidenceSubmittedForUser(reviewId: string, userId: string) {
    return prisma.review.updateMany({ where: ownedByUser(reviewId, userId), data: { evidenceSubmitted: true } });
  },
};
