import type { ComplaintHeatmapData } from "@/types/complaintHeatmap";

export const complaintHeatmap: ComplaintHeatmapData = {
  filters: {
    region: "",
    category: "",
    dateRange: { from: "2026-05-01", to: "2026-05-31" },
    riskLevel: "",
  },
  regions: [
    { region: "Karnataka", reportCount: 420, topCategory: "Harassment", riskLevel: "high", hiddenForPrivacy: false },
    { region: "Maharashtra", reportCount: 368, topCategory: "Hidden charges", riskLevel: "medium", hiddenForPrivacy: false },
    { region: "Tamil Nadu", reportCount: 244, topCategory: "Payment not updated", riskLevel: "medium", hiddenForPrivacy: false },
    { region: "Delhi", reportCount: 206, topCategory: "Data misuse", riskLevel: "high", hiddenForPrivacy: false },
    { region: "Small sample region", reportCount: 4, topCategory: "Photo morphing threats", riskLevel: "low", hiddenForPrivacy: true },
  ],
  selectedRegion: {
    name: "Karnataka",
    totalReports: 420,
    topComplaintCategory: "Harassment",
    risingPattern: "Abusive recovery calls",
    relatedApps: [
      { id: "app-cashnest", name: "CashNest", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=CN", trustScore: 36, profileUrl: "/loan-apps/app-cashnest", reportCount: 88 },
      { id: "app-quickrupee", name: "QuickRupee", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=QR", trustScore: 31, profileUrl: "/loan-apps/app-quickrupee", reportCount: 64 },
      { id: "app-lendly", name: "LendlyNow", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=LN", trustScore: 40, profileUrl: "/loan-apps/app-lendly", reportCount: 52 },
    ],
  },
  categoryTrends: [
    { category: "Harassment", count: 1438, trend: "up" },
    { category: "Hidden charges", count: 1191, trend: "up" },
    { category: "Data misuse", count: 732, trend: "stable" },
    { category: "Photo morphing threats", count: 187, trend: "up" },
    { category: "Payment not updated", count: 644, trend: "up" },
    { category: "Loan not closed", count: 402, trend: "stable" },
  ],
};
