import { EvidenceStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { evidenceRepository } from "./evidence.repository.js";
import { storageAdapter } from "./storage.adapter.js";
import { maxEvidenceFileSizeBytes } from "./evidence.validators.js";
import type { CompleteUploadInput, CreateUploadUrlInput } from "./evidence.validators.js";

const severeFlags = new Set(["aadhaar", "pan", "bank_account", "upi_id", "otp_password", "private_photo", "child_image"]);

export const evidenceService = {
  createUploadUrl(userId: string, input: CreateUploadUrlInput) {
    if (input.fileSizeBytes > maxEvidenceFileSizeBytes) {
      throw new AppError("File exceeds maximum allowed size", 400);
    }
    const storageKey = `evidence/${userId}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    return { storageKey, ...storageAdapter.createSignedUploadUrl({ storageKey, mimeType: input.mimeType }) };
  },

  async completeUpload(userId: string, input: CompleteUploadInput) {
    const maskedFileName = maskFileName(input.fileName);
    const originalFileNameHash = storageAdapter.hashOriginalFileName(input.fileName);
    const status = input.sensitiveFlags.some((flag) => severeFlags.has(flag)) ? EvidenceStatus.SENSITIVE_DATA_DETECTED : (input.status ?? EvidenceStatus.SCAN_PENDING);

    const created = await evidenceRepository.create({
      ...input,
      status,
      userId,
      maskedFileName,
      originalFileNameHash,
    });

    if (input.reviewId) {
      await evidenceRepository.markReviewEvidenceSubmitted(input.reviewId);
    }

    return created;
  },

  async getMetadataForUser(id: string, userId: string) {
    const evidence = await evidenceRepository.findByIdForUser(id, userId);
    if (!evidence) throw new AppError("Evidence metadata not found", 404);
    return evidence;
  },

  async deleteForUser(id: string, userId: string) {
    const evidence = await evidenceRepository.findByIdForUser(id, userId);
    if (!evidence) throw new AppError("Evidence not found", 404);
    return evidenceRepository.markDeleted(id);
  },

  listForAdmin(query: { status?: EvidenceStatus; reviewId?: string }) {
    return evidenceRepository.listForAdmin(query);
  },

  async getForAdmin(id: string) {
    const evidence = await evidenceRepository.findById(id);
    if (!evidence) throw new AppError("Evidence not found", 404);
    return evidence;
  },

  async secureOpen(id: string, actorId: string, reasonForAccess: string) {
    const evidence = await this.getForAdmin(id);
    await auditLog({ actorId, action: "evidence.secure_open", targetType: "EvidenceFile", targetId: id, reason: reasonForAccess });
    return { ...storageAdapter.createSignedDownloadUrl({ storageKey: evidence.storageKey }), note: "Opening evidence is logged." };
  },

  async adminDecision(id: string, actorId: string, action: string, status: EvidenceStatus, reason: string) {
    const before = await this.getForAdmin(id);
    const updated = await evidenceRepository.updateStatus(id, status);
    await auditLog({ actorId, action, targetType: "EvidenceFile", targetId: id, beforeJson: { status: before.status }, afterJson: { status: updated.status }, reason });
    return updated;
  },
};

function maskFileName(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  const ext = dot > 0 ? fileName.slice(dot) : "";
  return `evidence_${Math.random().toString(36).slice(2, 8)}${ext}`;
}
