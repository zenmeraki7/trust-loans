import { HarassmentCaseStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { ownedByUser } from "../../security/ownerScope.js";
import type { CreateCaseInput, UpdateCaseInput } from "./harassmentCase.validators.js";

export const harassmentCaseRepository = {
  create(userId: string, input: CreateCaseInput) {
    const data = normalizeCaseInput(input);
    return prisma.harassmentCase.create({
      data: {
        ...data,
        userId,
        linkedEvidenceFileIds: [],
        linkedComplaintDraftIds: [],
      },
    });
  },
  listByUser(userId: string) {
    return prisma.harassmentCase.findMany({ where: { userId }, include: { timelineItems: true, checklistItems: true, externalComplaints: true }, orderBy: { updatedAt: "desc" } });
  },
  findByIdForUser(userId: string, caseId: string) {
    return prisma.harassmentCase.findFirst({ where: ownedByUser(caseId, userId), include: { timelineItems: true, checklistItems: true, externalComplaints: true } });
  },
  async updateForUser(userId: string, caseId: string, allowedStatuses: readonly string[], input: UpdateCaseInput) {
    const updated = await prisma.harassmentCase.updateMany({
      where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }),
      data: normalizeCaseInput(input),
    });
    if (updated.count !== 1) return null;
    return prisma.harassmentCase.findFirst({ where: ownedByUser(caseId, userId) });
  },
  async archiveForUser(userId: string, caseId: string, allowedStatuses: readonly string[]) {
    const updated = await prisma.harassmentCase.updateMany({
      where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }),
      data: { status: HarassmentCaseStatus.ARCHIVED },
    });
    if (updated.count !== 1) return null;
    return prisma.harassmentCase.findFirst({ where: ownedByUser(caseId, userId) });
  },
  async createTimelineForUser(userId: string, caseId: string, allowedStatuses: readonly string[], input: { type: string; title: string; description?: string; happenedAt?: Date; evidenceFileIds: string[] }) {
    return prisma.$transaction(async (tx) => {
      const ownedCase = await tx.harassmentCase.count({ where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }) });
      if (ownedCase !== 1) return null;
      return tx.caseTimelineItem.create({ data: { caseId, ...input, type: input.type as never } });
    });
  },
  async updateTimelineForUser(userId: string, caseId: string, itemId: string, allowedStatuses: readonly string[], input: Record<string, unknown>) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.caseTimelineItem.updateMany({ where: { id: itemId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } }, data: input });
      if (updated.count !== 1) return null;
      return tx.caseTimelineItem.findFirst({ where: { id: itemId, caseId, case: { userId } } });
    });
  },
  async deleteTimelineForUser(userId: string, caseId: string, itemId: string, allowedStatuses: readonly string[]) {
    const result = await prisma.caseTimelineItem.deleteMany({ where: { id: itemId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } } });
    return result.count === 1;
  },
  async createChecklistForUser(userId: string, caseId: string, allowedStatuses: readonly string[], input: { label: string; description?: string }) {
    return prisma.$transaction(async (tx) => {
      const ownedCase = await tx.harassmentCase.count({ where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }) });
      if (ownedCase !== 1) return null;
      return tx.caseChecklistItem.create({ data: { caseId, ...input } });
    });
  },
  async updateChecklistForUser(userId: string, caseId: string, itemId: string, allowedStatuses: readonly string[], input: { label?: string; description?: string; completed?: boolean; completedAt?: Date | null }) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.caseChecklistItem.updateMany({ where: { id: itemId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } }, data: input });
      if (updated.count !== 1) return null;
      return tx.caseChecklistItem.findFirst({ where: { id: itemId, caseId, case: { userId } } });
    });
  },
  async deleteChecklistForUser(userId: string, caseId: string, itemId: string, allowedStatuses: readonly string[]) {
    const result = await prisma.caseChecklistItem.deleteMany({ where: { id: itemId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } } });
    return result.count === 1;
  },
  async createExternalComplaintForUser(userId: string, caseId: string, allowedStatuses: readonly string[], input: Record<string, unknown>) {
    return prisma.$transaction(async (tx) => {
      const ownedCase = await tx.harassmentCase.count({ where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }) });
      if (ownedCase !== 1) return null;
      return tx.externalComplaint.create({ data: { caseId, ...input, channel: input.channel as never } });
    });
  },
  async updateExternalComplaintForUser(userId: string, caseId: string, complaintId: string, allowedStatuses: readonly string[], input: Record<string, unknown>) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.externalComplaint.updateMany({ where: { id: complaintId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } }, data: input });
      if (updated.count !== 1) return null;
      return tx.externalComplaint.findFirst({ where: { id: complaintId, caseId, case: { userId } } });
    });
  },
  async deleteExternalComplaintForUser(userId: string, caseId: string, complaintId: string, allowedStatuses: readonly string[]) {
    const result = await prisma.externalComplaint.deleteMany({ where: { id: complaintId, caseId, case: { userId, status: { in: allowedStatuses as HarassmentCaseStatus[] } } } });
    return result.count === 1;
  },
  async updateLinksForUser(userId: string, caseId: string, allowedStatuses: readonly string[], data: Record<string, unknown>) {
    const result = await prisma.harassmentCase.updateMany({
      where: ownedByUser(caseId, userId, { status: { in: allowedStatuses as HarassmentCaseStatus[] } }),
      data,
    });
    if (result.count !== 1) return null;
    return prisma.harassmentCase.findFirst({ where: ownedByUser(caseId, userId) });
  },
  ownedReviewExists(userId: string, reviewId: string) {
    return prisma.review.count({ where: ownedByUser(reviewId, userId) });
  },
  ownedEvidenceExists(userId: string, evidenceId: string) {
    return prisma.evidenceFile.count({ where: ownedByUser(evidenceId, userId) });
  },
  ownedComplaintDraftExists(userId: string, draftId: string) {
    return prisma.complaintDraft.count({ where: ownedByUser(draftId, userId, { status: { not: "DELETED" } }) });
  },
  async loanAppExists(loanAppId: string) {
    const count = await prisma.loanApp.count({ where: { id: loanAppId } });
    return count > 0;
  },
};

function normalizeCaseInput<T extends CreateCaseInput | UpdateCaseInput>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => !(key === "loanAppId" && value === "")),
  ) as T;
}
