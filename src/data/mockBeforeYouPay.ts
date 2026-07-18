import type { BeforeYouPayData } from "@/types/beforeYouPay";

export const beforeYouPay: BeforeYouPayData = {
  repaymentChecklist: [
    "Confirm official repayment channel",
    "Check loan ID/reference",
    "Confirm lender/app name",
    "Verify total due amount",
    "Check due date",
    "Confirm whether penalties are shown",
    "Avoid personal UPI unless officially verified",
    "Take screenshots before payment",
    "Save receipt after payment",
    "Confirm loan closure",
  ],
  warningSigns: [
    "Personal UPI ID",
    "Threat to pay immediately",
    "No written due details",
    "Payment link from unknown number",
    "Different app/company name",
    "No receipt provided",
    "Loan remains active after payment",
  ],
  afterPaymentChecklist: [
    "Save transaction ID",
    "Screenshot success page",
    "Check app status",
    "Ask for closure confirmation",
    "Email grievance/support",
    "Preserve acknowledgement",
  ],
  actionFlow: [
    "Wait reasonable processing time",
    "Collect proof",
    "Contact support/grievance officer",
    "Submit complaint",
    "Use payment not updated template",
    "Leave a safe review",
  ],
};
