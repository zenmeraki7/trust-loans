import type { EvidenceFile } from "@prisma/client";

export const toEvidenceMetadataDto = (file: EvidenceFile) => ({
  id: file.id,
  loanAppId: file.loanAppId,
  reviewId: file.reviewId,
  maskedFileName: file.maskedFileName,
  mimeType: file.mimeType,
  fileSizeBytes: file.fileSizeBytes,
  status: file.status,
  privateByDefault: file.privateByDefault,
  sensitiveFlags: file.sensitiveFlags,
  redactionStatus: file.redactionStatus,
  uploadedAt: file.uploadedAt,
  updatedAt: file.updatedAt,
});
