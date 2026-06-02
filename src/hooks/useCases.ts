"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { HarassmentCase } from "@/types/harassmentCase";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";

const auth = { userId: DEV_USER_ID, userRole: "USER" } as const;

export function useCases() {
  return useQuery({ queryKey: ["cases"], queryFn: () => apiClient<HarassmentCase[]>("/api/me/cases", auth) });
}

export function useCaseDetail(caseId: string) {
  return useQuery({ queryKey: ["case", caseId], enabled: Boolean(caseId), queryFn: () => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`, auth) });
}

export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: { title: string; caseType: string; summary?: string }) => apiClient<HarassmentCase>("/api/me/cases", { ...auth, method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["cases"] }) });
}

export function useUpdateCase(caseId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`, { ...auth, method: "PATCH", body }), onSuccess: () => { void qc.invalidateQueries({ queryKey: ["cases"] }); void qc.invalidateQueries({ queryKey: ["case", caseId] }); } });
}

export function useArchiveCase(caseId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`, { ...auth, method: "DELETE" }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["cases"] }) });
}

export function useCreateTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/timeline`, { ...auth, method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useUpdateTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ itemId, body }: { itemId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/timeline/${itemId}`, { ...auth, method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useDeleteTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (itemId: string) => apiClient(`/api/me/cases/${caseId}/timeline/${itemId}`, { ...auth, method: "DELETE" }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }

export function useCreateChecklistItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/checklist`, { ...auth, method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useUpdateChecklistItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ itemId, body }: { itemId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/checklist/${itemId}`, { ...auth, method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }

export function useExternalComplaintTracker(caseId: string) {
  const qc = useQueryClient();
  return {
    create: useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/external-complaints`, { ...auth, method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }),
    update: useMutation({ mutationFn: ({ complaintId, body }: { complaintId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/external-complaints/${complaintId}`, { ...auth, method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }),
  };
}

export function useLinkCaseReview(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-review`, { ...auth, method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseEvidence(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-evidence`, { ...auth, method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseDecisionSession(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-decision-session`, { ...auth, method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseComplaintDraft(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-complaint-draft`, { ...auth, method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
