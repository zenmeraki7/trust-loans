const DEFAULT_AUTH_DESTINATION = "/dashboard";
const REDIRECT_PARAMETER_NAMES = new Set(["next", "returnto", "redirect", "callbackurl", "continue"]);
const UNSAFE_CHARACTERS = /[\\\u0000-\u001F\u007F]/;
const VALIDATION_ORIGIN = "https://internal.invalid";

const hasUnsafeDecodedForm = (value: string) => {
  let decoded = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (!decoded.startsWith("/") || decoded.startsWith("//") || UNSAFE_CHARACTERS.test(decoded)) return true;
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      return true;
    }
  }
  return !decoded.startsWith("/") || decoded.startsWith("//") || UNSAFE_CHARACTERS.test(decoded);
};

const validatedInternalPath = (value: string, depth = 0): string | null => {
  if (!value || value !== value.trim() || value.length > 2_048 || depth > 2 || hasUnsafeDecodedForm(value)) return null;
  try {
    const parsed = new URL(value, VALIDATION_ORIGIN);
    if (parsed.origin !== VALIDATION_ORIGIN) return null;
    for (const [name, nestedValue] of parsed.searchParams) {
      if (REDIRECT_PARAMETER_NAMES.has(name.toLowerCase()) && nestedValue && !validatedInternalPath(nestedValue, depth + 1)) {
        return null;
      }
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
};

export const safeInternalRedirect = (value: string | null | undefined, fallback = DEFAULT_AUTH_DESTINATION) =>
  value ? validatedInternalPath(value) ?? fallback : fallback;
