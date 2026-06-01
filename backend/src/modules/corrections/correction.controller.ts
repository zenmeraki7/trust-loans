import { CorrectionStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { toCorrectionDto, toCorrectionSubmissionDto } from "./correction.dto.js";
import { correctionService } from "./correction.service.js";

export const correctionController = {
  async create(req: Request, res: Response) {
    const correction = await correctionService.create(req.body, req.user?.id);
    res.status(201).json(toCorrectionSubmissionDto(correction));
  },

  async listMine(req: Request, res: Response) {
    const result = await correctionService.listMine(req.query, req.user?.id);
    res.json({ ...result, items: result.items.map(toCorrectionDto) });
  },

  async getById(req: Request, res: Response) {
    const correction = await correctionService.getById(req.params.id);
    res.json(toCorrectionDto(correction));
  },

  async listAdmin(req: Request, res: Response) {
    const result = await correctionService.listAdmin(req.query);
    res.json({ ...result, items: result.items.map(toCorrectionDto) });
  },

  async accept(req: Request, res: Response) {
    const correction = await correctionService.transition(req.params.id, CorrectionStatus.ACCEPTED, req.user?.id, req.body.reason);
    res.json(toCorrectionDto(correction));
  },

  async reject(req: Request, res: Response) {
    const correction = await correctionService.transition(req.params.id, CorrectionStatus.REJECTED, req.user?.id, req.body.reason);
    res.json(toCorrectionDto(correction));
  },

  async escalate(req: Request, res: Response) {
    const correction = await correctionService.transition(req.params.id, CorrectionStatus.ESCALATED, req.user?.id, req.body.reason);
    res.json(toCorrectionDto(correction));
  },

  async requestInfo(req: Request, res: Response) {
    const correction = await correctionService.transition(
      req.params.id,
      CorrectionStatus.MORE_INFORMATION_NEEDED,
      req.user?.id,
      req.body.reason,
    );
    res.json(toCorrectionDto(correction));
  },
};

