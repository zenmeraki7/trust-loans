import { loanApps } from "@/data/mockLoanAppsDirectory";
import { reviews as seedReviews, similarApps as seedSimilarApps } from "@/data/mockLoanAppProfile";
import type { LoanAppDirectoryItem } from "@/types/loanAppsDirectory";
import type { Review, SimilarApp } from "@/types/loanAppProfile";

export type AppLifecycleStatus = "draft" | "published" | "archived";

export type LoanAppRecord = LoanAppDirectoryItem & {
  slug: string;
  grievanceDetails: {
    grievanceEmail: string;
    supportEmail: string;
    supportPhone: string;
    website: string;
  };
  appStore: {
    playStoreUrl: string;
    appStoreUrl: string;
  };
  lifecycleStatus: AppLifecycleStatus;
  createdAt: string;
  updatedAt: string;
};

export type SuggestedApp = {
  id: string;
  name: string;
  companyName?: string;
  developerName?: string;
  claimedNbfcPartner?: string;
  website?: string;
  note?: string;
  submittedAt: string;
};

const nowIso = () => new Date().toISOString();
const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "app";

const withRecords: LoanAppRecord[] = loanApps.map((item) => ({
  ...item,
  slug: item.id,
  grievanceDetails: {
    grievanceEmail: `grievance@${item.id}.example.in`,
    supportEmail: `support@${item.id}.example.in`,
    supportPhone: "+91-00000-00000",
    website: `https://${item.id}.example.in`,
  },
  appStore: {
    playStoreUrl: `https://play.google.com/store/apps/details?id=in.example.${item.id}`,
    appStoreUrl: `https://apps.apple.com/in/app/${item.id}/id1234567890`,
  },
  lifecycleStatus: "published",
  createdAt: nowIso(),
  updatedAt: nowIso(),
}));

const appDb = new Map<string, LoanAppRecord>(withRecords.map((app) => [app.id, app]));
const reviewsDb = new Map<string, Review[]>([["swift-cash", seedReviews]]);
const similarDb = new Map<string, SimilarApp[]>([["swift-cash", seedSimilarApps]]);
const suggestionsDb: SuggestedApp[] = [];

export const listApps = () => Array.from(appDb.values());

export const findAppBySlug = (slug: string) =>
  listApps().find((app) => app.slug === slug || app.id === slug) || null;

export const findAppById = (id: string) => appDb.get(id) || null;

export const listAppReviews = (id: string) => reviewsDb.get(id) || [];

export const getComplaintSummary = (id: string) => {
  const app = findAppById(id);
  if (!app) return null;

  return {
    appId: id,
    reviewCount: app.reviewCount,
    complaintCounts: app.complaintCounts,
    topComplaintTags: app.topComplaintTags,
    summary: "Aggregated from user-submitted reviews and public details. Not a legal finding.",
    updatedAt: app.updatedAt,
  };
};

export const listSimilarApps = (id: string) => {
  const seeded = similarDb.get(id);
  if (seeded) return seeded;

  const current = findAppById(id);
  if (!current) return [];

  return listApps()
    .filter((app) => app.id !== id && app.platform.some((platform) => current.platform.includes(platform)))
    .slice(0, 3)
    .map<SimilarApp>((app) => ({
      id: app.id,
      name: app.name,
      logoUrl: app.logoUrl,
      trustScore: app.trustScore,
      riskLevel: app.riskLevel,
      reviewCount: app.reviewCount,
    }));
};

export const suggestApp = (payload: Omit<SuggestedApp, "id" | "submittedAt">) => {
  const suggestion: SuggestedApp = {
    id: `s-${Date.now()}`,
    submittedAt: nowIso(),
    ...payload,
  };
  suggestionsDb.push(suggestion);
  return suggestion;
};

export const createAdminApp = (
  payload: Omit<
    LoanAppRecord,
    "id" | "slug" | "createdAt" | "updatedAt" | "lifecycleStatus" | "reviewCount" | "averageRating"
  > &
    Partial<Pick<LoanAppRecord, "id" | "reviewCount" | "averageRating" | "lifecycleStatus">>,
) => {
  const id = payload.id?.trim() || toSlug(payload.name);
  if (appDb.has(id)) {
    throw new Error("App with this id already exists");
  }

  const now = nowIso();
  const record: LoanAppRecord = {
    ...payload,
    id,
    slug: toSlug(payload.name),
    lifecycleStatus: payload.lifecycleStatus ?? "draft",
    reviewCount: payload.reviewCount ?? 0,
    averageRating: payload.averageRating ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  appDb.set(record.id, record);
  return record;
};

export const updateAdminApp = (id: string, patch: Partial<LoanAppRecord>) => {
  const existing = findAppById(id);
  if (!existing) return null;

  const updated: LoanAppRecord = {
    ...existing,
    ...patch,
    id: existing.id,
    slug: patch.slug ?? existing.slug,
    updatedAt: nowIso(),
  };

  appDb.set(id, updated);
  return updated;
};

export const publishAdminApp = (id: string) => updateAdminApp(id, { lifecycleStatus: "published" });

export const archiveAdminApp = (id: string) => updateAdminApp(id, { lifecycleStatus: "archived" });

export const mergeAdminApps = (sourceId: string, targetId: string) => {
  if (sourceId === targetId) {
    throw new Error("Source and target cannot be same");
  }

  const source = findAppById(sourceId);
  const target = findAppById(targetId);
  if (!source || !target) return null;

  const mergedReviews = [...listAppReviews(targetId), ...listAppReviews(sourceId)];
  reviewsDb.set(targetId, mergedReviews);
  reviewsDb.delete(sourceId);

  const mergedTarget = updateAdminApp(targetId, {
    reviewCount: target.reviewCount + source.reviewCount,
    complaintCounts: {
      harassment: target.complaintCounts.harassment + source.complaintCounts.harassment,
      hiddenCharges: target.complaintCounts.hiddenCharges + source.complaintCounts.hiddenCharges,
      dataPrivacy: target.complaintCounts.dataPrivacy + source.complaintCounts.dataPrivacy,
    },
    topComplaintTags: Array.from(new Set([...target.topComplaintTags, ...source.topComplaintTags])).slice(0, 8),
  });

  appDb.delete(sourceId);

  return {
    sourceId,
    targetId,
    mergedApp: mergedTarget,
  };
};

