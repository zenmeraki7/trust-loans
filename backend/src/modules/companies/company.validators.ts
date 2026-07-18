import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const logoValueSchema = z.string().url().or(z.string().regex(/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/));

export const enrichCompanyProfileSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    logoUrl: z.preprocess(emptyToUndefined, logoValueSchema.optional()),
    officialWebsite: z.preprocess(emptyToUndefined, z.string().url().optional()),
    supportEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    supportPhone: z.preprocess(emptyToUndefined, z.string().optional()),
    registeredAddress: z.preprocess(emptyToUndefined, z.string().optional()),
    nbfcRegistrationClaim: z.preprocess(emptyToUndefined, z.string().optional()),
    companyDescription: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),
  }),
});

export const createCompanyProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only").optional(),
    logoUrl: z.preprocess(emptyToUndefined, logoValueSchema.optional()),
    officialWebsite: z.preprocess(emptyToUndefined, z.string().url().optional()),
    supportEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    grievanceEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
    supportPhone: z.preprocess(emptyToUndefined, z.string().optional()),
    registeredAddress: z.preprocess(emptyToUndefined, z.string().optional()),
    nbfcRegistrationClaim: z.preprocess(emptyToUndefined, z.string().optional()),
  }),
});

export type EnrichCompanyProfileInput = z.infer<typeof enrichCompanyProfileSchema>["body"];
export type CreateCompanyProfileInput = z.infer<typeof createCompanyProfileSchema>["body"];
