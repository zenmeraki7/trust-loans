import { adminEvidenceVault } from "@/data/mockAdminEvidenceVault";
import type { AdminEvidenceVaultData } from "@/types/adminEvidenceVault";

type EvidenceListItem = AdminEvidenceVaultData["evidenceFiles"][number];
type SelectedEvidence = AdminEvidenceVaultData["selectedEvidence"];
type AccessLog = AdminEvidenceVaultData["accessLogs"][number];

export type EvidenceStatus = EvidenceListItem["status"];

export type EvidenceRecord = EvidenceListItem & {
  fileSizeBytes: number;
  storageKey: string;
  uploadToken: string;
  previewToken: string;
  originalFileName: string;
  mimeType: string;
  completed: boolean;
  private: true;
  redaction: SelectedEvidence["redaction"];
  decision: SelectedEvidence["decision"];
  retention: SelectedEvidence["retention"];
  accessLog: string[];
  internalNotes: string[];
};

const nowIso = () => new Date().toISOString();

const maskFileName = (fileName: string) => {
  const [name = "evidence", extension = "file"] = fileName.split(".");
  return `${name.slice(0, 4)}_****.${extension}`;
};

const createToken = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const seed = adminEvidenceVault.evidenceFiles[0];
const selected = adminEvidenceVault.selectedEvidence;

const evidenceDb = new Map<string, EvidenceRecord>([
  [
    seed.id,
    {
      ...seed,
      fileSizeBytes: selected.fileSizeBytes,
      storageKey: `private/evidence/${seed.id}`,
      uploadToken: createToken("upl"),
      previewToken: createToken("prv"),
      originalFileName: "chat_screenshot_21.png",
      mimeType: selected.fileType,
      completed: true,
      private: true,
      redaction: selected.redaction,
      decision: selected.decision,
      retention: selected.retention,
      accessLog: selected.accessLog,
      internalNotes: selected.internalNotes,
    },
  ],
]);

const auditLogs: AccessLog[] = [...adminEvidenceVault.accessLogs];

const publicMetadata = (record: EvidenceRecord) => ({
  id: record.id,
  maskedFileName: record.maskedFileName,
  fileType: record.fileType,
  mimeType: record.mimeType,
  fileSizeBytes: record.fileSizeBytes,
  linkedItem: record.linkedItem,
  appOrEntityName: record.appOrEntityName,
  uploadedBy: record.uploadedBy,
  uploadedAt: record.uploadedAt,
  safetyScanStatus: record.safetyScanStatus,
  sensitiveDataFlags: record.sensitiveDataFlags,
  status: record.status,
  redactionStatus: record.redaction.status,
  retentionStatus: record.retentionStatus,
  private: true,
});

const logEvidenceAccess = (
  evidenceId: string,
  action: string,
  accessReason: string,
  result = "Success",
  actorName = "System Admin",
  actorRole = "admin",
) => {
  const log: AccessLog = {
    id: `AL-${Date.now()}`,
    timestamp: nowIso(),
    actorName,
    actorRole,
    evidenceId,
    action,
    accessReason,
    ipDevicePlaceholder: "IP withheld / secure admin session",
    result,
    internalNote: "Raw evidence is not exposed through public APIs.",
  };
  auditLogs.unshift(log);
  const record = evidenceDb.get(evidenceId);
  if (record) {
    record.accessLog = [`${action} by ${actorName} at ${log.timestamp}`, ...record.accessLog];
    evidenceDb.set(evidenceId, record);
  }
  return log;
};

export const createUploadUrl = (payload: {
  fileName: string;
  fileType: EvidenceListItem["fileType"];
  mimeType: string;
  linkedItem: EvidenceListItem["linkedItem"];
  appOrEntityName: string;
  uploaderDisplayNameMasked?: string;
  uploaderEmailMasked?: string;
}) => {
  const id = `EVD-${Date.now()}`;
  const uploadToken = createToken("upl");
  const record: EvidenceRecord = {
    id,
    maskedFileName: maskFileName(payload.fileName),
    fileType: payload.fileType,
    linkedItem: payload.linkedItem,
    appOrEntityName: payload.appOrEntityName,
    uploadedBy: {
      type: "user",
      displayNameMasked: payload.uploaderDisplayNameMasked ?? "U***",
      emailMasked: payload.uploaderEmailMasked ?? "u***@mail.com",
    },
    uploadedAt: nowIso(),
    safetyScanStatus: "pending",
    sensitiveDataFlags: [],
    status: "scan_pending",
    assignedReviewer: "",
    retentionStatus: "active",
    fileSizeBytes: 0,
    storageKey: `private/evidence/${id}`,
    uploadToken,
    previewToken: createToken("prv"),
    originalFileName: payload.fileName,
    mimeType: payload.mimeType,
    completed: false,
    private: true,
    redaction: {
      status: "not_started",
      redactedCopyId: "",
      redactionReasons: [],
      redactedBy: "",
      redactedAt: "",
    },
    decision: {
      status: "scan_pending",
      reason: "",
      moderatorNote: "",
      notifyUploader: false,
      seniorApprovalRequired: false,
    },
    retention: {
      retentionDays: 180,
      scheduledDeletionAt: "",
      legalHold: false,
      deletionReason: "",
    },
    accessLog: [],
    internalNotes: ["Evidence created through signed upload URL flow."],
  };
  evidenceDb.set(id, record);
  logEvidenceAccess(id, "Created signed upload URL", "Evidence upload initialization");

  return {
    evidenceId: id,
    uploadUrl: `https://signed-upload.example.local/${id}?token=${uploadToken}`,
    expiresInSeconds: 900,
    storageKey: record.storageKey,
  };
};

export const completeEvidenceUpload = (id: string, fileSizeBytes: number, sensitiveDataFlags: string[] = []) => {
  const record = evidenceDb.get(id);
  if (!record) return null;
  const status: EvidenceStatus = sensitiveDataFlags.length ? "sensitive_data_detected" : "pending_review";
  const updated: EvidenceRecord = {
    ...record,
    completed: true,
    fileSizeBytes,
    safetyScanStatus: sensitiveDataFlags.length ? "flagged" : "clean",
    sensitiveDataFlags,
    status,
    decision: { ...record.decision, status },
  };
  evidenceDb.set(id, updated);
  logEvidenceAccess(id, "Completed upload", "Upload confirmation");
  return publicMetadata(updated);
};

export const listEvidence = () => Array.from(evidenceDb.values()).map(publicMetadata);

export const getEvidenceRecord = (id: string) => evidenceDb.get(id) || null;

export const getEvidenceMetadata = (id: string) => {
  const record = getEvidenceRecord(id);
  return record ? publicMetadata(record) : null;
};

export const deleteEvidenceByUser = (id: string) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  const updated: EvidenceRecord = {
    ...record,
    status: "scheduled_for_deletion",
    retentionStatus: "scheduled",
    retention: {
      ...record.retention,
      scheduledDeletionAt: nowIso(),
      deletionReason: "Uploader deletion request",
    },
  };
  evidenceDb.set(id, updated);
  logEvidenceAccess(id, "Scheduled deletion", "Uploader deletion request");
  return publicMetadata(updated);
};

export const getAdminEvidence = (id: string) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  return {
    ...publicMetadata(record),
    decision: record.decision,
    redaction: record.redaction,
    retention: record.retention,
    accessLog: record.accessLog,
    internalNotes: record.internalNotes,
  };
};

export const secureOpenEvidence = (id: string, accessReason: string) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  const log = logEvidenceAccess(id, "Secure preview opened", accessReason || "Moderator review");
  return {
    evidenceId: id,
    securePreviewUrl: `https://signed-preview.example.local/${id}?token=${record.previewToken}`,
    expiresInSeconds: 300,
    auditLog: log,
  };
};

export const updateEvidenceDecision = (id: string, status: EvidenceStatus, reason: string, action: string) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  const updated: EvidenceRecord = {
    ...record,
    status,
    decision: {
      ...record.decision,
      status,
      reason,
      moderatorNote: reason,
    },
  };
  evidenceDb.set(id, updated);
  logEvidenceAccess(id, action, reason || "Moderation decision");
  return getAdminEvidence(id);
};

export const redactEvidence = (id: string, reasons: string[] = []) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  const updated: EvidenceRecord = {
    ...record,
    status: "redaction_required",
    redaction: {
      status: "completed",
      redactedCopyId: `RED-${id}`,
      redactionReasons: reasons,
      redactedBy: "System Admin",
      redactedAt: nowIso(),
    },
  };
  evidenceDb.set(id, updated);
  logEvidenceAccess(id, "Redacted evidence", reasons.join(", ") || "Privacy redaction");
  return getAdminEvidence(id);
};

export const hardDeleteEvidence = (id: string, reason: string) => {
  const record = getEvidenceRecord(id);
  if (!record) return null;
  const updated: EvidenceRecord = {
    ...record,
    status: "deleted",
    retentionStatus: "scheduled",
    retention: {
      ...record.retention,
      scheduledDeletionAt: nowIso(),
      deletionReason: reason || "Admin deletion",
    },
  };
  evidenceDb.set(id, updated);
  logEvidenceAccess(id, "Deleted evidence metadata", reason || "Admin deletion");
  return getAdminEvidence(id);
};

export const listEvidenceAuditLogs = () => auditLogs;

