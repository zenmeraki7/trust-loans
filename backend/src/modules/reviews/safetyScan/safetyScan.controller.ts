import type { Request, Response } from "express";
import { safetyScanService } from "./safetyScan.service.js";

export const safetyScanController = {
  scan(req: Request, res: Response) {
    const result = safetyScanService.scan(req.body);
    res.json(result);
  },
};
