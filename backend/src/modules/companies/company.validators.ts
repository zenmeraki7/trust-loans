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

export type EnrichCompanyProfileInput = z.infer<typeof enrichCompanyProfileSchema>["body"];
