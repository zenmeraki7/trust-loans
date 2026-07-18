const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  userId?: string;
  userRole?: string;
};

export async function apiClient<T>(path: string, options: ApiOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.userId ? { "x-user-id": options.userId } : {}),
        ...(options.userRole ? { "x-user-role": options.userRole } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
    });
  } catch (error) {
    throw new ApiClientError("API unavailable", 0, error);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiClientError(errorBody?.message || errorBody?.error || "Request failed", response.status, errorBody);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
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
