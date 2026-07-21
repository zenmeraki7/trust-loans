import type { NextFunction, Request, Response } from "express";
import { sanitizePublicPayload } from "../security/publicContent.js";

export function sanitizeJsonResponses(_req: Request, res: Response, next: NextFunction) {
  const json = res.json.bind(res);
  res.json = ((body: unknown) => json(sanitizePublicPayload(body))) as Response["json"];
  next();
}
