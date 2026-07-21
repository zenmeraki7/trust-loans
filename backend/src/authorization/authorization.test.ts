import { UserRole } from "@prisma/client";
import assert from "node:assert/strict";
import test from "node:test";
import type { AuthUser } from "../middlewares/auth.js";
import { authorizeAction, authorizeResource, type AuthorizationAction } from "./authorization.js";

const user: AuthUser = { id: "user-1", role: UserRole.USER, sessionId: "session-1" };
const admin: AuthUser = { id: "admin-1", role: UserRole.ADMIN, sessionId: "session-2" };

test("authorization denies unauthenticated and unknown actions by default", () => {
  assert.throws(() => authorizeAction(undefined, "case.read"), { message: "Authentication required" });
  assert.throws(() => authorizeAction(user, "unknown.action" as AuthorizationAction), { message: "Action is not permitted" });
});

test("authorization enforces trusted database role", () => {
  assert.throws(() => authorizeAction(user, "admin.company.write"), { message: "Insufficient permissions" });
  assert.doesNotThrow(() => authorizeAction(admin, "admin.company.write"));
});

test("resource authorization enforces owner and current status", () => {
  assert.throws(
    () => authorizeResource(user, "case.write", { ownerId: "user-2", status: "OPEN" }),
    { message: "Resource not found" },
  );
  assert.throws(
    () => authorizeResource(user, "case.write", { ownerId: user.id, status: "ARCHIVED" }),
    { message: "Action is not permitted in the resource's current status" },
  );
  assert.doesNotThrow(() => authorizeResource(user, "case.write", { ownerId: user.id, status: "OPEN" }));
});
