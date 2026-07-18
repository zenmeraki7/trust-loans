import type { Request, Response } from "express";
import { toScoreBreakdownDto, toScoringConfigDto } from "./scoring.dto.js";
import { scoringService } from "./scoring.service.js";

export const scoringController = {
  async getAppScoreBreakdown(req: Request, res: Response) {
    const breakdown = await scoringService.calculateAppScoreBreakdown(req.params.id);
    res.json(toScoreBreakdownDto(breakdown));
  },

  async getConfig(_req: Request, res: Response) {
    const config = await scoringService.getConfig();
    res.json(toScoringConfigDto(config));
  },

  async updateConfig(req: Request, res: Response) {
    const config = await scoringService.updateConfig(req.body, req.user?.id);
    res.json(toScoringConfigDto(config));
  },

  async recalculate(req: Request, res: Response) {
    const result = await scoringService.runJob(req.body, req.user?.id);
    res.json(result);
  },
};

