export const queryKeys = {
  publicDirectory: (filters: Record<string, unknown> = {}) => ["publicDirectory", filters] as const,
  loanApps: (filters: Record<string, unknown> = {}) => ["loanApps", filters] as const,
  loanAppProfile: (slug: string) => ["loanAppProfile", slug] as const,
  appReviews: (appId: string, filters: Record<string, unknown> = {}) => ["appReviews", appId, filters] as const,
  reviewDetail: (reviewId: string) => ["reviewDetail", reviewId] as const,
  dashboardReviews: () => ["dashboardReviews"] as const,
  complaintTemplates: () => ["complaintTemplates"] as const,
  complaintTemplate: (key: string) => ["complaintTemplate", key] as const,
  complaintDrafts: () => ["complaintDrafts"] as const,
  complaintDraft: (id: string) => ["complaintDraft", id] as const,
  compareLoanApps: (ids: string[] = [], filters: Record<string, unknown> = {}) => ["compareLoanApps", ids, filters] as const,
};
