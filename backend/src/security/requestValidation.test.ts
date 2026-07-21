import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { unexpectedRequestFields } from "../middlewares/validate.js";
import { signupSchema } from "../modules/auth/auth.validators.js";
import { createCaseSchema } from "../modules/harassmentCases/harassmentCase.validators.js";
import { createLoanAppSchema } from "../modules/loanApps/loanApp.validators.js";
import { createComplaintDraftSchema } from "../modules/complaintTemplates/complaintTemplate.validators.js";
import { createReviewSchema } from "../modules/reviews/review.validators.js";

const forbidden = ["userId", "role", "isAdmin", "status", "approved", "published", "ownerId"] as const;

const cases = [
  {
    name: "signup",
    schema: signupSchema,
    body: { email: "person@example.com", password: "correct horse battery staple" },
  },
  {
    name: "review creation",
    schema: createReviewSchema,
    body: { loanAppId: "app-1", title: "A real review", body: "This review contains enough detail to submit.", rating: 3 },
  },
  {
    name: "case creation",
    schema: createCaseSchema,
    body: { title: "Recovery calls", caseType: "OTHER" },
  },
  {
    name: "loan-app creation",
    schema: createLoanAppSchema,
    body: { slug: "sample-lender", name: "Sample lender" },
  },
  {
    name: "complaint draft creation",
    schema: createComplaintDraftSchema,
    body: {
      title: "Complaint draft",
      templateKey: "harassment",
      outputType: "PERSONAL_RECORD",
      formData: {
        loanAppName: "Sample lender",
        shortSummary: "Repeated calls",
        detailedDescription: "The caller repeatedly contacted me after payment.",
        desiredResolution: "Stop further calls",
      },
      generatedBody: "This is a sufficiently long generated complaint body.",
    },
  },
] as const;

for (const item of cases) {
  test(`${item.name} rejects identity and privilege fields`, () => {
    assert.equal(item.schema.safeParse({ body: item.body }).success, true, "fixture must be valid");
    for (const field of forbidden) {
      const result = item.schema.safeParse({ body: { ...item.body, [field]: field === "isAdmin" ? true : "tampered" } });
      assert.equal(result.success, false, `${item.name} accepted forbidden field ${field}`);
    }
  });
}

test("validation middleware detects unknown keys even for legacy stripping schemas", () => {
  const legacySchema = z.object({ body: z.object({ title: z.string() }) });
  const input = { body: { title: "Allowed", ownerId: "attacker", nested: { role: "ADMIN" }, emptyUnknown: {} }, params: {}, query: {} };
  const parsed = legacySchema.parse(input);
  assert.deepEqual(unexpectedRequestFields(input, parsed), ["body.ownerId", "body.nested", "body.emptyUnknown"]);
});
