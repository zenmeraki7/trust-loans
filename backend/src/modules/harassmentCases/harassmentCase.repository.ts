import { prisma } from "../../prisma/client.js";
import type { CreateCaseInput, UpdateCaseInput } from "./harassmentCase.validators.js";

export const harassmentCaseRepository = {
  create(userId: string, input: CreateCaseInput) {
    return prisma.harassmentCase.create({ data: { ...input, userId, linkedEvidenceFileIds: [], linkedComplaintDraftIds: [] } });
  },
  listByUser(userId: string) {
    return prisma.harassmentCase.findMany({ where: { userId }, include: { timelineItems: true, checklistItems: true, externalComplaints: true }, orderBy: { updatedAt: "desc" } });
  },
  findByIdForUser(userId: string, caseId: string) {
    return prisma.harassmentCase.findFirst({ where: { id: caseId, userId }, include: { timelineItems: true, checklistItems: true, externalComplaints: true } });
  },
  updateById(caseId: string, input: UpdateCaseInput) {
    return prisma.harassmentCase.update({ where: { id: caseId }, data: input });
  },
  archive(caseId: string) {
    return prisma.harassmentCase.update({ where: { id: caseId }, data: { status: "ARCHIVED" } });
  },
  createTimeline(caseId: string, input: { type: string; title: string; description?: string; happenedAt?: Date; evidenceFileIds: string[] }) {
    return prisma.caseTimelineItem.create({ data: { caseId, ...input, type: input.type as never } });
  },
  updateTimeline(itemId: string, input: Record<string, unknown>) {
    return prisma.caseTimelineItem.update({ where: { id: itemId }, data: input });
  },
  deleteTimeline(itemId: string) { return prisma.caseTimelineItem.delete({ where: { id: itemId } }); },
  createChecklist(caseId: string, input: { label: string; description?: string }) { return prisma.caseChecklistItem.create({ data: { caseId, ...input } }); },
  updateChecklist(itemId: string, input: { label?: string; description?: string; completed?: boolean; completedAt?: Date | null }) { return prisma.caseChecklistItem.update({ where: { id: itemId }, data: input }); },
  deleteChecklist(itemId: string) { return prisma.caseChecklistItem.delete({ where: { id: itemId } }); },
  createExternalComplaint(caseId: string, input: Record<string, unknown>) { return prisma.externalComplaint.create({ data: { caseId, ...input, channel: input.channel as never } }); },
  updateExternalComplaint(complaintId: string, input: Record<string, unknown>) { return prisma.externalComplaint.update({ where: { id: complaintId }, data: input }); },
  deleteExternalComplaint(complaintId: string) { return prisma.externalComplaint.delete({ where: { id: complaintId } }); },
  updateLinks(caseId: string, data: Record<string, unknown>) { return prisma.harassmentCase.update({ where: { id: caseId }, data }); },
};
