import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  async getMine(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const dashboard = await dashboardService.getUserDashboard(req.user.id);
    res.json(dashboard);
  },
};
