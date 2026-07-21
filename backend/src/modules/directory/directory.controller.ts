import type { Request, Response } from "express";
import { directoryService } from "./directory.service.js";

export const directoryController = {
  async search(req: Request, res: Response) {
    res.json(await directoryService.search(req.query as never));
  },
};
