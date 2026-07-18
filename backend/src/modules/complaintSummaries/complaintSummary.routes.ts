import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { complaintSummaryController } from "./complaintSummary.controller.js";
import { complaintSummaryAppParamSchema } from "./complaintSummary.validators.js";

export const complaintSummaryRoutes = Router();

complaintSummaryRoutes.get(
  "/apps/:loanAppId",
  validate(complaintSummaryAppParamSchema),
  asyncHandler(complaintSummaryController.getByLoanApp),
);

