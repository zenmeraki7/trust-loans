import type { HarassmentCase } from "@prisma/client";

export const toCaseDto = (item: HarassmentCase & { timelineItems?: unknown[]; checklistItems?: unknown[]; externalComplaints?: unknown[] }) => ({
  ...item,
  privateNotice: "This case folder is private to you.",
  legalAdviceNotice: "This tool helps organize information and is not legal advice.",
});
