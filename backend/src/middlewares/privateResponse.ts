import type { NextFunction, Request, Response } from "express";

export function setPrivateNoStore(res: Response) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Vary", "Cookie, Authorization");
}

const personalPathPrefixes = [
  "/api/auth",
  "/api/me/",
  "/api/complaint-drafts",
  "/api/complaint-templates/generate",
  "/api/corrections",
  "/api/reports",
  "/api/notifications",
  "/api/notification-settings",
  "/api/reviews/safety-scan",
  "/api/admin/",
] as const;

export function isPersonalResponsePath(path: string) {
  return personalPathPrefixes.some((prefix) => {
    const normalized = prefix.replace(/\/+$/, "");
    return path === normalized || path.startsWith(`${normalized}/`);
  });
}

export function privateResponseHeaders(req: Request, res: Response, next: NextFunction) {
  if (req.user || isPersonalResponsePath(req.path)) setPrivateNoStore(res);
  next();
}
