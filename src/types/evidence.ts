export type EvidenceMetadata = {
  id: string;
  loanAppId?: string | null;
  reviewId?: string | null;
  maskedFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  status: string;
  privateByDefault: boolean;
  sensitiveFlags: string[];
  redactionStatus: string;
  uploadedAt: string;
  updatedAt: string;
};
