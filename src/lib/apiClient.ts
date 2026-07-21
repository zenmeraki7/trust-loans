const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

type CsrfState = { token: string; expiresAt: number };
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
let csrfState: CsrfState | null = null;
let csrfRequest: Promise<CsrfState> | null = null;

const errorMessageFrom = (body: unknown) => {
  const data = body as { message?: string; error?: string; issues?: Array<{ path?: Array<string | number>; message?: string }> } | null;
  const issue = data?.issues?.[0];
  if (issue?.message) {
    const field = issue.path?.slice(1).join(".");
    return field ? `${field}: ${issue.message}` : issue.message;
  }
  return data?.message || data?.error || "Request failed";
};

const fetchCsrfState = async (force = false) => {
  if (!force && csrfState && csrfState.expiresAt - Date.now() > 60_000) return csrfState;
  if (!force && csrfRequest) return csrfRequest;

  csrfRequest = fetch(`${API_BASE_URL}/api/auth/csrf`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  }).then(async (response) => {
    if (!response.ok) {
      const details = await response.json().catch(() => null);
      throw new ApiClientError(errorMessageFrom(details), response.status, details);
    }
    const body = await response.json() as { csrfToken: string; expiresAt: string };
    const state = { token: body.csrfToken, expiresAt: new Date(body.expiresAt).getTime() };
    if (!state.token || !Number.isFinite(state.expiresAt)) {
      throw new ApiClientError("Invalid CSRF response", 0, body);
    }
    csrfState = state;
    return state;
  }).finally(() => {
    csrfRequest = null;
  });

  return csrfRequest;
};

export async function apiClient<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = options.method || "GET";
  const mutating = MUTATING_METHODS.has(method);
  const send = async (forceCsrfRefresh = false) => {
    const csrf = mutating ? await fetchCsrfState(forceCsrfRefresh) : null;
    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(mutating ? { "Content-Type": "application/json", "X-CSRF-Token": csrf!.token } : {}),
        ...options.headers,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "include",
    });
  };

  let response: Response;
  try {
    response = await send();
    if (mutating && response.status === 403) {
      const errorBody = await response.clone().json().catch(() => null) as { error?: string } | null;
      if (errorBody?.error === "Invalid CSRF token") {
        csrfState = null;
        response = await send(true);
      }
    }
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError("API unavailable", 0, error);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiClientError(errorMessageFrom(errorBody), response.status, errorBody);
  }

  if (response.status === 204) return undefined as T;
  return sanitizeApiPayload(await response.json()) as T;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export const canUseDevFallback = (error: unknown) =>
  process.env.NODE_ENV === "development" && error instanceof ApiClientError && error.status === 0;
import { sanitizeApiPayload } from "@/lib/publicContent";
