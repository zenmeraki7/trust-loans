import { EvidenceStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { toEvidenceMetadataDto } from "./evidence.dto.js";
import { evidenceService } from "./evidence.service.js";

export const evidenceController = {
  async uploadUrl(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = evidenceService.createUploadUrl(req.user.id, req.body);
    res.status(201).json(result);
  },

  async complete(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const evidence = await evidenceService.completeUpload(req.user.id, req.body);
    res.status(201).json(toEvidenceMetadataDto(evidence));
  },

  async metadata(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const evidence = await evidenceService.getMetadataForUser(req.params.id, req.user.id);
    res.json(toEvidenceMetadataDto(evidence));
  },

  async delete(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    await evidenceService.deleteForUser(req.params.id, req.user.id);
    res.status(204).send();
  },

  async adminList(req: Request, res: Response) {
    const items = await evidenceService.listForAdmin(req.query as { status?: EvidenceStatus; reviewId?: string });
    res.json(items.map(toEvidenceMetadataDto));
  },

  async adminGet(req: Request, res: Response) {
    const evidence = await evidenceService.getForAdmin(req.params.id);
    res.json(toEvidenceMetadataDto(evidence));
  },

  async secureOpen(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = await evidenceService.secureOpen(req.params.id, req.user.id, req.body.reasonForAccess);
    res.json(result);
  },

  async accept(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.accept", EvidenceStatus.ACCEPTED_FOR_VERIFICATION, req.body.reason ?? "Accepted")));
  },
  async reject(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.reject", EvidenceStatus.REJECTED_FOR_SAFETY, req.body.reason)));
  },
  async privateOnly(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.private_only", EvidenceStatus.PRIVATE_ONLY, req.body.reason ?? "Private only")));
  },
  async requestReplacement(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.request_replacement", EvidenceStatus.REDACTION_REQUIRED, req.body.reason)));
  },
  async adminDelete(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.admin_delete", EvidenceStatus.DELETED, req.body.reason)));
  },
  async escalate(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    res.json(toEvidenceMetadataDto(await evidenceService.adminDecision(req.params.id, req.user.id, "evidence.escalate", EvidenceStatus.ESCALATED, req.body.reason ?? "Escalated")));
  },
};
