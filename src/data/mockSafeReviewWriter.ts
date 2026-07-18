import type { SafeReviewWriterData } from "@/types/safeReviewWriter";

export const safeReviewWriter: SafeReviewWriterData = {
  input:
    "This company is fraud. They called my entire contact list and threatened me. Pay to this personal UPI now or we will ruin your life. My Aadhaar is 1234 5678 9012 and my phone is 9876543210.",
  detectedRisks: [
    {
      type: "direct_accusation",
      phrase: "This company is fraud.",
      severity: "high",
      suggestion: "Based on my experience, I faced issues with clarity of charges and recovery communication.",
      explanation: "Safer wording keeps your meaning while avoiding direct legal conclusions.",
    },
    {
      type: "private_phone",
      phrase: "my phone is 9876543210",
      severity: "high",
      suggestion: "[private phone number removed]",
      explanation: "Avoid private information in public reviews.",
    },
    {
      type: "aadhaar_pattern",
      phrase: "My Aadhaar is 1234 5678 9012",
      severity: "high",
      suggestion: "[private ID removed]",
      explanation: "Do not include Aadhaar/PAN details.",
    },
    {
      type: "abusive_or_threatening",
      phrase: "we will ruin your life",
      severity: "medium",
      suggestion: "I received threatening language in calls/messages.",
      explanation: "Factual phrasing is moderation-friendly and clearer for review teams.",
    },
  ],
  rewrittenReview:
    "Based on my experience, I faced issues with clarity of charges and repayment communication. I received calls that appeared to involve contact pressure and threatening language. I was asked to make payment to a personal UPI account, which I could not independently verify. I am sharing this factual experience so others can verify repayment channels and preserve evidence before making payment.",
  safetyScore: {
    privacyRisk: 82,
    defamationRisk: 74,
    abuseRisk: 61,
    evidenceSafety: 58,
    moderationReadiness: 36,
  },
};
