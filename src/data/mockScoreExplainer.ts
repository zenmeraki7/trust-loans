import type { ScoreExplainerData } from "@/types/scoreExplainer";

export const scoreExplainer: ScoreExplainerData = {
  components: [
    { id: "c1", title: "Average review rating", weightHint: "Core signal", description: "Aggregated rating patterns from published reviews." },
    { id: "c2", title: "Review volume", weightHint: "Stability signal", description: "Larger review volume can improve score stability." },
    { id: "c3", title: "Recent review trends", weightHint: "Time-sensitive signal", description: "Recent trend shifts may adjust score direction." },
    { id: "c4", title: "Complaint severity", weightHint: "Risk signal", description: "Severity and recurrence of complaint types may indicate risk." },
    { id: "c5", title: "Verified borrower signals", weightHint: "Confidence signal", description: "Verification signals may improve confidence in patterns." },
    { id: "c6", title: "Company response activity", weightHint: "Engagement signal", description: "Timely and relevant company responses are considered." },
    { id: "c7", title: "Grievance detail availability", weightHint: "Transparency signal", description: "Public grievance and support detail completeness is considered." },
    { id: "c8", title: "Public detail verification", weightHint: "Verification signal", description: "Claimed public business details are checked for consistency." },
    { id: "c9", title: "Review integrity signals", weightHint: "Quality signal", description: "Suspicious clusters and duplicate patterns may affect confidence." },
  ],
  riskLabels: [
    { id: "r1", label: "Low Risk", meaning: "Lower concentration of severe user-reported patterns in current data.", howItMayAppear: "Higher trust score with stable trends.", whatToVerify: "Confirm lender identity and loan terms independently." },
    { id: "r2", label: "Medium Risk", meaning: "Some recurring complaint patterns require attention.", howItMayAppear: "Mixed review trends and moderate complaint levels.", whatToVerify: "Check fee details, repayment channels, and support contacts." },
    { id: "r3", label: "High Risk", meaning: "Higher concentration of recurring complaint patterns.", howItMayAppear: "Lower trust score and frequent caution signals.", whatToVerify: "Verify NBFC details, repayment proof process, and grievance escalation options." },
    { id: "r4", label: "Severe Complaint Pattern", meaning: "Repeated severe complaint signals observed in available data.", howItMayAppear: "Frequent high-severity tags and elevated caution indicators.", whatToVerify: "Review pattern details carefully and preserve records if proceeding." },
    { id: "r5", label: "Under Review", meaning: "Data or signals are being re-evaluated.", howItMayAppear: "Temporary label pending moderation or verification updates.", whatToVerify: "Recheck status and supporting details before borrowing." },
    { id: "r6", label: "Insufficient Data", meaning: "Not enough reliable data to estimate pattern confidence.", howItMayAppear: "Limited published reviews or incomplete signals.", whatToVerify: "Rely on official lender documents and independent checks." },
  ],
  excludedFactors: [
    "Paid requests do not improve scores.",
    "Companies cannot directly remove negative reviews.",
    "Admins should not manually boost scores.",
    "Private evidence is not displayed publicly.",
  ],
  scoreChangeReasons: [
    "New reviews",
    "Moderation updates",
    "Company responses",
    "Corrected public details",
    "Review integrity checks",
    "Complaint trend changes",
  ],
  exampleBreakdown: {
    appName: "SampleLoan App",
    score: 58,
    factors: [
      { name: "Average rating", impact: 14, note: "Moderate published rating trend." },
      { name: "Complaint severity", impact: -18, note: "Recurring high-severity complaint tags in recent period." },
      { name: "Company response activity", impact: 6, note: "Responses present but turnaround time varies." },
      { name: "Verification signals", impact: 10, note: "Public business details partially verified." },
      { name: "Review integrity adjustment", impact: -4, note: "Some reviews under integrity review." },
    ],
    updatedAt: "2026-05-31",
  },
};
