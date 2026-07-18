import type { ComplaintSummary } from "@prisma/client";

export const toComplaintSummaryDto = (summary: ComplaintSummary) => ({
  tag: summary.tag,
  count: summary.count,
  percentage: summary.percentage,
  lastCalculatedAt: summary.lastCalculatedAt,
  note: "Complaint summaries are aggregated from user-submitted reviews and are not legal findings.",
});

