import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationQuerySchema>;

export const getPagination = (query: unknown) => {
  const parsed = paginationQuerySchema.parse(query);
  return {
    page: parsed.page,
    limit: parsed.limit,
    skip: (parsed.page - 1) * parsed.limit,
    take: parsed.limit,
  };
};

export const paginatedResponse = <T>(items: T[], total: number, page: number, limit: number) => ({
  items,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});

