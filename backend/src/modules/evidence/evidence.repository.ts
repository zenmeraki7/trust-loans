import { EvidenceStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import type { CompleteUploadInput } from "./evidence.validators.js";

export const evidenceRepository = {
  create(input: { userId: string; maskedFileName: string; originalFileNameHash: string } & CompleteUploadInput) {
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
        status: input.status ?? EvidenceStatus.SCAN_PENDING,
        sensitiveFlags: input.sensitiveFlags,
        redactionStatus: input.redactionStatus,
      },
    });
  },

  findById(id: string) {
    return prisma.evidenceFile.findUnique({ where: { id } });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.evidenceFile.findFirst({ where: { id, userId, status: { not: EvidenceStatus.DELETED } } });
  },

  listForAdmin(input: { status?: EvidenceStatus; reviewId?: string }) {
    return prisma.evidenceFile.findMany({ where: { status: input.status, reviewId: input.reviewId }, orderBy: { uploadedAt: "desc" } });
  },

  updateStatus(id: string, status: EvidenceStatus) {
    return prisma.evidenceFile.update({ where: { id }, data: { status } });
  },

  markDeleted(id: string) {
    return prisma.evidenceFile.update({ where: { id }, data: { status: EvidenceStatus.DELETED } });
  },

  markReviewEvidenceSubmitted(reviewId: string) {
    return prisma.review.update({ where: { id: reviewId }, data: { evidenceSubmitted: true } });
  },
};
