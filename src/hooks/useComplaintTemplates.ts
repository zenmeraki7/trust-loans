import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultComplaintTemplates } from "@/data/defaultComplaintTemplates";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { ComplaintDraft, ComplaintFormData, ComplaintOutputType, ComplaintTemplate, GeneratedComplaint } from "@/types/complaintTemplates";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";

export function useComplaintTemplates() {
  return useQuery({
    queryKey: queryKeys.complaintTemplates(),
    queryFn: async () => {
      try {
        const templates = await apiClient<ComplaintTemplate[]>("/api/complaint-templates");
        return templates.length > 0 ? templates : defaultComplaintTemplates;
      } catch (error) {
        if (process.env.NODE_ENV === "development") return defaultComplaintTemplates;
        throw error;
      }
    },
  });
}

export function useComplaintTemplate(key: string) {
  return useQuery({
    queryKey: queryKeys.complaintTemplate(key),
    enabled: Boolean(key),
    queryFn: async () => {
      try {
        return await apiClient<ComplaintTemplate>(`/api/complaint-templates/${key}`);
      } catch (error) {
        const fallback = defaultComplaintTemplates.find((template) => template.key === key);
        if (process.env.NODE_ENV === "development" && fallback) return fallback;
        throw error;
      }
    },
  });
}

export function useGenerateComplaintTemplate() {
  return useMutation({
    mutationFn: (input: { templateKey: string; outputType: ComplaintOutputType; formData: ComplaintFormData }) =>
      apiClient<GeneratedComplaint>("/api/complaint-templates/generate", { method: "POST", body: input }),
  });
}

export function useCreateComplaintDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      templateId?: string;
      loanAppId?: string;
      title: string;
      templateKey: string;
      outputType: ComplaintOutputType;
      formData: ComplaintFormData;
      generatedSubject?: string;
      generatedBody: string;
    }) =>
      apiClient<ComplaintDraft>("/api/complaint-drafts", {
        method: "POST",
        body,
        userId: DEV_USER_ID,
        userRole: "USER",
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.complaintDrafts() }),
  });
}

export function useComplaintDrafts() {
  return useQuery({
    queryKey: queryKeys.complaintDrafts(),
    queryFn: () => apiClient<ComplaintDraft[]>("/api/me/complaint-drafts", { userId: DEV_USER_ID, userRole: "USER" }),
  });
}

export function useComplaintDraft(id: string) {
  return useQuery({
    queryKey: queryKeys.complaintDraft(id),
    enabled: Boolean(id),
    queryFn: () => apiClient<ComplaintDraft>(`/api/me/complaint-drafts/${id}`, { userId: DEV_USER_ID, userRole: "USER" }),
  });
}

export function useUpdateComplaintDraft(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ComplaintDraft>) =>
      apiClient<ComplaintDraft>(`/api/me/complaint-drafts/${id}`, {
        method: "PATCH",
        body,
        userId: DEV_USER_ID,
        userRole: "USER",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaintDraft(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaintDrafts() });
    },
  });
}

export function useDeleteComplaintDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/api/me/complaint-drafts/${id}`, {
        method: "DELETE",
        userId: DEV_USER_ID,
        userRole: "USER",
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.complaintDrafts() }),
  });
}
