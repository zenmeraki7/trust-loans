import type { Request, Response } from "express";
import { compareService } from "./compare.service.js";

export const compareController = {
  async list(req: Request, res: Response) {
    const ids = typeof req.query.ids === "string" ? req.query.ids.split(",") : [];
    const payload = await compareService.list(ids, req.query as never);
    res.json(payload);
  },
};
