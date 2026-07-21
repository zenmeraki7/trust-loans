export function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("INVALID_EMAIL");
  }

  const email = value.trim().normalize("NFKC").toLowerCase();

  if (email.length < 3 || email.length > 254) {
    throw new Error("INVALID_EMAIL");
  }

  return email;
}
