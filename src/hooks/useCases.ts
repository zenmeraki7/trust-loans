"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ApiLoanApp, PaginatedResponse } from "@/types/apiDtos";
import type { HarassmentCase, HarassmentCaseInput } from "@/types/harassmentCase";

export function useCases() {
  return useQuery({ queryKey: ["cases"], queryFn: () => apiClient<HarassmentCase[]>("/api/me/cases") });
}

export function useCaseLoanAppOptions() {
  return useQuery({
    queryKey: ["caseLoanAppOptions"],
    queryFn: async () => {
      const response = await apiClient<PaginatedResponse<ApiLoanApp>>("/api/apps?limit=100");
      return response.items.map((app) => ({
        id: app.id,
        slug: app.slug,
        name: app.name,
        developerName: app.developerName,
        companyName: app.companyName,
      }));
    },
  });
}

export function useCaseDetail(caseId: string) {
  return useQuery({ queryKey: ["case", caseId], enabled: Boolean(caseId), queryFn: () => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`) });
}

export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: HarassmentCaseInput) => apiClient<HarassmentCase>("/api/me/cases", { method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["cases"] }) });
}

export function useUpdateCase(caseId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: Partial<HarassmentCaseInput>) => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`, { method: "PATCH", body }), onSuccess: () => { void qc.invalidateQueries({ queryKey: ["cases"] }); void qc.invalidateQueries({ queryKey: ["case", caseId] }); } });
}

export function useArchiveCase(caseId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient<HarassmentCase>(`/api/me/cases/${caseId}`, { method: "DELETE" }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["cases"] }) });
}

export function useCreateTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/timeline`, { method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useUpdateTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ itemId, body }: { itemId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/timeline/${itemId}`, { method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useDeleteTimelineItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (itemId: string) => apiClient(`/api/me/cases/${caseId}/timeline/${itemId}`, { method: "DELETE" }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }

export function useCreateChecklistItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/checklist`, { method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useUpdateChecklistItem(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ itemId, body }: { itemId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/checklist/${itemId}`, { method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }

export function useExternalComplaintTracker(caseId: string) {
  const qc = useQueryClient();
  return {
    create: useMutation({ mutationFn: (body: Record<string, unknown>) => apiClient(`/api/me/cases/${caseId}/external-complaints`, { method: "POST", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }),
    update: useMutation({ mutationFn: ({ complaintId, body }: { complaintId: string; body: Record<string, unknown> }) => apiClient(`/api/me/cases/${caseId}/external-complaints/${complaintId}`, { method: "PATCH", body }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }),
  };
}

export function useLinkCaseReview(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-review`, { method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseEvidence(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-evidence`, { method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseDecisionSession(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-decision-session`, { method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
export function useLinkCaseComplaintDraft(caseId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => apiClient(`/api/me/cases/${caseId}/link-complaint-draft`, { method: "POST", body: { id } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["case", caseId] }) }); }
