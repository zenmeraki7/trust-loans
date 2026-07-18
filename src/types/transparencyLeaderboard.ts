export type TransparencyLeaderboardData = {
  filters: {
    entityType: "" | "loan_app" | "company";
    query: string;
    riskLevel: "" | "low" | "medium" | "high";
    verificationStatus: string;
    claimedProfile: "" | "claimed" | "unclaimed";
    responseAvailable: "" | "yes" | "no";
  };
  leaderboard: Array<{
    rank: number;
    id: string;
    name: string;
    type: "loan_app" | "company";
    logoUrl: string;
    transparencyScore: number;
    grievanceDetailsAvailable: boolean;
    nbfcDetailsClarity: "clear" | "partial" | "under_verification";
    companyResponseRate: number;
    publicDetailsVerification: "verified" | "partial" | "under_verification";
    unresolvedComplaintRatio: number;
    riskLevel: "low" | "medium" | "high";
    verificationStatus: string;
    claimedProfile: "claimed" | "unclaimed";
    lastUpdatedAt: string;
    profileUrl: string;
  }>;
  scoreComponents: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};
