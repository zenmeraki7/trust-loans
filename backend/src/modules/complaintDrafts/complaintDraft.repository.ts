import { ComplaintDraftStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { ownedByUser } from "../../security/ownerScope.js";
import type { CreateComplaintDraftInput, UpdateComplaintDraftInput } from "../complaintTemplates/complaintTemplate.validators.js";

export const complaintDraftRepository = {
  create(userId: string, input: CreateComplaintDraftInput) {
    return prisma.complaintDraft.create({
      data: {
        userId,
        templateId: input.templateId,
        loanAppId: input.loanAppId,
        title: input.title,
        templateKey: input.templateKey,
        outputType: input.outputType,
        status: ComplaintDraftStatus.DRAFT,
        formData: input.formData,
        generatedSubject: input.generatedSubject,
        generatedBody: input.generatedBody,
      },
    });
  },

  listByUser(userId: string) {
    return prisma.complaintDraft.findMany({
      where: { userId, status: { not: ComplaintDraftStatus.DELETED } },
      orderBy: { updatedAt: "desc" },
    });
  },

  findByIdForUser(userId: string, id: string) {
    return prisma.complaintDraft.findFirst({
      where: ownedByUser(id, userId, { status: { not: ComplaintDraftStatus.DELETED } }),
    });
  },

  updateForUser(userId: string, id: string, input: UpdateComplaintDraftInput) {
    return prisma.complaintDraft.updateMany({
      where: ownedByUser(id, userId, { status: { not: ComplaintDraftStatus.DELETED } }),
      data: input,
    });
  },

  markDeleted(userId: string, id: string) {
    return prisma.complaintDraft.updateMany({
      where: ownedByUser(id, userId, { status: { not: ComplaintDraftStatus.DELETED } }),
      data: { status: ComplaintDraftStatus.DELETED },
    });
  },
};
