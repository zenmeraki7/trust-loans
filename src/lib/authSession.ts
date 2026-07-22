import { apiClient, ApiClientError } from "@/lib/apiClient";

export type AuthSession = {
  user: { id: string };
};

export async function getOptionalAuthSession(): Promise<AuthSession | null> {
  try {
    return await apiClient<AuthSession>("/api/auth/session");
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) return null;
    throw error;
  }
}
