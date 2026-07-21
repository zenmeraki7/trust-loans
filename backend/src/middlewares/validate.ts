import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/AppError.js";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

export function unexpectedRequestFields(original: unknown, parsed: unknown, prefix = ""): string[] {
  if (Array.isArray(original) && Array.isArray(parsed)) {
    return original.flatMap((item, index) => unexpectedRequestFields(item, parsed[index], `${prefix}[${index}]`));
  }
  if (!isPlainObject(original)) return [];
  const parsedObject = isPlainObject(parsed) ? parsed : {};
  return Object.entries(original).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in parsedObject)) {
      const emptyUnusedEnvelopeSection = !prefix
        && ["body", "params", "query"].includes(key)
        && isPlainObject(value)
        && Object.keys(value).length === 0;
      if (value === undefined || emptyUnusedEnvelopeSection) return [];
      return [path];
    }
    return unexpectedRequestFields(value, parsedObject[key], path);
  });
}

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const requestEnvelope = {
      body: req.body,
      params: req.params,
      query: req.query,
    };
    const parsed = schema.safeParse(requestEnvelope);

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    const unexpected = unexpectedRequestFields(requestEnvelope, parsed.data);
    if (unexpected.length > 0) {
      next(new AppError("Unexpected request fields", 400, { fields: unexpected.slice(0, 20) }));
      return;
    }

    req.body = parsed.data.body ?? req.body;
    req.params = parsed.data.params ?? req.params;
    req.query = parsed.data.query ?? req.query;
    next();
  };
