import type { Request, Response } from "express";
import { toPublicLoanAppListItemDto, toPublicLoanAppProfileDto } from "./loanApp.dto.js";
import { loanAppService } from "./loanApp.service.js";

export const loanAppController = {
  async list(req: Request, res: Response) {
    const result = await loanAppService.list(req.query);
    res.json({ ...result, items: result.items.map(toPublicLoanAppListItemDto) });
  },

  async getBySlug(req: Request, res: Response) {
    const app = await loanAppService.getProfile(req.params.slug);
    res.json(toPublicLoanAppProfileDto(app));
  },

  async suggest(req: Request, res: Response) {
    const app = await loanAppService.suggest(req.body, req.user?.id);
    res.status(201).json({
      id: app.id,
      slug: app.slug,
      status: app.status,
      message: "Loan app suggestion received for review.",
    });
  },

  async reviews(req: Request, res: Response) {
    const reviews = await loanAppService.getPublicReviews(req.params.id, req.query);
    res.json(reviews);
  },
};

