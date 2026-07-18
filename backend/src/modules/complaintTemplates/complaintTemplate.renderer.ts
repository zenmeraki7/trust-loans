import type { ComplaintOutputType } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";

const SENSITIVE_PATTERNS = [/(aadhaar|aadhar)/i, /\bpan\b/i, /otp/i, /password/i, /(bank account|ifsc|cvv)/i, /(private photo|personal photo)/i];
const BAN_WORDS = [/\bfraud\b/i, /\bcriminal\b/i, /\bscam\b/i, /arrest immediately/i, /illegal gang/i, /money laundering/i, /i will destroy them/i];

export const complaintTemplateRenderer = {
  render(input: {
    templateTitle: string;
    templateKey: string;
    outputType: ComplaintOutputType;
    formData: Record<string, unknown>;
  }) {
    const formData = sanitizeFormData(input.formData);
    const warnings = collectWarnings(formData);
    const subject = `Complaint regarding loan app experience - ${String(formData.loanAppName ?? "Loan app")}`;

    const bodyLines = [
      "I wish to report a concern regarding my loan app experience.",
      "I experienced the following issues and I request your review.",
      "",
      `Template: ${input.templateTitle}`,
      `Loan App: ${safe(formData.loanAppName)}`,
      `Company (if known): ${safe(formData.companyName)}`,
      `Claimed Lender/NBFC Partner (if known): ${safe(formData.claimedNbfcPartner)}`,
      `Loan Reference (if available): ${safe(formData.loanReferenceId)}`,
      `Incident Date/Time: ${safe(formData.incidentDate)} ${safe(formData.incidentTime)}`.trim(),
      "",
      `Summary: ${safe(formData.shortSummary)}`,
      `Details: ${safe(formData.detailedDescription)}`,
      `Evidence Mentioned: ${safe(formData.evidenceAvailable)}`,
      `Requested Resolution: ${safe(formData.desiredResolution)}`,
      "",
      outputHint(input.outputType, input.templateKey),
      "Attached are supporting screenshots/payment proof where applicable.",
      "Please verify and take appropriate action.",
      "Please acknowledge receipt of this complaint.",
      "",
      "Privacy reminder: I have avoided sharing Aadhaar, PAN, OTPs, passwords, full bank account details, and private photos in this text.",
      "This draft is for general drafting support only and is not legal advice.",
    ];

    const generatedBody = bodyLines.filter(Boolean).join("\n");
    for (const regex of BAN_WORDS) {
      if (regex.test(generatedBody)) {
        throw new AppError("Generated output failed safety checks", 500);
      }
    }

    return { generatedSubject: subject, generatedBody, warnings, sanitizedFormData: formData };
  },
};

function sanitizeFormData(formData: Record<string, unknown>) {
  const data = { ...formData };
  if (typeof data.userPhone === "string") {
    data.userPhone = maskPhone(data.userPhone);
  }
  if (typeof data.recoveryAgentNumber === "string") {
    data.recoveryAgentNumber = maskPhone(data.recoveryAgentNumber);
  }
  delete data["aadhaar"];
  delete data["pan"];
  delete data["otp"];
  delete data["password"];
  delete data["bankAccount"];
  return data;
}

function collectWarnings(formData: Record<string, unknown>) {
  const warnings = [
    "Do not include Aadhaar, PAN, OTP, passwords, bank account numbers, private photos, or unrelated personal chats.",
    "Attach evidence only after masking sensitive data.",
  ];
  const flatText = Object.values(formData).filter((value) => typeof value === "string").join(" ");
  const foundRisk = SENSITIVE_PATTERNS.some((pattern) => pattern.test(flatText));
  if (foundRisk) {
    warnings.unshift("Potentially sensitive data detected. Remove personal identifiers before sending.");
  }
  return warnings;
}

function outputHint(outputType: ComplaintOutputType, templateKey: string) {
  if (outputType === "CYBERCRIME_TEXT") {
    return "This note focuses on online threats, impersonation, blackmail patterns, and requests preservation of evidence.";
  }
  if (outputType === "RBI_CMS_TEXT") {
    return "This note focuses on service issues, repayment update concerns, closure issues, or grievance escalation points for review.";
  }
  if (outputType === "ADVOCATE_BRIEFING_NOTE" || templateKey === "advocate_briefing_note") {
    return "This chronology is prepared for legal review and avoids legal conclusions.";
  }
  return "This draft is factual and calm for grievance communication.";
}

function safe(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Not provided";
  }
  return value.trim();
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) {
    return "Masked";
  }
  return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}
