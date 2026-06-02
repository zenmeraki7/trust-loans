-- CreateEnum
CREATE TYPE "HarassmentCaseType" AS ENUM ('THREAT_CALLS', 'CONTACT_LIST_ABUSE', 'OFFICE_HARASSMENT', 'PHOTO_MORPHING_THREAT', 'DATA_MISUSE', 'FAKE_LEGAL_NOTICE', 'PAYMENT_NOT_UPDATED', 'LOAN_NOT_CLOSED', 'HIDDEN_CHARGES', 'PERSONAL_UPI_PRESSURE', 'OTHER');

-- CreateEnum
CREATE TYPE "HarassmentCaseStatus" AS ENUM ('OPEN', 'WAITING_FOR_RESPONSE', 'ACTION_NEEDED', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CaseTimelineType" AS ENUM ('LOAN_DISBURSED', 'PAYMENT_DUE', 'PAYMENT_MADE', 'THREAT_RECEIVED', 'CALL_RECEIVED', 'RELATIVE_CONTACTED', 'OFFICE_CONTACTED', 'PHOTO_THREAT_RECEIVED', 'FAKE_LEGAL_NOTICE_RECEIVED', 'COMPLAINT_SENT', 'RESPONSE_RECEIVED', 'EVIDENCE_UPLOADED', 'REVIEW_SUBMITTED', 'OTHER');

-- CreateEnum
CREATE TYPE "ExternalComplaintChannel" AS ENUM ('APP_GRIEVANCE_OFFICER', 'RBI_CMS', 'CYBERCRIME_PORTAL', 'CONSUMER_HELPLINE', 'LOCAL_POLICE', 'ADVOCATE', 'APP_STORE_REPORT', 'PLAY_STORE_REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ExternalComplaintStatus" AS ENUM ('NOT_STARTED', 'DRAFTED', 'SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESPONDED', 'RESOLVED', 'CLOSED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ReviewReportStatus" AS ENUM ('PENDING_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "HarassmentCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loanAppId" TEXT,
    "title" TEXT NOT NULL,
    "caseType" "HarassmentCaseType" NOT NULL,
    "status" "HarassmentCaseStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "CasePriority" NOT NULL DEFAULT 'NORMAL',
    "summary" TEXT,
    "incidentDate" TIMESTAMP(3),
    "loanReferenceId" TEXT,
    "loanAmountRange" TEXT,
    "decisionTreeSessionId" TEXT,
    "linkedReviewId" TEXT,
    "linkedEvidenceFileIds" TEXT[],
    "linkedComplaintDraftIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HarassmentCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseTimelineItem" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "CaseTimelineType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "happenedAt" TIMESTAMP(3),
    "evidenceFileIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseTimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseChecklistItem" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalComplaint" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "channel" "ExternalComplaintChannel" NOT NULL,
    "complaintNumber" TEXT,
    "submittedAt" TIMESTAMP(3),
    "status" "ExternalComplaintStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "notes" TEXT,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "reporterUserId" TEXT,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "status" "ReviewReportStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HarassmentCase_userId_idx" ON "HarassmentCase"("userId");

-- CreateIndex
CREATE INDEX "HarassmentCase_loanAppId_idx" ON "HarassmentCase"("loanAppId");

-- CreateIndex
CREATE INDEX "HarassmentCase_status_idx" ON "HarassmentCase"("status");

-- CreateIndex
CREATE INDEX "CaseTimelineItem_caseId_idx" ON "CaseTimelineItem"("caseId");

-- CreateIndex
CREATE INDEX "CaseChecklistItem_caseId_idx" ON "CaseChecklistItem"("caseId");

-- CreateIndex
CREATE INDEX "ExternalComplaint_caseId_idx" ON "ExternalComplaint"("caseId");

-- CreateIndex
CREATE INDEX "ExternalComplaint_channel_idx" ON "ExternalComplaint"("channel");

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_idx" ON "ReviewReport"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReport_reporterUserId_idx" ON "ReviewReport"("reporterUserId");

-- CreateIndex
CREATE INDEX "ReviewReport_status_idx" ON "ReviewReport"("status");

-- AddForeignKey
ALTER TABLE "HarassmentCase" ADD CONSTRAINT "HarassmentCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarassmentCase" ADD CONSTRAINT "HarassmentCase_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseTimelineItem" ADD CONSTRAINT "CaseTimelineItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "HarassmentCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseChecklistItem" ADD CONSTRAINT "CaseChecklistItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "HarassmentCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalComplaint" ADD CONSTRAINT "ExternalComplaint_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "HarassmentCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
