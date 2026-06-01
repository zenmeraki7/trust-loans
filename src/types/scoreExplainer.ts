export type ScoreExplainerData = {
  components: Array<{
    id: string;
    title: string;
    weightHint: string;
    description: string;
  }>;
  riskLabels: Array<{
    id: string;
    label: string;
    meaning: string;
    howItMayAppear: string;
    whatToVerify: string;
  }>;
  excludedFactors: string[];
  scoreChangeReasons: string[];
  exampleBreakdown: {
    appName: string;
    score: number;
    factors: Array<{
      name: string;
      impact: number;
      note: string;
    }>;
    updatedAt: string;
  };
};
