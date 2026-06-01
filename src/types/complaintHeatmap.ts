export type ComplaintHeatmapData = {
  filters: {
    region: string;
    category: string;
    dateRange: { from: string; to: string };
    riskLevel: string;
  };
  regions: Array<{
    region: string;
    reportCount: number;
    topCategory: string;
    riskLevel: "low" | "medium" | "high";
    hiddenForPrivacy: boolean;
  }>;
  selectedRegion: {
    name: string;
    totalReports: number;
    topComplaintCategory: string;
    risingPattern: string;
    relatedApps: Array<{
      id: string;
      name: string;
      logoUrl: string;
      trustScore: number;
      profileUrl: string;
      reportCount: number;
    }>;
  };
  categoryTrends: Array<{
    category: string;
    count: number;
    trend: "up" | "stable" | "down";
  }>;
};
