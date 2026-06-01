import { AppError } from "../../utils/AppError.js";
import { complaintTemplateRepository } from "./complaintTemplate.repository.js";
import { complaintTemplateRenderer } from "./complaintTemplate.renderer.js";
import type { CreateComplaintTemplateInput, GenerateComplaintTemplateInput, UpdateComplaintTemplateInput } from "./complaintTemplate.validators.js";

export const complaintTemplateService = {
  list(query: { category?: string; activeOnly?: boolean }) {
    return complaintTemplateRepository.list({
      category: query.category,
      activeOnly: query.activeOnly ?? true,
    });
  },

  async getByKey(key: string) {
    const template = await complaintTemplateRepository.findByKey(key);
    if (!template || !template.isActive) {
      throw new AppError("Complaint template not found", 404);
    }
    return template;
  },

  async generate(input: GenerateComplaintTemplateInput) {
    const template = await complaintTemplateRepository.findByKey(input.templateKey);
    if (!template || !template.isActive) {
      throw new AppError("Complaint template not found", 404);
    }
    if (!template.outputTypes.includes(input.outputType)) {
      throw new AppError("Output type is not supported for this template", 400);
    }
    return complaintTemplateRenderer.render({
      templateTitle: template.title,
      templateKey: template.key,
      outputType: input.outputType,
      formData: input.formData,
    });
  },

  create(input: CreateComplaintTemplateInput) {
    return complaintTemplateRepository.create(input);
  },

  async update(id: string, input: UpdateComplaintTemplateInput) {
    const existing = await complaintTemplateRepository.findById(id);
    if (!existing) {
      throw new AppError("Complaint template not found", 404);
    }
    return complaintTemplateRepository.update(id, input);
  },

  async setActive(id: string, isActive: boolean) {
    const existing = await complaintTemplateRepository.findById(id);
    if (!existing) {
      throw new AppError("Complaint template not found", 404);
    }
    return complaintTemplateRepository.setActive(id, isActive);
  },
};
