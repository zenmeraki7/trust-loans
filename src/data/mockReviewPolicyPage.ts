import type { ReviewPolicyPageData } from "@/types/reviewPolicyPage";

export const reviewPolicyPage: ReviewPolicyPageData = {
  principles: [
    { id: "p1", title: "Reviews must be based on real experience", description: "Reviews should reflect user-submitted experience with factual details.", icon: "📝" },
    { id: "p2", title: "Do not post private personal data", description: "Private identifiers and personal contact details are not allowed publicly.", icon: "🔒" },
    { id: "p3", title: "Evidence is private by default", description: "Evidence, if submitted, is handled privately for moderation and safety checks.", icon: "🛡" },
    { id: "p4", title: "Companies may respond", description: "Verified companies may respond under policy-compliant public response rules.", icon: "🏢" },
  ],
  allowedContent: [
    {
      id: "a1",
      title: "User borrowing experience",
      description: "Users may share repayment or support experiences in clear factual wording.",
      examples: [
        "I was charged Rs X as processing fee before disbursal.",
        "My payment was made on DATE but the app still showed pending.",
      ],
    },
  ],
  prohibitedContent: [
    { id: "x1", title: "Sensitive personal data", description: "Aadhaar, PAN, bank details, OTPs, passwords, private photos.", severity: "high" },
    { id: "x2", title: "Abusive or retaliatory content", description: "Threats, doxxing, revenge statements, harassment.", severity: "high" },
    { id: "x3", title: "Misleading or fake submissions", description: "False claims, spam, duplicate manipulated content.", severity: "medium" },
  ],
  saferWordingExamples: [
    {
      unsafe: "This company is a fraud.",
      safer: "I believe the charges were not explained clearly, based on my experience.",
      explanation: "Focuses on user-reported experience rather than legal conclusion.",
    },
    {
      unsafe: "They are criminals.",
      safer: "I experienced behaviour that I found threatening and have preserved screenshots.",
      explanation: "Describes alleged experience with factual framing.",
    },
  ],
  moderationSteps: [
    { step: 1, title: "Review submitted", description: "Initial submission received.", statusKey: "submitted" },
    { step: 2, title: "Automated scan", description: "Privacy/safety checks for sensitive data and policy risks.", statusKey: "under_moderation" },
    { step: 3, title: "Moderator review", description: "Human review for fairness and compliance.", statusKey: "in_review" },
    { step: 4, title: "Redaction if needed", description: "Sensitive details may be edited or redacted.", statusKey: "needs_redaction" },
    { step: 5, title: "Decision", description: "Published, partially published, rejected, or sent for clarification.", statusKey: "decision" },
  ],
  evidencePolicy: {
    allowedPrivateEvidence: [
      "Screenshots of messages",
      "Payment receipts with sensitive info hidden",
      "App screenshots",
      "Email communication",
    ],
    prohibitedEvidence: [
      "Aadhaar/PAN",
      "Bank statements",
      "OTP/password screenshots",
      "Private photos",
      "Child photos",
      "Contact list dumps",
    ],
    privacyNotes: [
      "Evidence is optional.",
      "Evidence is private by default.",
      "Companies cannot access private evidence.",
    ],
  },
  companyPolicy: {
    allowedActions: [
      "Claim verified profile",
      "Respond publicly",
      "Request correction of public details",
      "Flag policy-violating reviews",
    ],
    prohibitedActions: [
      "Delete reviews directly",
      "Access private evidence",
      "Access reviewer private contacts",
      "Threaten users",
    ],
  },
  removalReasons: [
    "Private personal data",
    "Doxxing",
    "Abusive language",
    "Threats",
    "Spam or duplicate content",
    "False or misleading information",
  ],
  correctionDisputeOptions: [
    "Users can request edits",
    "Users can withdraw reviews",
    "Companies can request factual corrections",
    "Disputed content may be temporarily hidden during review",
  ],
  privacyCommitments: [
    "We mask user contact details",
    "We do not display private evidence by default",
    "We remove sensitive personal data",
    "We moderate company responses",
  ],
  appeals: {
    userAppeals: [
      "If review is rejected, user may edit and resubmit",
      "User may ask for clarification",
      "User may request removal",
    ],
    companyAppeals: [
      "Company may request review of policy violations",
      "Company may submit proof for correction",
      "Company may respond publicly after verification",
    ],
  },
  faq: [
    {
      question: "Why was my review edited?",
      answer: "Reviews may be edited or redacted to remove private or unsafe details while preserving factual experience.",
    },
    {
      question: "Can companies remove my review?",
      answer: "Companies cannot remove reviews directly. They may flag policy concerns and submit responses.",
    },
  ],
};
