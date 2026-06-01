import { AppError } from "../../utils/AppError.js";
import { complaintDraftRepository } from "./complaintDraft.repository.js";
import type { CreateComplaintDraftInput, UpdateComplaintDraftInput } from "../complaintTemplates/complaintTemplate.validators.js";

export const complaintDraftService = {
  create(userId: string, input: CreateComplaintDraftInput) {
    return complaintDraftRepository.create(userId, input);
  },

  list(userId: string) {
    return complaintDraftRepository.listByUser(userId);
  },

  async get(userId: string, id: string) {
    const draft = await complaintDraftRepository.findByIdForUser(userId, id);
    if (!draft) {
      throw new AppError("Complaint draft not found", 404);
    }
    return draft;
  },

  async update(userId: string, id: string, input: UpdateComplaintDraftInput) {
    const result = await complaintDraftRepository.updateForUser(userId, id, input);
    if (result.count === 0) {
      throw new AppError("Complaint draft not found", 404);
    }
    return this.get(userId, id);
  },

  async remove(userId: string, id: string) {
    const result = await complaintDraftRepository.markDeleted(userId, id);
    if (result.count === 0) {
      throw new AppError("Complaint draft not found", 404);
    }
  },
};
