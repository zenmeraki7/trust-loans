import express, { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import { AppError } from "../utils/AppError.js";

export const REQUEST_SIZE_LIMITS = {
  loginBytes: 16 * 1024,
  signupBytes: 32 * 1024,
  authBytes: 16 * 1024,
  reviewBytes: 48 * 1024,
  complaintCaseBytes: 16 * 1024,
  complaintDraftBytes: 128 * 1024,
  complaintGenerationBytes: 32 * 1024,
  correctionBytes: 48 * 1024,
  generalJsonBytes: 64 * 1024,
  searchQueryBytes: 2 * 1024,
} as const;

export function contentLengthExceeds(value: string | undefined, limitBytes: number) {
  if (!value || !/^\d+$/.test(value)) return false;
  const length = Number(value);
  return Number.isSafeInteger(length) && length > limitBytes;
}

export function queryStringBytes(originalUrl: string) {
  const queryStart = originalUrl.indexOf("?");
  return queryStart === -1 ? 0 : Buffer.byteLength(originalUrl.slice(queryStart + 1), "utf8");
}

const rejectDeclaredOversize = (limitBytes: number): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.body !== undefined) {
      next();
      return;
    }
    if (contentLengthExceeds(req.get("content-length"), limitBytes)) {
      next(new AppError("Request body is too large", 413));
      return;
    }
    next();
  };

export function jsonRequestLimit(limitBytes: number): RequestHandler[] {
  return [
    rejectDeclaredOversize(limitBytes),
    express.json({ limit: limitBytes, strict: true, type: "application/json" }),
  ];
}

export const limitSearchQuery = (limitBytes = REQUEST_SIZE_LIMITS.searchQueryBytes): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (queryStringBytes(req.originalUrl) > limitBytes) {
      next(new AppError("Search query is too large", 414));
      return;
    }
    next();
  };
