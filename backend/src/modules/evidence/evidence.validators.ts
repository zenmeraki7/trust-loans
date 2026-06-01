import { EvidenceStatus, RedactionStatus } from "@prisma/client";
import { z } from "zod";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"] as const;

export const evidenceIdParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });

export const createUploadUrlSchema = z.object({
  body: z.object({
    fileName: z.string().trim().min(1).max(240),
    mimeType: z.enum(allowedMimeTypes),
    fileSizeBytes: z.number().int().positive(),
    reviewId: z.string().optional(),
    loanAppId: z.string().optional(),
  }),
});

export const completeUploadSchema = z.object({
  body: z.object({
    storageKey: z.string().min(1),
    fileName: z.string().trim().min(1),
    mimeType: z.enum(allowedMimeTypes),
    fileSizeBytes: z.number().int().positive(),
    reviewId: z.string().optional(),
    loanAppId: z.string().optional(),
    sensitiveFlags: z.array(z.string()).default([]),
    status: z.nativeEnum(EvidenceStatus).optional(),
    redactionStatus: z.nativeEnum(RedactionStatus).optional(),
  }),
});

export const secureOpenSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ reasonForAccess: z.string().trim().min(5).max(300) }),
});

export const reasonActionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ reason: z.string().trim().min(3).max(500) }),
});

export const adminListEvidenceSchema = z.object({
  query: z.object({
    status: z.nativeEnum(EvidenceStatus).optional(),
    reviewId: z.string().optional(),
  }),
});

export const maxEvidenceFileSizeBytes = Number(process.env.MAX_EVIDENCE_FILE_SIZE_BYTES ?? 10 * 1024 * 1024);
export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>["body"];
export type CompleteUploadInput = z.infer<typeof completeUploadSchema>["body"];
