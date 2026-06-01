import { runSafetyRules } from "./safetyScan.rules.js";
import type { SafetyScanInput } from "./safetyScan.validators.js";

const severeTypes = new Set(["aadhaar_or_pan", "otp_or_password", "bank_or_upi", "private_photo_reference", "child_image_reference"]);

export const safetyScanService = {
  scan(input: SafetyScanInput) {
    const normalizedBody = input.body.trim().replace(/\s+/g, " ");
    const risks = runSafetyRules(normalizedBody);

    const privacyRisk = Math.min(100, risks.filter((r) => severeTypes.has(r.type) || r.type === "private_phone_number").length * 25);
    const defamationRisk = Math.min(100, risks.filter((r) => r.type === "defamatory_label" || r.type === "unsupported_absolute_claim").length * 30);
    const abuseRisk = Math.min(100, risks.filter((r) => r.type === "threat_or_retaliation" || r.type === "abusive_language").length * 35);
    const moderationReadiness = Math.max(0, 100 - Math.round(privacyRisk * 0.45 + defamationRisk * 0.3 + abuseRisk * 0.25));

    const suggestedBody = normalizedBody
      .replace(/\b(fraud|scam|criminals?|thief|illegal gang|money laundering|fake company)\b/gi, "concerning behaviour")
      .replace(/\b(i will destroy|share this everywhere|arrest them immediately)\b/gi, "I request a review through appropriate channels")
      .replace(/\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g, "[number shared privately]")
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b|\b[A-Z]{5}[0-9]{4}[A-Z]\b/gi, "[sensitive id removed]");

    const warnings = [
      "Do not include Aadhaar, PAN, OTPs, passwords, full bank details, or private photos.",
      "Do not post private phone numbers publicly.",
    ];

    const canSubmit = !risks.some((risk) => severeTypes.has(risk.type));

    return {
      score: { privacyRisk, defamationRisk, abuseRisk, moderationReadiness },
      detectedRisks: risks,
      suggestedTitle: input.title || "Review based on my experience",
      suggestedBody,
      warnings,
      canSubmit,
    };
  },
};
