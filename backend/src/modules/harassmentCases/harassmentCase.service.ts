import { HarassmentCaseType } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { harassmentCaseRepository } from "./harassmentCase.repository.js";
import type { CreateCaseInput, UpdateCaseInput } from "./harassmentCase.validators.js";

const defaultChecklistByType: Partial<Record<HarassmentCaseType, Array<{ label: string; description?: string }>>> = {
  PHOTO_MORPHING_THREAT: [
    { label: "Preserve screenshots" },
    { label: "Save sender number privately" },
    { label: "Do not share more photos/documents" },
    { label: "Consider cybercrime portal" },
    { label: "Inform trusted person if needed" },
    { label: "Use photo morphing complaint template" },
    { label: "Submit safe review/report" },
  ],
  PAYMENT_NOT_UPDATED: [
    { label: "Save payment receipt" },
    { label: "Screenshot app pending status" },
    { label: "Email support/grievance officer" },
    { label: "Save acknowledgement" },
    { label: "Use payment not updated template" },
    { label: "Consider RBI/consumer complaint if applicable" },
  ],
  CONTACT_LIST_ABUSE: [
    { label: "Ask relative to save call log" },
    { label: "Ask relative not to share information" },
    { label: "Preserve screenshots/call logs" },
    { label: "Use family message helper" },
    { label: "Use contact-list abuse complaint template" },
  ],
};

export const harassmentCaseService = {
  async create(userId: string, input: CreateCaseInput) {
    const created = await harassmentCaseRepository.create(userId, input);
    const checklist = defaultChecklistByType[input.caseType as HarassmentCaseType] ?? [];
    for (const item of checklist) {
      await harassmentCaseRepository.createChecklist(created.id, item);
    }
    await auditLog({ actorId: userId, action: "case.create", targetType: "HarassmentCase", targetId: created.id });
    return this.get(userId, created.id);
  },
  list(userId: string) { return harassmentCaseRepository.listByUser(userId); },
  async get(userId: string, caseId: string) {
    const item = await harassmentCaseRepository.findByIdForUser(userId, caseId);
    if (!item) throw new AppError("Case not found", 404);
    return item;
  },
  async update(userId: string, caseId: string, input: UpdateCaseInput) {
    await this.get(userId, caseId);
    const updated = await harassmentCaseRepository.updateById(caseId, input);
    await auditLog({ actorId: userId, action: "case.update", targetType: "HarassmentCase", targetId: caseId });
    return updated;
  },
  async archive(userId: string, caseId: string) {
    await this.get(userId, caseId);
    const updated = await harassmentCaseRepository.archive(caseId);
    await auditLog({ actorId: userId, action: "case.archive", targetType: "HarassmentCase", targetId: caseId });
    return updated;
  },
  async createTimeline(userId: string, caseId: string, input: { type: string; title: string; description?: string; happenedAt?: Date; evidenceFileIds: string[] }) {
    await this.get(userId, caseId);
    const row = await harassmentCaseRepository.createTimeline(caseId, input);
    await auditLog({ actorId: userId, action: "case.timeline.create", targetType: "CaseTimelineItem", targetId: row.id });
    return row;
  },
  async updateTimeline(userId: string, caseId: string, itemId: string, input: Record<string, unknown>) {
    await this.get(userId, caseId);
    const row = await harassmentCaseRepository.updateTimeline(itemId, input);
    await auditLog({ actorId: userId, action: "case.timeline.update", targetType: "CaseTimelineItem", targetId: itemId });
    return row;
  },
  async deleteTimeline(userId: string, caseId: string, itemId: string) { await this.get(userId, caseId); await harassmentCaseRepository.deleteTimeline(itemId); await auditLog({ actorId: userId, action: "case.timeline.delete", targetType: "CaseTimelineItem", targetId: itemId }); },
  async createChecklist(userId: string, caseId: string, input: { label: string; description?: string }) { await this.get(userId, caseId); return harassmentCaseRepository.createChecklist(caseId, input); },
  async updateChecklist(userId: string, caseId: string, itemId: string, input: { label?: string; description?: string; completed?: boolean }) { await this.get(userId, caseId); return harassmentCaseRepository.updateChecklist(itemId, { ...input, completedAt: input.completed ? new Date() : null }); },
  async deleteChecklist(userId: string, caseId: string, itemId: string) { await this.get(userId, caseId); await harassmentCaseRepository.deleteChecklist(itemId); },
  async createExternalComplaint(userId: string, caseId: string, input: Record<string, unknown>) { await this.get(userId, caseId); return harassmentCaseRepository.createExternalComplaint(caseId, input); },
  async updateExternalComplaint(userId: string, caseId: string, complaintId: string, input: Record<string, unknown>) { await this.get(userId, caseId); return harassmentCaseRepository.updateExternalComplaint(complaintId, input); },
  async deleteExternalComplaint(userId: string, caseId: string, complaintId: string) { await this.get(userId, caseId); await harassmentCaseRepository.deleteExternalComplaint(complaintId); },
  async linkReview(userId: string, caseId: string, reviewId: string) { await this.get(userId, caseId); return harassmentCaseRepository.updateLinks(caseId, { linkedReviewId: reviewId }); },
  async linkEvidence(userId: string, caseId: string, evidenceId: string) {
    const existing = await this.get(userId, caseId);
    return harassmentCaseRepository.updateLinks(caseId, { linkedEvidenceFileIds: [...existing.linkedEvidenceFileIds, evidenceId] });
  },
  async linkDecisionSession(userId: string, caseId: string, sessionId: string) { await this.get(userId, caseId); return harassmentCaseRepository.updateLinks(caseId, { decisionTreeSessionId: sessionId }); },
  async linkComplaintDraft(userId: string, caseId: string, draftId: string) {
    const existing = await this.get(userId, caseId);
    return harassmentCaseRepository.updateLinks(caseId, { linkedComplaintDraftIds: [...existing.linkedComplaintDraftIds, draftId] });
  },
};
