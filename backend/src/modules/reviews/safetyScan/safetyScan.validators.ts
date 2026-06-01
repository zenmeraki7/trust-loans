import { ReviewType } from "@prisma/client";
import { z } from "zod";

export const safetyScanSchema = z.object({
  body: z.object({
    title: z.string().trim().max(160).default(""),
    body: z.string().trim().min(1).max(5000),
    tags: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
    reviewType: z.nativeEnum(ReviewType).optional(),
  }),
});

export type SafetyScanInput = z.infer<typeof safetyScanSchema>["body"];
