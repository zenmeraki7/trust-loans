import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ownedByRequester, ownedByUser } from "./ownerScope.js";

test("trusted owner fields cannot be overridden by additional predicates", () => {
  assert.deepEqual(
    ownedByUser("resource-1", "trusted-user", { id: "browser-id", userId: "browser-user", status: "OPEN" }),
    { id: "resource-1", userId: "trusted-user", status: "OPEN" },
  );
  assert.deepEqual(
    ownedByRequester("resource-2", "trusted-user", { requesterId: "browser-user" }),
    { id: "resource-2", requesterId: "trusted-user" },
  );
});

test("private user repositories use the centralized owner predicate", () => {
  const files = [
    "../modules/complaintDrafts/complaintDraft.repository.ts",
    "../modules/notifications/notification.repository.ts",
    "../modules/corrections/correction.repository.ts",
    "../modules/harassmentCases/harassmentCase.repository.ts",
    "../modules/evidence/evidence.repository.ts",
  ];
  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(source, /ownedBy(User|Requester)\(/, `${file} must use the owner-scope builder`);
    assert.doesNotMatch(source, /findById\(id: string\)/, `${file} must not expose an ambiguous ID-only private lookup`);
  }
});

test("public review actions cannot query or mutate an unpublished review by ID", () => {
  const repository = readFileSync(new URL("../modules/reviews/review.repository.ts", import.meta.url), "utf8");
  const service = readFileSync(new URL("../modules/reviews/review.service.ts", import.meta.url), "utf8");
  assert.doesNotMatch(repository, /findById\(id: string\)/);
  assert.match(repository, /incrementHelpfulPublic/);
  assert.match(service, /findPublicById\(input\.reviewId\)/);
});
