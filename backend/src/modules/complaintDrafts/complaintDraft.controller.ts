import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { toComplaintDraftDto } from "../complaintTemplates/complaintTemplate.dto.js";
import { complaintDraftService } from "./complaintDraft.service.js";

export const complaintDraftController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const draft = await complaintDraftService.create(req.user.id, req.body);
    res.status(201).json(toComplaintDraftDto(draft));
  },

  async listMine(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const drafts = await complaintDraftService.list(req.user.id);
    res.json(drafts.map(toComplaintDraftDto));
  },

  async getMine(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const draft = await complaintDraftService.get(req.user.id, req.params.id);
    res.json(toComplaintDraftDto(draft));
  },

  async updateMine(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const draft = await complaintDraftService.update(req.user.id, req.params.id, req.body);
    res.json(toComplaintDraftDto(draft));
  },

  async deleteMine(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    await complaintDraftService.remove(req.user.id, req.params.id);
    res.status(204).send();
  },
};
