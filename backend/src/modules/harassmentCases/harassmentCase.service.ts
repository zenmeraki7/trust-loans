import { HarassmentCaseType } from "@prisma/client";
import { allowedStatuses, authorizeAction, authorizeResource } from "../../authorization/authorization.js";
import type { AuthUser } from "../../middlewares/auth.js";
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

const mutableCaseStatuses = allowedStatuses("case.write") ?? [];

export const harassmentCaseService = {
  async create(user: AuthUser, input: CreateCaseInput) {
    authorizeAction(user, "case.write");
    await assertLoanAppExists(input.loanAppId);
    const created = await harassmentCaseRepository.create(user.id, input);
    const checklist = defaultChecklistByType[input.caseType as HarassmentCaseType] ?? [];
    for (const item of checklist) {
      await harassmentCaseRepository.createChecklistForUser(user.id, created.id, mutableCaseStatuses, item);
    }
    await auditLog({ actorId: user.id, action: "case.create", targetType: "HarassmentCase", targetId: created.id });
    return this.get(user, created.id);
  },
  list(user: AuthUser) { authorizeAction(user, "case.read"); return harassmentCaseRepository.listByUser(user.id); },
  async get(user: AuthUser, caseId: string) {
    const item = await harassmentCaseRepository.findByIdForUser(user.id, caseId);
    if (!item) throw new AppError("Case not found", 404);
    authorizeResource(user, "case.read", { ownerId: item.userId, status: item.status });
    return item;
  },
  async update(user: AuthUser, caseId: string, input: UpdateCaseInput) {
    await assertCaseWritable(user, caseId);
    await assertLoanAppExists(input.loanAppId);
    const updated = await harassmentCaseRepository.updateForUser(user.id, caseId, mutableCaseStatuses, input);
    if (!updated) throw new AppError("Case not found or no longer editable", 404);
    await auditLog({ actorId: user.id, action: "case.update", targetType: "HarassmentCase", targetId: caseId });
    return updated;
  },
  async archive(user: AuthUser, caseId: string) {
    await assertCaseWritable(user, caseId);
    const updated = await harassmentCaseRepository.archiveForUser(user.id, caseId, mutableCaseStatuses);
    if (!updated) throw new AppError("Case not found or no longer editable", 404);
    await auditLog({ actorId: user.id, action: "case.archive", targetType: "HarassmentCase", targetId: caseId });
    return updated;
  },
  async createTimeline(user: AuthUser, caseId: string, input: { type: string; title: string; description?: string; happenedAt?: Date; evidenceFileIds: string[] }) {
    await assertCaseWritable(user, caseId);
    const row = await harassmentCaseRepository.createTimelineForUser(user.id, caseId, mutableCaseStatuses, input);
    if (!row) throw new AppError("Case not found", 404);
    await auditLog({ actorId: user.id, action: "case.timeline.create", targetType: "CaseTimelineItem", targetId: row.id });
    return row;
  },
  async updateTimeline(user: AuthUser, caseId: string, itemId: string, input: Record<string, unknown>) {
    await assertCaseWritable(user, caseId);
    const row = await harassmentCaseRepository.updateTimelineForUser(user.id, caseId, itemId, mutableCaseStatuses, input);
    if (!row) throw new AppError("Timeline item not found", 404);
    await auditLog({ actorId: user.id, action: "case.timeline.update", targetType: "CaseTimelineItem", targetId: itemId });
    return row;
  },
  async deleteTimeline(user: AuthUser, caseId: string, itemId: string) { await assertCaseWritable(user, caseId); if (!(await harassmentCaseRepository.deleteTimelineForUser(user.id, caseId, itemId, mutableCaseStatuses))) throw new AppError("Timeline item not found", 404); await auditLog({ actorId: user.id, action: "case.timeline.delete", targetType: "CaseTimelineItem", targetId: itemId }); },
  async createChecklist(user: AuthUser, caseId: string, input: { label: string; description?: string }) { await assertCaseWritable(user, caseId); const row = await harassmentCaseRepository.createChecklistForUser(user.id, caseId, mutableCaseStatuses, input); if (!row) throw new AppError("Case not found", 404); return row; },
  async updateChecklist(user: AuthUser, caseId: string, itemId: string, input: { label?: string; description?: string; completed?: boolean }) { await assertCaseWritable(user, caseId); const row = await harassmentCaseRepository.updateChecklistForUser(user.id, caseId, itemId, mutableCaseStatuses, { ...input, completedAt: input.completed ? new Date() : null }); if (!row) throw new AppError("Checklist item not found", 404); return row; },
  async deleteChecklist(user: AuthUser, caseId: string, itemId: string) { await assertCaseWritable(user, caseId); if (!(await harassmentCaseRepository.deleteChecklistForUser(user.id, caseId, itemId, mutableCaseStatuses))) throw new AppError("Checklist item not found", 404); },
  async createExternalComplaint(user: AuthUser, caseId: string, input: Record<string, unknown>) { await assertCaseWritable(user, caseId); const row = await harassmentCaseRepository.createExternalComplaintForUser(user.id, caseId, mutableCaseStatuses, input); if (!row) throw new AppError("Case not found", 404); return row; },
  async updateExternalComplaint(user: AuthUser, caseId: string, complaintId: string, input: Record<string, unknown>) { await assertCaseWritable(user, caseId); const row = await harassmentCaseRepository.updateExternalComplaintForUser(user.id, caseId, complaintId, mutableCaseStatuses, input); if (!row) throw new AppError("External complaint not found", 404); return row; },
  async deleteExternalComplaint(user: AuthUser, caseId: string, complaintId: string) { await assertCaseWritable(user, caseId); if (!(await harassmentCaseRepository.deleteExternalComplaintForUser(user.id, caseId, complaintId, mutableCaseStatuses))) throw new AppError("External complaint not found", 404); },
  async linkReview(user: AuthUser, caseId: string, reviewId: string) { await assertCaseWritable(user, caseId); if (!(await harassmentCaseRepository.ownedReviewExists(user.id, reviewId))) throw new AppError("Review not found", 404); return harassmentCaseRepository.updateLinksForUser(user.id, caseId, mutableCaseStatuses, { linkedReviewId: reviewId }); },
  async linkEvidence(user: AuthUser, caseId: string, evidenceId: string) {
    if (!(await harassmentCaseRepository.ownedEvidenceExists(user.id, evidenceId))) throw new AppError("Evidence record not found", 404);
    const existing = await assertCaseWritable(user, caseId);
    return harassmentCaseRepository.updateLinksForUser(user.id, caseId, mutableCaseStatuses, { linkedEvidenceFileIds: [...new Set([...existing.linkedEvidenceFileIds, evidenceId])] });
  },
  async linkDecisionSession(user: AuthUser, caseId: string, sessionId: string) { await assertCaseWritable(user, caseId); return harassmentCaseRepository.updateLinksForUser(user.id, caseId, mutableCaseStatuses, { decisionTreeSessionId: sessionId }); },
  async linkComplaintDraft(user: AuthUser, caseId: string, draftId: string) {
    if (!(await harassmentCaseRepository.ownedComplaintDraftExists(user.id, draftId))) throw new AppError("Complaint draft not found", 404);
    const existing = await assertCaseWritable(user, caseId);
    return harassmentCaseRepository.updateLinksForUser(user.id, caseId, mutableCaseStatuses, { linkedComplaintDraftIds: [...new Set([...existing.linkedComplaintDraftIds, draftId])] });
  },
};

async function assertCaseWritable(user: AuthUser, caseId: string) {
  const item = await harassmentCaseRepository.findByIdForUser(user.id, caseId);
  if (!item) throw new AppError("Case not found", 404);
  authorizeResource(user, "case.write", { ownerId: item.userId, status: item.status });
  return item;
}

async function assertLoanAppExists(loanAppId?: string | null) {
  if (!loanAppId) return;
  const exists = await harassmentCaseRepository.loanAppExists(loanAppId);
  if (!exists) {
    throw new AppError("Loan app ID was not found. Leave it blank or use a valid internal loan app ID.", 400);
  }
}
