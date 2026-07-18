export type PatternDetailData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  cautionLevel: "low" | "medium" | "high";
  summary: string;
  meaning: string;
  warningSigns: string[];
  evidenceChecklist: string[];
  whatNotToDo: string[];
  nextActions: Array<{
    id: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
  }>;
  relatedApps: Array<{
    id: string;
    name: string;
    logoUrl: string;
    trustScore: number;
    profileUrl: string;
  }>;
  relatedReviews: Array<{
    id: string;
    appName: string;
    excerpt: string;
    rating: number;
    reviewUrl: string;
  }>;
  relatedTemplates: Array<{
    id: string;
    title: string;
    summary: string;
    url: string;
  }>;
};
