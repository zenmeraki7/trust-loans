export type AdminUserRoleManagementData = {
  stats: {
    totalUsers: number;
    adminUsers: number;
    moderators: number;
    companyRepresentatives: number;
    pendingInvitations: number;
    suspendedAccounts: number;
    elevatedAccessUsers: number;
    failedLoginAlerts: number;
  };
  filters: {
    query: string;
    role: string;
    accountStatus: string;
    verificationStatus: string;
    lastActiveRange: { from: string; to: string };
    hasAdminAccess: boolean;
    hasEvidenceAccess: boolean;
    hasModerationAccess: boolean;
    companyRepresentative: boolean;
    suspendedOnly: boolean;
  };
  users: Array<{
    id: string;
    name: string;
    emailMasked: string;
    role: string;
    accountType: "internal_team" | "company_representative" | "nbfc_representative" | "analyst";
    verificationStatus: "verified" | "pending_verification" | "limited_access";
    assignedEntityName: string;
    assignedAppProfiles: string[];
    permissionsSummary: string[];
    lastActiveAt: string;
    status: "active" | "pending_invite" | "pending_verification" | "limited_access" | "suspended" | "revoked" | "deactivated";
  }>;
  selectedUser: {
    id: string;
    name: string;
    emailMasked: string;
    phoneMasked: string;
    accountType: string;
    role: string;
    verificationStatus: string;
    assignedCompanyOrEntity: string;
    assignedAppProfiles: string[];
    security: {
      twoFactorEnabled: boolean;
      lastLoginAt: string;
      activeSessions: number;
      failedLoginCount: number;
    };
    accessRestrictions: {
      canViewPrivateEvidence: boolean;
      canDownloadFiles: boolean;
      canExportCsv: boolean;
      canApproveReviews: boolean;
      canPublishCorrections: boolean;
      canManageClaims: boolean;
      canMergeRecords: boolean;
      canViewUserContactDetails: boolean;
      canViewCompanyDocuments: boolean;
      canAccessAnalytics: boolean;
    };
    recentActions: string[];
    auditLog: Array<{
      timestamp: string;
      actor: string;
      action: string;
      target: string;
      ipDevice: string;
      previousValue: string;
      newValue: string;
      note: string;
    }>;
  };
  roles: Array<{ id: string; name: string; description: string; permissions: string[] }>;
  permissionMatrix: Array<{
    permissionKey: string;
    label: string;
    superAdmin: "allowed" | "denied" | "limited" | "requires_senior_approval";
    admin: "allowed" | "denied" | "limited" | "requires_senior_approval";
    seniorModerator: "allowed" | "denied" | "limited" | "requires_senior_approval";
    moderator: "allowed" | "denied" | "limited" | "requires_senior_approval";
    dataVerifier: "allowed" | "denied" | "limited" | "requires_senior_approval";
    analyst: "allowed" | "denied" | "limited" | "requires_senior_approval";
    companyRepresentative: "allowed" | "denied" | "limited" | "requires_senior_approval";
    nbfcRepresentative: "allowed" | "denied" | "limited" | "requires_senior_approval";
  }>;
  pendingRepresentatives: Array<{
    id: string;
    representativeName: string;
    businessEmailMasked: string;
    companyOrEntityName: string;
    claimedRole: string;
    requestedProfiles: string[];
    submittedDocuments: string[];
    verificationStatus: "pending" | "needs_more_docs" | "approved" | "rejected";
    submittedAt: string;
  }>;
  securityControls: {
    require2faForAdmins: boolean;
    require2faForEvidenceAccess: boolean;
    sessionTimeoutMinutes: number;
    restrictEvidenceDownloads: boolean;
    limitExportPermissions: boolean;
    suspiciousLoginAlerts: boolean;
  };
  riskAlerts: Array<{
    id: string;
    userId: string;
    alertType: string;
    severity: "low" | "medium" | "high";
    description: string;
    detectedAt: string;
    status: "open" | "resolved";
  }>;
};
