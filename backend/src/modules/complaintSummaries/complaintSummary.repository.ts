import { prisma } from "../../prisma/client.js";

export const complaintSummaryRepository = {
  findByLoanAppId(loanAppId: string) {
    return prisma.complaintSummary.findMany({
      where: { loanAppId },
      orderBy: { count: "desc" },
    });
  },
};

