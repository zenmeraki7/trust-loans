const URL_VALUE_KEYS = new Set([
  "url",
  "href",
  "website",
  "officialWebsite",
  "websiteUrl",
  "logoUrl",
  "sourceUrl",
  "sourceDocumentUrl",
  "documentUrl",
  "playStoreUrl",
  "appStoreUrl",
  "profileUrl",
  "reviewUrl",
  "publicUrl",
  "actionUrl",
  "ctaUrl",
]);

const URL_ARRAY_KEYS = new Set(["sourceUrls", "officialDomains"]);
const UNSAFE_URL_CHARACTERS = /[\u0000-\u001F\u007F\\]/;
const SAFE_RASTER_DATA_IMAGE = /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\r\n]+$/i;

export function safeNavigationUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  if (!candidate || candidate.length > 2048 || UNSAFE_URL_CHARACTERS.test(candidate)) return null;

  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeImageUrl(value: unknown): string | null {
  if (typeof value === "string" && value.length <= 3 * 1024 * 1024 && SAFE_RASTER_DATA_IMAGE.test(value)) return value;
  return safeNavigationUrl(value);
}

/**
 * Treats all API URL fields as contextual URL sinks. Text fields remain plain
 * strings and React performs output encoding when they are rendered as text.
 */
export function sanitizeApiPayload<T>(value: T, key?: string, depth = 0): T {
  if (depth > 32) return null as T;

  if (typeof value === "string" && key && isUrlValueKey(key)) {
    return ((key === "logoUrl" ? safeImageUrl(value) : safeNavigationUrl(value)) ?? "") as T;
  }

  if (Array.isArray(value)) {
    const sanitized = value
      .map((item) => sanitizeApiPayload(item, key, depth + 1))
      .filter((item) => !(key && URL_ARRAY_KEYS.has(key) && item === ""));
    return sanitized as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
        childKey,
        URL_ARRAY_KEYS.has(childKey) && Array.isArray(childValue)
          ? childValue.map((item) => safeNavigationUrl(item) ?? "").filter(Boolean)
          : sanitizeApiPayload(childValue, childKey, depth + 1),
      ]),
    ) as T;
  }

  return value;
}

function isUrlValueKey(key: string) {
  return URL_VALUE_KEYS.has(key) || /(?:Url|URL|Uri|URI|Href)$/.test(key);
}
