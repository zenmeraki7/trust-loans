import crypto from "crypto";

export const storageAdapter = {
  createSignedUploadUrl(input: { storageKey: string; mimeType: string }) {
    return {
      uploadUrl: `https://storage-placeholder.local/upload/${encodeURIComponent(input.storageKey)}?mime=${encodeURIComponent(input.mimeType)}`,
      expiresInSeconds: 900,
    };
  },

  createSignedDownloadUrl(input: { storageKey: string }) {
    return {
      downloadUrl: `https://storage-placeholder.local/download/${encodeURIComponent(input.storageKey)}`,
      expiresInSeconds: 300,
    };
  },

  hashOriginalFileName(fileName: string) {
    return crypto.createHash("sha256").update(fileName).digest("hex");
  },
};
