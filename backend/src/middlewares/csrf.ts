import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { verifyCsrfToken } from "../modules/auth/auth.crypto.js";
import { csrfTokenFromCookie } from "../modules/auth/csrf.cookies.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const equalTokens = (left: string, right: string) => {
  if (!left || !right || left.length > 256 || right.length > 256) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  if (req.get("origin") !== env.publicAppOrigin) {
    res.status(403).json({ error: "Invalid request origin" });
    return;
  }

  const mediaType = req.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    res.status(415).json({ error: "Content-Type must be application/json" });
    return;
  }

  const headerToken = req.get("x-csrf-token") ?? "";
  const cookieToken = csrfTokenFromCookie(req);
  if (!equalTokens(headerToken, cookieToken) || !verifyCsrfToken(headerToken)) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
};
