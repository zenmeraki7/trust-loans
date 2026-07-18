"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { NotificationCenterData, NotificationPriority, NotificationType } from "@/types/notificationCenter";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID ?? "demo-user";
const auth = { userId: DEV_USER_ID, userRole: "USER" } as const;

type NotificationDto = {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  relatedUrl?: string | null;
  createdAt: string | Date;
};

type NotificationSettingsDto = {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  reviewStatusUpdates: boolean;
  companyResponseAlerts: boolean;
  correctionUpdates: boolean;
  evidenceUpdates: boolean;
  adminAlerts: boolean;
  savedAppAlerts: boolean;
};

const asType = (value: string): NotificationType => {
  const normalized = value.toLowerCase();
  if (normalized === "review_status" || normalized === "report_update" || normalized === "company_response" || normalized === "evidence_update" || normalized === "correction_update" || normalized === "privacy_alert" || normalized === "watchlist_update" || normalized === "admin_alert") return normalized;
  if (normalized.includes("review")) return "review_status";
  if (normalized.includes("evidence")) return "evidence_update";
  if (normalized.includes("correction")) return "correction_update";
  if (normalized.includes("company")) return "company_response";
  return "admin_alert";
};

const asPriority = (value: string): NotificationPriority => {
  const normalized = value.toLowerCase();
  if (normalized === "low" || normalized === "high") return normalized;
  return "normal";
};

const relatedType = (type: NotificationType): NotificationCenterData["notifications"][number]["relatedItem"]["type"] => {
  if (type === "review_status") return "review";
  if (type === "report_update") return "report";
  if (type === "company_response") return "company_response";
  if (type === "evidence_update") return "evidence";
  if (type === "correction_update") return "correction";
  if (type === "privacy_alert") return "privacy_case";
  if (type === "watchlist_update") return "watchlist";
  return "system";
};

const buildNotificationCenter = (items: NotificationDto[], settings: NotificationSettingsDto): NotificationCenterData => ({
  currentRole: "user",
  filters: {
    type: "",
    status: "",
    priority: "",
    dateRange: { from: "", to: "" },
    relatedAppId: "",
    roleScopedOnly: false,
  },
  notifications: items.map((item) => {
    const type = asType(item.type);
    return {
      id: item.id,
      type,
      title: item.title,
      message: item.message,
      relatedItem: {
        type: relatedType(type),
        id: item.id,
        title: item.title,
        url: item.relatedUrl ?? "",
      },
      app: {
        id: "",
        name: "Trust Loans",
        logoUrl: "https://dummyimage.com/64x64/e2e8f0/0f172a.png&text=TL",
      },
      priority: asPriority(item.priority),
      read: item.read,
      createdAt: new Date(item.createdAt).toISOString(),
      status: item.read ? "read" : "unread",
      roles: ["user"],
      ctaLabel: item.relatedUrl ? "Open" : "View",
      ctaUrl: item.relatedUrl ?? "",
    };
  }),
  settings: {
    emailEnabled: settings.emailEnabled,
    inAppEnabled: settings.inAppEnabled,
    reviewUpdates: settings.reviewStatusUpdates,
    companyResponses: settings.companyResponseAlerts,
    correctionUpdates: settings.correctionUpdates,
    privacyAlerts: settings.adminAlerts,
    savedAppAlerts: settings.savedAppAlerts,
    adminOperationalAlerts: settings.adminAlerts,
  },
});

export function useNotificationCenter() {
  return useQuery({
    queryKey: ["notificationCenter"],
    queryFn: async () => {
      const [notifications, settings] = await Promise.all([
        apiClient<{ items: NotificationDto[] }>("/api/notifications?limit=100", auth),
        apiClient<NotificationSettingsDto>("/api/notification-settings", auth),
      ]);
      return buildNotificationCenter(notifications.items ?? [], settings);
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient<NotificationDto>(`/api/notifications/${id}/read`, { ...auth, method: "POST" }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notificationCenter"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient<{ count: number }>("/api/notifications/read-all", { ...auth, method: "POST" }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notificationCenter"] }),
  });
}
