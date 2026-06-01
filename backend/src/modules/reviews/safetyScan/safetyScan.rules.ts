import type { DetectedRisk, SafetyRiskType, SafetySeverity } from "./safetyScan.dto.js";

type Rule = { type: SafetyRiskType; severity: SafetySeverity; regex: RegExp; message: string; suggestion: string };

const rules: Rule[] = [
  { type: "aadhaar_or_pan", severity: "severe", regex: /\b\d{4}\s?\d{4}\s?\d{4}\b|\b[A-Z]{5}[0-9]{4}[A-Z]\b/gi, message: "Potential Aadhaar/PAN data detected.", suggestion: "Remove identity numbers from public review." },
  { type: "private_phone_number", severity: "high", regex: /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g, message: "Private phone number detected.", suggestion: "Say number shared privately as evidence." },
  { type: "bank_or_upi", severity: "severe", regex: /\b\d{9,18}\b|\b[\w.-]{2,}@[a-zA-Z]{2,}\b/g, message: "Possible bank account or UPI ID detected.", suggestion: "Remove account/UPI identifiers." },
  { type: "otp_or_password", severity: "severe", regex: /\b(otp|password|passcode|pin)\b/gi, message: "Sensitive authentication data reference.", suggestion: "Do not include OTP/password details." },
  { type: "defamatory_label", severity: "high", regex: /\b(fraud|scam|criminals?|thief|illegal gang|money laundering|fake company)\b/gi, message: "Direct accusatory wording detected.", suggestion: "Rephrase as your experience without legal labels." },
  { type: "threat_or_retaliation", severity: "high", regex: /\b(i will destroy|share this everywhere|arrest them immediately)\b/gi, message: "Threatening/retaliatory wording detected.", suggestion: "Use calm factual wording and request review." },
  { type: "unsupported_absolute_claim", severity: "medium", regex: /\b(definitely|always|everyone knows|100% sure)\b/gi, message: "Absolute claim without context.", suggestion: "Add context: based on my experience." },
  { type: "private_photo_reference", severity: "severe", regex: /\b(private photo|nude|intimate photo)\b/gi, message: "Private photo reference detected.", suggestion: "Keep sensitive image details private; mention evidence preserved." },
  { type: "child_image_reference", severity: "severe", regex: /\b(child photo|minor photo)\b/gi, message: "Child image reference detected.", suggestion: "Do not include child image details in public review." },
];

export function runSafetyRules(text: string): DetectedRisk[] {
  const risks: DetectedRisk[] = [];
  for (const rule of rules) {
    for (const match of text.matchAll(rule.regex)) {
      const phrase = match[0];
      const startIndex = match.index ?? 0;
      risks.push({
        id: `${rule.type}-${startIndex}`,
        type: rule.type,
        severity: rule.severity,
        phrase,
        message: rule.message,
        suggestion: rule.suggestion,
        startIndex,
        endIndex: startIndex + phrase.length,
      });
    }
  }
  return risks;
}
