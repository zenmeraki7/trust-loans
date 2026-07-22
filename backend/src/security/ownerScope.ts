/**
 * Builds the mandatory tenant predicate for private records.
 *
 * Callers may provide a resource id, but the authenticated owner id must be
 * supplied separately by trusted server code. Never spread browser input into
 * either field.
 */
export function ownedByUser<T extends Record<string, unknown>>(
  id: string,
  authenticatedUserId: string,
  additionalWhere?: T,
) {
  return {
    ...(additionalWhere ?? {}),
    id,
    userId: authenticatedUserId,
  };
}

export function ownedByRequester<T extends Record<string, unknown>>(
  id: string,
  authenticatedUserId: string,
  additionalWhere?: T,
) {
  return {
    ...(additionalWhere ?? {}),
    id,
    requesterId: authenticatedUserId,
  };
}
