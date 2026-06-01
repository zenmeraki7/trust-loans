export type NotificationType =
  | "review_status"
  | "report_update"
  | "company_response"
  | "evidence_update"
  | "correction_update"
  | "privacy_alert"
  | "watchlist_update"
  | "admin_alert";

export type NotificationPriority = "low" | "normal" | "high";

export type NotificationCenterData = {
  currentRole: "user" | "company_rep" | "moderator" | "admin";
  filters: {
    type: string;
    status: "" | "read" | "unread";
    priority: "" | NotificationPriority;
    dateRange: { from: string; to: string };
    relatedAppId: string;
    roleScopedOnly: boolean;
  };
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedItem: {
      type: "review" | "report" | "company_response" | "evidence" | "correction" | "privacy_case" | "watchlist" | "system";
      id: string;
      title: string;
      url: string;
    };
    app: {
      id: string;
      name: string;
      logoUrl: string;
    };
    priority: NotificationPriority;
    read: boolean;
    createdAt: string;
    status: string;
    roles: Array<"user" | "company_rep" | "moderator" | "admin">;
    ctaLabel: string;
    ctaUrl: string;
  }>;
  settings: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    reviewUpdates: boolean;
    companyResponses: boolean;
    correctionUpdates: boolean;
    privacyAlerts: boolean;
    savedAppAlerts: boolean;
    adminOperationalAlerts: boolean;
  };
};
