import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { InvalidCredentialsError } from "../modules/auth/auth.errors.js";
import { safeErrorType } from "../utils/safeLogging.js";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.path}`, 404));
};

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const parserError = error as { type?: string; status?: number; statusCode?: number };
  if (parserError?.type === "entity.too.large" || parserError?.status === 413 || parserError?.statusCode === 413) {
    res.status(413).json({ message: "Request body is too large" });
    return;
  }
  if (parserError?.type === "entity.parse.failed") {
    res.status(400).json({ message: "Request body must contain valid JSON" });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: error.issues,
    });
    return;
  }

  if (error instanceof AppError) {
    if (error instanceof InvalidCredentialsError) {
      res.status(error.statusCode).json({
        error: error.message,
        ...(error.challengeRequired ? { challengeRequired: true } : {}),
      });
      return;
    }
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error("Unhandled request error.", {
    requestId: req.requestId,
    errorType: safeErrorType(error),
  });
  res.status(500).json({ message: "Internal server error" });
};
