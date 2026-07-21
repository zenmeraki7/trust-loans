import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination.js";

export const listAuditLogsSchema = z.object({
  query: paginationQuerySchema.extend({
    actorId: z.string().optional(),
    targetType: z.string().optional(),
    targetId: z.string().optional(),
    action: z.string().optional(),
  }),
});

export const auditLogIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }).strict(),
});
