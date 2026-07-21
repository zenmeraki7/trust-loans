import { HarassmentCaseStatus, UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "../middlewares/auth.js";
import { setPrivateNoStore } from "../middlewares/privateResponse.js";
import { AppError } from "../utils/AppError.js";

const ALL_AUTHENTICATED_ROLES = Object.values(UserRole);
const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN] as const;
const MODERATION_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SENIOR_MODERATOR, UserRole.MODERATOR] as const;
const ANALYSIS_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SENIOR_MODERATOR, UserRole.ANALYST] as const;
const MUTABLE_CASE_STATUSES = [
  HarassmentCaseStatus.OPEN,
  HarassmentCaseStatus.WAITING_FOR_RESPONSE,
  HarassmentCaseStatus.ACTION_NEEDED,
  HarassmentCaseStatus.RESOLVED,
] as const;

type OwnershipRule = "none" | "required";
type Policy = {
  roles: readonly UserRole[];
  ownership: OwnershipRule;
  statuses?: readonly string[];
};

export const authorizationPolicies = {
  "account.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "account.security": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "dashboard.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "review.create": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "draft.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "draft.write": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "correction.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "correction.write": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "notification.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "notification.write": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "case.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "case.write": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required", statuses: MUTABLE_CASE_STATUSES },
  "evidence.read": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "evidence.write": { roles: ALL_AUTHENTICATED_ROLES, ownership: "required" },
  "admin.company.write": { roles: ADMIN_ROLES, ownership: "none" },
  "admin.loan-app.write": { roles: ADMIN_ROLES, ownership: "none" },
  "admin.template.write": { roles: ADMIN_ROLES, ownership: "none" },
  "admin.correction.read": { roles: MODERATION_ROLES, ownership: "none" },
  "admin.correction.decide": { roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SENIOR_MODERATOR], ownership: "none" },
  "admin.correction.triage": { roles: MODERATION_ROLES, ownership: "none" },
  "admin.moderation": { roles: MODERATION_ROLES, ownership: "none" },
  "admin.audit.read": { roles: ANALYSIS_ROLES, ownership: "none" },
  "admin.scoring.read": { roles: ANALYSIS_ROLES, ownership: "none" },
  "admin.scoring.write": { roles: ADMIN_ROLES, ownership: "none" },
  "admin.scoring.recalculate": { roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SENIOR_MODERATOR], ownership: "none" },
  "admin.evidence": { roles: MODERATION_ROLES, ownership: "none" },
} as const satisfies Record<string, Policy>;

export type AuthorizationAction = keyof typeof authorizationPolicies;

export type ResourceAuthorization = {
  ownerId?: string | null;
  status?: string | null;
};

function policyFor(action: AuthorizationAction | string): Policy {
  const policy = (authorizationPolicies as Record<string, Policy>)[action];
  if (!policy) throw new AppError("Action is not permitted", 403);
  return policy;
}

export function authorizeAction(user: AuthUser | undefined, action: AuthorizationAction | string) {
  if (!user) throw new AppError("Authentication required", 401);
  const policy = policyFor(action);
  if (!policy.roles.includes(user.role)) throw new AppError("Insufficient permissions", 403);
  return policy;
}

export function authorizeResource(user: AuthUser | undefined, action: AuthorizationAction, resource: ResourceAuthorization) {
  const policy = authorizeAction(user, action);
  if (policy.ownership === "required" && (!resource.ownerId || resource.ownerId !== user!.id)) {
    // Avoid revealing whether another user's private resource exists.
    throw new AppError("Resource not found", 404);
  }
  if (policy.statuses && (!resource.status || !policy.statuses.includes(resource.status))) {
    throw new AppError("Action is not permitted in the resource's current status", 409);
  }
}

export function allowedStatuses(action: AuthorizationAction): readonly string[] | undefined {
  return policyFor(action).statuses;
}

export const requireAction = (action: AuthorizationAction) =>
  (req: Request, res: Response, next: NextFunction) => {
    setPrivateNoStore(res);
    try {
      authorizeAction(req.user, action);
      next();
    } catch (error) {
      next(error);
    }
  };
