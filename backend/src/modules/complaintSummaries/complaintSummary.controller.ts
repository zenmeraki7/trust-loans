import type { Request, Response } from "express";
import { toComplaintSummaryDto } from "./complaintSummary.dto.js";
import { complaintSummaryService } from "./complaintSummary.service.js";

export const complaintSummaryController = {
  async getByLoanApp(req: Request, res: Response) {
    const summaries = await complaintSummaryService.getByLoanAppId(req.params.loanAppId);
    res.json({
      loanAppId: req.params.loanAppId,
      items: summaries.map(toComplaintSummaryDto),
      note: "Complaint patterns are aggregated indicators, not legal findings.",
    });
  },
};

