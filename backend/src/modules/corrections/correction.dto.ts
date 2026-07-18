import type { CorrectionRequest } from "@prisma/client";

export const toCorrectionDto = (correction: CorrectionRequest) => ({
  id: correction.id,
  requestType: correction.requestType,
  status: correction.status,
  publicItemType: correction.publicItemType,
  publicItemId: correction.publicItemId,
  explanation: correction.explanation,
  currentValue: correction.currentValue,
  proposedValue: correction.proposedValue,
  sourceUrl: correction.sourceUrl,
  createdAt: correction.createdAt,
  updatedAt: correction.updatedAt,
  note: "Correction and dispute decisions are moderation outcomes, not legal findings.",
});

export const toCorrectionSubmissionDto = (correction: CorrectionRequest) => ({
  id: correction.id,
  status: correction.status,
  message: "Correction or dispute request submitted for review.",
  createdAt: correction.createdAt,
});

