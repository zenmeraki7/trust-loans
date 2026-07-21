import { z } from "zod";

const DISALLOWED_CONTROLS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const UNSAFE_URL_CHARACTERS = /[\u0000-\u001F\u007F\\]/;
const URL_VALUE_KEYS = new Set([
  "url", "href", "website", "officialWebsite", "websiteUrl", "logoUrl", "sourceUrl",
  "sourceDocumentUrl", "documentUrl", "playStoreUrl", "appStoreUrl", "profileUrl",
  "reviewUrl", "publicUrl", "actionUrl", "ctaUrl",
]);
const URL_ARRAY_KEYS = new Set(["sourceUrls", "officialDomains"]);
const SAFE_RASTER_DATA_IMAGE = /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\r\n]+$/i;

export function plainTextSchema(options: { min?: number; max: number }) {
  return z.string()
    .transform((value) => value.trim().normalize("NFKC"))
    .pipe(z.string()
      .min(options.min ?? 0)
      .max(options.max)
      .refine((value) => !DISALLOWED_CONTROLS.test(value), "Text contains unsupported control characters"));
}

export const safeHttpsUrlSchema = z.string()
  .trim()
  .max(2048)
  .transform((value, context) => {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.username || url.password) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Use an HTTPS URL without embedded credentials" });
        return z.NEVER;
      }
      return url.toString();
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid HTTPS URL" });
      return z.NEVER;
    }
  });

const safeRasterDataImageSchema = z.string()
  .max(3 * 1024 * 1024)
  .regex(SAFE_RASTER_DATA_IMAGE, "Use an HTTPS image or a PNG, JPEG, WebP, or GIF data image");

export const safePublicImageUrlSchema = safeHttpsUrlSchema.or(safeRasterDataImageSchema);

export function safePublicOutputUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  if (!candidate || candidate.length > 2048 || UNSAFE_URL_CHARACTERS.test(candidate)) return null;
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

function safePublicOutputImage(value: unknown): string | null {
  return typeof value === "string" && value.length <= 3 * 1024 * 1024 && SAFE_RASTER_DATA_IMAGE.test(value)
    ? value
    : safePublicOutputUrl(value);
}

export function sanitizePublicPayload<T>(value: T, key?: string, depth = 0): T {
  if (depth > 32) return null as T;
  if (typeof value === "string" && key && isUrlValueKey(key)) {
    return ((key === "logoUrl" ? safePublicOutputImage(value) : safePublicOutputUrl(value)) ?? "") as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePublicPayload(item, key, depth + 1)) as T;
  }
  if (value && typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return value;
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
      childKey,
      URL_ARRAY_KEYS.has(childKey) && Array.isArray(childValue)
        ? childValue.map((item) => safePublicOutputUrl(item) ?? "").filter(Boolean)
        : sanitizePublicPayload(childValue, childKey, depth + 1),
    ])) as T;
  }
  return value;
}

function isUrlValueKey(key: string) {
  return URL_VALUE_KEYS.has(key) || /(?:Url|URL|Uri|URI|Href)$/.test(key);
}
