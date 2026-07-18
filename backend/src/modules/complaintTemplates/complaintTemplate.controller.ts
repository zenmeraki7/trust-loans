import type { Request, Response } from "express";
import { toComplaintTemplateDto } from "./complaintTemplate.dto.js";
import { complaintTemplateService } from "./complaintTemplate.service.js";

export const complaintTemplateController = {
  async list(req: Request, res: Response) {
    const templates = await complaintTemplateService.list(req.query as unknown as { category?: string; activeOnly?: boolean });
    res.json(templates.map(toComplaintTemplateDto));
  },

  async getByKey(req: Request, res: Response) {
    const template = await complaintTemplateService.getByKey(req.params.key);
    res.json(toComplaintTemplateDto(template));
  },

  async generate(req: Request, res: Response) {
    const output = await complaintTemplateService.generate(req.body);
    res.json(output);
  },

  async create(req: Request, res: Response) {
    const created = await complaintTemplateService.create(req.body);
    res.status(201).json(toComplaintTemplateDto(created));
  },

  async update(req: Request, res: Response) {
    const updated = await complaintTemplateService.update(req.params.id, req.body);
    res.json(toComplaintTemplateDto(updated));
  },

  async activate(req: Request, res: Response) {
    const updated = await complaintTemplateService.setActive(req.params.id, true);
    res.json(toComplaintTemplateDto(updated));
  },

  async deactivate(req: Request, res: Response) {
    const updated = await complaintTemplateService.setActive(req.params.id, false);
    res.json(toComplaintTemplateDto(updated));
  },
};
