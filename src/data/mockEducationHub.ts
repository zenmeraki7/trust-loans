import type { EducationHubData } from "@/types/educationHub";

export const educationHub: EducationHubData = {
  safetyCards: [
    { id: "hidden_charges", title: "Hidden charges", description: "Some users report deductions not clearly explained before disbursal.", warningSigns: ["Net disbursal lower than expected", "Fee breakup unclear"], ctaLabel: "Learn More", href: "/loan-apps" },
    { id: "contact_misuse", title: "Contact list misuse", description: "Warning signs may include outreach to contacts after repayment delays.", warningSigns: ["Relatives contacted", "Frequent unknown calls"], ctaLabel: "Learn More", href: "/legal-action-guide" },
    { id: "fake_notice", title: "Fake legal notices", description: "Be cautious if legal-looking threats are sent without verifiable case details.", warningSigns: ["WhatsApp notice without official reference"], ctaLabel: "Learn More", href: "/legal-action-guide" },
  ],
  beforeBorrowChecklist: [
    { id: "search", label: "Search the app on this platform", description: "Review user-reported patterns and trust indicators.", priority: "high" },
    { id: "nbfc", label: "Check claimed NBFC partner", description: "Verify lender relationship and complaint history.", priority: "high" },
    { id: "fees", label: "Review total repayment amount", description: "Confirm fees and charges before accepting.", priority: "high" },
  ],
  predatoryPatterns: [
    { id: "short_window", title: "Very short repayment window", description: "Warning pattern: short tenure with high pressure after minor delay.", warningLevel: "medium" },
    { id: "random_account", title: "Pressure to pay to random accounts", description: "Be cautious if repayment channels differ from official app records.", warningLevel: "high" },
  ],
  dataPermissions: [
    { permission: "Contacts", whyRequested: "Sometimes used for referral or onboarding context.", riskExplanation: "Could create misuse concerns if unrelated outreach occurs.", userTip: "Before borrowing, verify why this permission is required." },
    { permission: "Photos/Media", whyRequested: "For document upload in some flows.", riskExplanation: "Can be risky if unnecessary full gallery access is requested.", userTip: "Share only required files through official in-app flow." },
  ],
  mythFacts: [
    { myth: "Instant approval means the app is trustworthy.", fact: "Fast approval does not prove fair terms or safe recovery practices." },
    { myth: "If an app claims an NBFC partner, it is automatically safe.", fact: "Users should verify the actual lender, grievance channel, agreement, and complaint history." },
  ],
  userStories: [
    { id: "s1", title: "Payment made but loan still active", scenario: "A user paid on time but the app status remained unpaid for several days.", lesson: "Keep payment proof and request written acknowledgement.", category: "Payment issue" },
    { id: "s2", title: "Relatives contacted after delay", scenario: "A user reported contact outreach to relatives after a short delay.", lesson: "Preserve evidence and use official grievance channels.", category: "Harassment" },
  ],
  resources: [
    { id: "r1", title: "How to check a loan app before borrowing", category: "Safety Basics", readingTime: "6 min", summary: "A practical checklist to verify app, lender, and terms.", href: "/loan-apps" },
    { id: "r2", title: "How to preserve evidence safely", category: "Complaint Prep", readingTime: "5 min", summary: "What to capture, what to avoid sharing publicly.", href: "/legal-action-guide" },
  ],
  riskCheckerQuestions: [
    { id: "q1", question: "Does the app ask for contact access?", riskWeight: 2 },
    { id: "q2", question: "Are fees clearly shown before loan acceptance?", riskWeight: 2 },
    { id: "q3", question: "Is grievance officer information available?", riskWeight: 2 },
    { id: "q4", question: "Is repayment being requested outside official channels?", riskWeight: 3 },
  ],
};
