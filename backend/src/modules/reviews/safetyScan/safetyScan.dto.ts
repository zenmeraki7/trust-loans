export type SafetyRiskType =
  | "privacy_data"
  | "direct_criminal_accusation"
  | "defamatory_label"
  | "abusive_language"
  | "threat_or_retaliation"
  | "private_phone_number"
  | "aadhaar_or_pan"
  | "bank_or_upi"
  | "otp_or_password"
  | "private_photo_reference"
  | "child_image_reference"
  | "unsupported_absolute_claim"
  | "doxxing"
  | "excessive_personal_details";

export type SafetySeverity = "low" | "medium" | "high" | "severe";

export type DetectedRisk = {
  id: string;
  type: SafetyRiskType;
  severity: SafetySeverity;
  phrase: string;
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
};
