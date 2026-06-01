import { AppError } from "../../utils/AppError.js";
import { loanAppRepository } from "../loanApps/loanApp.repository.js";
import { complaintSummaryRepository } from "./complaintSummary.repository.js";

export const complaintSummaryService = {
  async getByLoanAppId(loanAppId: string) {
    const app = await loanAppRepository.findById(loanAppId);
    if (!app) {
      throw new AppError("Loan app not found", 404);
    }
    return complaintSummaryRepository.findByLoanAppId(loanAppId);
  },
};

