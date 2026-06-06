import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { companyService } from "./company.service.js";

export const companyController = {
  async list(_req: Request, res: Response) {
    res.json(await companyService.list());
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await companyService.create(req.body));
  },

  async getBySlug(req: Request, res: Response) {
    const company = await companyService.getBySlug(req.params.id);
    if (!company) throw new AppError("Company profile not found", 404);
    res.json(company);
  },

  async enrich(req: Request, res: Response) {
    const company = await companyService.enrich(req.params.id, req.body);
    if (!company) throw new AppError("Company profile not found", 404);
    res.json(company);
  },
};
