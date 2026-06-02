-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'SENIOR_MODERATOR', 'DATA_VERIFIER', 'ADMIN', 'SUPER_ADMIN', 'COMPANY_REPRESENTATIVE', 'NBFC_REPRESENTATIVE', 'ANALYST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ComplaintTemplateCategory" AS ENUM ('HARASSMENT', 'PHOTO_MORPHING', 'DATA_MISUSE', 'FAKE_LEGAL_NOTICE', 'HIDDEN_CHARGES', 'PAYMENT_NOT_UPDATED', 'LOAN_NOT_CLOSED', 'GRIEVANCE_ESCALATION', 'RBI_CMS', 'CYBERCRIME', 'CONSUMER_HELPLINE', 'ADVOCATE_BRIEFING');

-- CreateEnum
CREATE TYPE "ComplaintOutputType" AS ENUM ('GRIEVANCE_EMAIL', 'RBI_CMS_TEXT', 'CYBERCRIME_TEXT', 'CONSUMER_HELPLINE_TEXT', 'ADVOCATE_BRIEFING_NOTE', 'PERSONAL_RECORD');

-- CreateEnum
CREATE TYPE "ComplaintDraftStatus" AS ENUM ('DRAFT', 'COMPLETED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNDER_REVIEW', 'HIDDEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'UNDER_VERIFICATION', 'CONFLICTING_INFORMATION', 'NEEDS_MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('UNCLAIMED', 'CLAIM_PENDING', 'CLAIMED', 'DISPUTED_CLAIM');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'SEVERE_COMPLAINT_PATTERN', 'UNDER_REVIEW', 'INSUFFICIENT_DATA');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('GENERAL_REVIEW', 'HARASSMENT_COMPLAINT', 'HIDDEN_CHARGES', 'DATA_PRIVACY', 'PHOTO_MORPHING_THREAT', 'FAKE_LEGAL_NOTICE', 'PAYMENT_ISSUE', 'LOAN_CLOSURE_ISSUE', 'POSITIVE_EXPERIENCE');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_MODERATION', 'NEEDS_MORE_INFO', 'PUBLISHED', 'PARTIALLY_PUBLISHED', 'REJECTED', 'REMOVED_BY_USER', 'ESCALATED');

-- CreateEnum
CREATE TYPE "DisplayMode" AS ENUM ('ANONYMOUS', 'FIRST_NAME_ONLY', 'VERIFIED_BADGE_ONLY');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('UPLOADED', 'SCAN_PENDING', 'SENSITIVE_DATA_DETECTED', 'PENDING_REVIEW', 'REDACTION_REQUIRED', 'ACCEPTED_FOR_VERIFICATION', 'PRIVATE_ONLY', 'REJECTED_FOR_SAFETY', 'DELETED', 'SCHEDULED_FOR_DELETION', 'ESCALATED');

-- CreateEnum
CREATE TYPE "RedactionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'REDACTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CompanyResponseCategory" AS ENUM ('CLARIFICATION', 'APOLOGY', 'SUPPORT_OFFERED', 'DISPUTE', 'GENERAL_STATEMENT');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "CorrectionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'MORE_INFORMATION_NEEDED', 'ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApp" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "packageName" TEXT,
    "developerName" TEXT,
    "companyName" TEXT,
    "websiteUrl" TEXT,
    "playStoreUrl" TEXT,
    "appStoreUrl" TEXT,
    "claimedNbfcPartner" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNDER_VERIFICATION',
    "claimStatus" "ClaimStatus" NOT NULL DEFAULT 'UNCLAIMED',
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'INSUFFICIENT_DATA',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "grievanceEmail" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "registeredAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ComplaintTemplateCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "outputTypes" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplaintTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT,
    "loanAppId" TEXT,
    "title" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "outputType" "ComplaintOutputType" NOT NULL,
    "status" "ComplaintDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "formData" JSONB NOT NULL,
    "generatedSubject" TEXT,
    "generatedBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplaintDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "loanAppId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publicBody" TEXT,
    "rating" INTEGER NOT NULL,
    "reviewType" "ReviewType" NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'SUBMITTED',
    "displayMode" "DisplayMode" NOT NULL DEFAULT 'ANONYMOUS',
    "incidentDate" TIMESTAMP(3),
    "loanAmountRange" TEXT,
    "tags" TEXT[],
    "evidenceSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "redactionsApplied" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "loanAppId" TEXT,
    "reviewId" TEXT,
    "storageKey" TEXT NOT NULL,
    "maskedFileName" TEXT NOT NULL,
    "originalFileNameHash" TEXT,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'UPLOADED',
    "privateByDefault" BOOLEAN NOT NULL DEFAULT true,
    "sensitiveFlags" TEXT[],
    "redactionStatus" "RedactionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyResponse" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "responderUserId" TEXT,
    "companyName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "CompanyResponseCategory" NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintSummary" (
    "id" TEXT NOT NULL,
    "loanAppId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectionRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT,
    "requestType" TEXT NOT NULL,
    "status" "CorrectionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "publicItemType" TEXT,
    "publicItemId" TEXT,
    "explanation" TEXT NOT NULL,
    "currentValue" TEXT,
    "proposedValue" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "relatedUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reviewStatusUpdates" BOOLEAN NOT NULL DEFAULT true,
    "companyResponseAlerts" BOOLEAN NOT NULL DEFAULT true,
    "correctionUpdates" BOOLEAN NOT NULL DEFAULT true,
    "evidenceUpdates" BOOLEAN NOT NULL DEFAULT true,
    "adminAlerts" BOOLEAN NOT NULL DEFAULT false,
    "savedAppAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "averageRatingWeight" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "reviewVolumeWeight" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "recentComplaintTrendWeight" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "complaintSeverityWeight" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "verifiedBorrowerWeight" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "companyResponseWeight" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "grievanceAvailabilityWeight" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "publicDetailVerificationWeight" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "reviewIntegrityWeight" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "severeComplaintPenalty" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "privacyComplaintPenalty" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "hiddenChargeComplaintPenalty" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "staleVerificationPenalty" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoringConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoanApp_slug_key" ON "LoanApp"("slug");

-- CreateIndex
CREATE INDEX "LoanApp_status_idx" ON "LoanApp"("status");

-- CreateIndex
CREATE INDEX "LoanApp_riskLevel_idx" ON "LoanApp"("riskLevel");

-- CreateIndex
CREATE INDEX "LoanApp_verificationStatus_idx" ON "LoanApp"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintTemplate_key_key" ON "ComplaintTemplate"("key");

-- CreateIndex
CREATE INDEX "ComplaintDraft_userId_idx" ON "ComplaintDraft"("userId");

-- CreateIndex
CREATE INDEX "ComplaintDraft_templateId_idx" ON "ComplaintDraft"("templateId");

-- CreateIndex
CREATE INDEX "ComplaintDraft_loanAppId_idx" ON "ComplaintDraft"("loanAppId");

-- CreateIndex
CREATE INDEX "ComplaintDraft_status_idx" ON "ComplaintDraft"("status");

-- CreateIndex
CREATE INDEX "Review_loanAppId_idx" ON "Review"("loanAppId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "Review"("status");

-- CreateIndex
CREATE INDEX "EvidenceFile_userId_idx" ON "EvidenceFile"("userId");

-- CreateIndex
CREATE INDEX "EvidenceFile_loanAppId_idx" ON "EvidenceFile"("loanAppId");

-- CreateIndex
CREATE INDEX "EvidenceFile_reviewId_idx" ON "EvidenceFile"("reviewId");

-- CreateIndex
CREATE INDEX "EvidenceFile_status_idx" ON "EvidenceFile"("status");

-- CreateIndex
CREATE INDEX "CompanyResponse_reviewId_idx" ON "CompanyResponse"("reviewId");

-- CreateIndex
CREATE INDEX "CompanyResponse_status_idx" ON "CompanyResponse"("status");

-- CreateIndex
CREATE INDEX "ComplaintSummary_tag_idx" ON "ComplaintSummary"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintSummary_loanAppId_tag_key" ON "ComplaintSummary"("loanAppId", "tag");

-- CreateIndex
CREATE INDEX "CorrectionRequest_requesterId_idx" ON "CorrectionRequest"("requesterId");

-- CreateIndex
CREATE INDEX "CorrectionRequest_status_idx" ON "CorrectionRequest"("status");

-- CreateIndex
CREATE INDEX "CorrectionRequest_publicItemType_publicItemId_idx" ON "CorrectionRequest"("publicItemType", "publicItemId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ScoringConfig_name_key" ON "ScoringConfig"("name");

-- AddForeignKey
ALTER TABLE "ComplaintDraft" ADD CONSTRAINT "ComplaintDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDraft" ADD CONSTRAINT "ComplaintDraft_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ComplaintTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDraft" ADD CONSTRAINT "ComplaintDraft_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFile" ADD CONSTRAINT "EvidenceFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFile" ADD CONSTRAINT "EvidenceFile_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceFile" ADD CONSTRAINT "EvidenceFile_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyResponse" ADD CONSTRAINT "CompanyResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintSummary" ADD CONSTRAINT "ComplaintSummary_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectionRequest" ADD CONSTRAINT "CorrectionRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
