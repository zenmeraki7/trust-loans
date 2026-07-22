import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { toCaseDto } from "./harassmentCase.dto.js";
import { harassmentCaseService } from "./harassmentCase.service.js";

function principal(req: Request) {
  if (!req.user) throw new AppError("Authentication required", 401);
  return req.user;
}

export const harassmentCaseController = {
  async create(req: Request, res: Response) { res.status(201).json(toCaseDto(await harassmentCaseService.create(principal(req), req.body))); },
  async list(req: Request, res: Response) { res.json((await harassmentCaseService.list(principal(req))).map(toCaseDto)); },
  async get(req: Request, res: Response) { res.json(toCaseDto(await harassmentCaseService.get(principal(req), req.params.caseId))); },
  async update(req: Request, res: Response) { res.json(toCaseDto(await harassmentCaseService.update(principal(req), req.params.caseId, req.body))); },
  async remove(req: Request, res: Response) { res.json(toCaseDto(await harassmentCaseService.archive(principal(req), req.params.caseId))); },

  async createTimeline(req: Request, res: Response) { res.status(201).json(await harassmentCaseService.createTimeline(principal(req), req.params.caseId, req.body)); },
  async updateTimeline(req: Request, res: Response) { res.json(await harassmentCaseService.updateTimeline(principal(req), req.params.caseId, req.params.itemId, req.body)); },
  async deleteTimeline(req: Request, res: Response) { await harassmentCaseService.deleteTimeline(principal(req), req.params.caseId, req.params.itemId); res.status(204).send(); },

  async createChecklist(req: Request, res: Response) { res.status(201).json(await harassmentCaseService.createChecklist(principal(req), req.params.caseId, req.body)); },
  async updateChecklist(req: Request, res: Response) { res.json(await harassmentCaseService.updateChecklist(principal(req), req.params.caseId, req.params.itemId, req.body)); },
  async deleteChecklist(req: Request, res: Response) { await harassmentCaseService.deleteChecklist(principal(req), req.params.caseId, req.params.itemId); res.status(204).send(); },

  async createExternalComplaint(req: Request, res: Response) { res.status(201).json(await harassmentCaseService.createExternalComplaint(principal(req), req.params.caseId, req.body)); },
  async updateExternalComplaint(req: Request, res: Response) { res.json(await harassmentCaseService.updateExternalComplaint(principal(req), req.params.caseId, req.params.complaintId, req.body)); },
  async deleteExternalComplaint(req: Request, res: Response) { await harassmentCaseService.deleteExternalComplaint(principal(req), req.params.caseId, req.params.complaintId); res.status(204).send(); },

  async linkReview(req: Request, res: Response) { res.json(await harassmentCaseService.linkReview(principal(req), req.params.caseId, req.body.id)); },
  async linkEvidence(req: Request, res: Response) { res.json(await harassmentCaseService.linkEvidence(principal(req), req.params.caseId, req.body.id)); },
  async linkDecisionSession(req: Request, res: Response) { res.json(await harassmentCaseService.linkDecisionSession(principal(req), req.params.caseId, req.body.id)); },
  async linkComplaintDraft(req: Request, res: Response) { res.json(await harassmentCaseService.linkComplaintDraft(principal(req), req.params.caseId, req.body.id)); },
};
