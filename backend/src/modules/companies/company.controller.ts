import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { companyService } from "./company.service.js";
import { observeCompanyModification } from "../../security/securityMonitoring.js";

export const companyController = {
  async list(_req: Request, res: Response) {
    res.json(await companyService.list());
  },

  async create(req: Request, res: Response) {
    const company = await companyService.create(req.body);
    await observeCompanyModification({ actorId: req.user!.id, companyId: company.id, requestId: req.requestId });
    res.status(201).json(company);
  },

  async getBySlug(req: Request, res: Response) {
    const company = await companyService.getBySlug(req.params.id);
    if (!company) throw new AppError("Company profile not found", 404);
    res.json(company);
  },

  async enrich(req: Request, res: Response) {
    const company = await companyService.enrich(req.params.id, req.body);
    if (!company) throw new AppError("Company profile not found", 404);
    await observeCompanyModification({ actorId: req.user!.id, companyId: company.id, requestId: req.requestId });
    res.json(company);
  },
};
