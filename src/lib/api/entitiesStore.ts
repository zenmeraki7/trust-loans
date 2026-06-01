import { entityProfile } from "@/data/mockEntityProfile";
import { loanApps } from "@/data/mockLoanAppsDirectory";
import type { EntityProfileData } from "@/types/entityProfile";

type EntityVerification =
  | "verified_public_details"
  | "partially_verified"
  | "under_verification"
  | "conflicting_information"
  | "user_submitted";

export type EntityRecord = EntityProfileData & {
  createdAt: string;
  updatedAt: string;
};

export type EntityCorrectionRequest = {
  id: string;
  entityId: string;
  issueType: string;
  note: string;
  sourceUrl?: string;
  createdAt: string;
};

const nowIso = () => new Date().toISOString();

const entityDb = new Map<string, EntityRecord>([
  [
    entityProfile.id,
    {
      ...entityProfile,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ],
]);
const correctionsDb = new Map<string, EntityCorrectionRequest[]>();

export const listEntities = () => Array.from(entityDb.values());

export const findEntityById = (id: string) => entityDb.get(id) || null;

export const findEntityBySlug = (slug: string) => listEntities().find((entity) => entity.slug === slug || entity.id === slug) || null;

export const listEntityLinkedApps = (id: string) => {
  const entity = findEntityById(id);
  if (!entity) return null;

  return entity.linkedApps.map((linked) => {
    const directoryEntry = loanApps.find((app) => app.id === linked.id);
    return {
      ...linked,
      summary: directoryEntry?.summary ?? "",
      status: directoryEntry?.status ?? "under_review",
    };
  });
};

export const listEntityReviews = (id: string) => {
  const entity = findEntityById(id);
  if (!entity) return null;
  return entity.mentionedReviews;
};

export const createEntityCorrection = (
  entityId: string,
  payload: {
    issueType: string;
    note: string;
    sourceUrl?: string;
  },
) => {
  const existing = correctionsDb.get(entityId) || [];
  const record: EntityCorrectionRequest = {
    id: `c-${Date.now()}`,
    entityId,
    issueType: payload.issueType,
    note: payload.note,
    sourceUrl: payload.sourceUrl,
    createdAt: nowIso(),
  };
  existing.push(record);
  correctionsDb.set(entityId, existing);
  return record;
};

export const createAdminEntity = (
  payload: Omit<EntityRecord, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  },
) => {
  const id = payload.id?.trim() || `entity-${Date.now()}`;
  if (entityDb.has(id)) {
    throw new Error("Entity with this id already exists");
  }

  const record: EntityRecord = {
    ...payload,
    id,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  entityDb.set(id, record);
  return record;
};

export const updateAdminEntity = (id: string, patch: Partial<EntityRecord>) => {
  const existing = findEntityById(id);
  if (!existing) return null;

  const updated: EntityRecord = {
    ...existing,
    ...patch,
    id: existing.id,
    updatedAt: nowIso(),
  };
  entityDb.set(id, updated);
  return updated;
};

export const verifyAdminEntity = (id: string, verificationStatus: EntityVerification = "verified_public_details") =>
  updateAdminEntity(id, { verificationStatus });

export const linkAppToEntity = (
  entityId: string,
  link: {
    appId: string;
    relationshipType: EntityProfileData["linkedApps"][number]["relationshipType"];
    relationshipVerificationStatus?: EntityProfileData["linkedApps"][number]["relationshipVerificationStatus"];
  },
) => {
  const entity = findEntityById(entityId);
  if (!entity) return null;

  const app = loanApps.find((item) => item.id === link.appId);
  if (!app) {
    throw new Error("App not found");
  }

  const alreadyLinked = entity.linkedApps.some((item) => item.id === app.id);
  if (alreadyLinked) {
    throw new Error("App already linked");
  }

  const linkedApp: EntityProfileData["linkedApps"][number] = {
    id: app.id,
    name: app.name,
    slug: app.id,
    logoUrl: app.logoUrl,
    developerName: app.developerName,
    companyName: app.companyName,
    relationshipType: link.relationshipType,
    relationshipVerificationStatus: link.relationshipVerificationStatus ?? "under_verification",
    trustScore: app.trustScore,
    averageRating: app.averageRating,
    reviewCount: app.reviewCount,
    riskLevel: app.riskLevel,
    topComplaintTags: app.topComplaintTags,
    profileUrl: `/loan-apps/${app.id}`,
  };

  const updated = updateAdminEntity(entityId, {
    linkedApps: [...entity.linkedApps, linkedApp],
    totalLinkedApps: entity.totalLinkedApps + 1,
    averageLinkedAppTrustScore: Math.round(
      (entity.averageLinkedAppTrustScore * entity.totalLinkedApps + app.trustScore) / (entity.totalLinkedApps + 1),
    ),
    totalReviewsAcrossApps: entity.totalReviewsAcrossApps + app.reviewCount,
  });

  return updated;
};

