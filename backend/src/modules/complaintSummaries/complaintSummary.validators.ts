import { z } from "zod";

export const complaintSummaryAppParamSchema = z.object({
  params: z.object({ loanAppId: z.string().min(1) }).strict(),
});
