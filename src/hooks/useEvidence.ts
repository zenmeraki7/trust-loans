"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { EvidenceMetadata } from "@/types/evidence";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";

export function useCreateEvidenceUploadUrl() {
  return useMutation({
    mutationFn: (body: { fileName: string; mimeType: "image/png" | "image/jpeg" | "image/webp" | "application/pdf"; fileSizeBytes: number; reviewId?: string; loanAppId?: string }) =>
      apiClient<{ storageKey: string; uploadUrl: string; expiresInSeconds: number }>("/api/evidence/upload-url", { method: "POST", body, userId: DEV_USER_ID, userRole: "USER" }),
  });
}

export function useCompleteEvidenceUpload() {
  return useMutation({
    mutationFn: (body: { storageKey: string; fileName: string; mimeType: "image/png" | "image/jpeg" | "image/webp" | "application/pdf"; fileSizeBytes: number; reviewId?: string; loanAppId?: string; sensitiveFlags?: string[] }) =>
      apiClient<EvidenceMetadata>("/api/evidence/complete", { method: "POST", body, userId: DEV_USER_ID, userRole: "USER" }),
  });
}

export function useEvidenceMetadata(id: string) {
  return useQuery({
    queryKey: ["evidence", id],
    enabled: Boolean(id),
    queryFn: () => apiClient<EvidenceMetadata>(`/api/evidence/${id}/metadata`, { userId: DEV_USER_ID, userRole: "USER" }),
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/api/evidence/${id}`, { method: "DELETE", userId: DEV_USER_ID, userRole: "USER" }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["evidence"] }),
  });
}

export function useAdminEvidenceQueue() {
  return useQuery({ queryKey: ["adminEvidenceQueue"], queryFn: () => apiClient<EvidenceMetadata[]>("/api/admin/evidence", { userId: DEV_USER_ID, userRole: "ADMIN" }) });
}

export function useAdminEvidenceDetail(id: string) {
  return useQuery({ queryKey: ["adminEvidence", id], enabled: Boolean(id), queryFn: () => apiClient<EvidenceMetadata>(`/api/admin/evidence/${id}`, { userId: DEV_USER_ID, userRole: "ADMIN" }) });
}

export function useSecureOpenEvidence() {
  return useMutation({ mutationFn: (input: { id: string; reasonForAccess: string }) => apiClient<{ downloadUrl: string }>(`/api/admin/evidence/${input.id}/secure-open`, { method: "POST", body: { reasonForAccess: input.reasonForAccess }, userId: DEV_USER_ID, userRole: "ADMIN" }) });
}

export function useEvidenceDecisionActions() {
  const act = (id: string, action: string, reason: string) => apiClient<EvidenceMetadata>(`/api/admin/evidence/${id}/${action}`, { method: "POST", body: { reason }, userId: DEV_USER_ID, userRole: "ADMIN" });
  return {
    accept: (id: string, reason = "Accepted") => act(id, "accept", reason),
    reject: (id: string, reason: string) => act(id, "reject", reason),
    privateOnly: (id: string, reason = "Private only") => act(id, "private-only", reason),
    requestReplacement: (id: string, reason: string) => act(id, "request-replacement", reason),
    remove: (id: string, reason: string) => act(id, "delete", reason),
    escalate: (id: string, reason = "Escalated") => act(id, "escalate", reason),
  };
}
