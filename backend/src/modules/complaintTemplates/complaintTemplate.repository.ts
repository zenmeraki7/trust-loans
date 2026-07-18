import { prisma } from "../../prisma/client.js";
import type { CreateComplaintTemplateInput, UpdateComplaintTemplateInput } from "./complaintTemplate.validators.js";

export const complaintTemplateRepository = {
  list(input: { category?: string; activeOnly: boolean }) {
    return prisma.complaintTemplate.findMany({
      where: {
        category: input.category as never,
        ...(input.activeOnly ? { isActive: true } : {}),
      },
      orderBy: { createdAt: "asc" },
    });
  },

  findByKey(key: string) {
    return prisma.complaintTemplate.findUnique({ where: { key } });
  },

  findById(id: string) {
    return prisma.complaintTemplate.findUnique({ where: { id } });
  },

  create(input: CreateComplaintTemplateInput) {
    return prisma.complaintTemplate.create({
      data: {
        key: input.key,
        title: input.title,
        category: input.category,
        description: input.description,
        outputTypes: input.outputTypes,
        isActive: input.isActive,
      },
    });
  },

  update(id: string, input: UpdateComplaintTemplateInput) {
    return prisma.complaintTemplate.update({
      where: { id },
      data: input,
    });
  },

  setActive(id: string, isActive: boolean) {
    return prisma.complaintTemplate.update({ where: { id }, data: { isActive } });
  },
};
