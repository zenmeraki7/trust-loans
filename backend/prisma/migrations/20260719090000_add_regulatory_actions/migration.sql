CREATE TYPE "RegulatoryActionType" AS ENUM (
  'WARNING',
  'ADVISORY',
  'DIRECTIONS',
  'PENALTY',
  'LICENSE_RESTRICTION',
  'LICENSE_CANCELLATION',
  'CEASE_AND_DESIST',
  'APP_STORE_REMOVAL_REQUEST',
  'FRAUD_ALERT',
  'ENFORCEMENT_ACTION',
  'OTHER'
);

CREATE TYPE "RegulatoryActionSeverity" AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE "RegulatoryActionStatus" AS ENUM (
  'ACTIVE',
  'UNDER_REVIEW',
  'STAYED',
  'RESOLVED',
  'SUPERSEDED',
  'WITHDRAWN',
  'ARCHIVED'
);

CREATE TABLE "RegulatoryAction" (
  "id" TEXT NOT NULL,
  "loanAppId" TEXT,
  "nbfcCompanyId" TEXT,
  "businessId" TEXT,
  "profileId" TEXT,
  "createdByUserId" TEXT,
  "verifiedByUserId" TEXT,
  "authorityName" TEXT NOT NULL,
  "authorityJurisdiction" TEXT DEFAULT 'IN',
  "actionType" "RegulatoryActionType" NOT NULL,
  "severity" "RegulatoryActionSeverity" NOT NULL DEFAULT 'MEDIUM',
  "status" "RegulatoryActionStatus" NOT NULL DEFAULT 'ACTIVE',
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "orderNumber" TEXT,
  "sourceUrl" TEXT,
  "sourceDocumentUrl" TEXT,
  "sourcePublishedAt" TIMESTAMP(3),
  "effectiveFrom" TIMESTAMP(3),
  "effectiveUntil" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3),
  "notes" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RegulatoryAction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_nbfcCompanyId_fkey" FOREIGN KEY ("nbfcCompanyId") REFERENCES "NbfcCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegulatoryAction"
  ADD CONSTRAINT "RegulatoryAction_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "RegulatoryAction_loanAppId_status_idx" ON "RegulatoryAction"("loanAppId", "status");
CREATE INDEX "RegulatoryAction_nbfcCompanyId_status_idx" ON "RegulatoryAction"("nbfcCompanyId", "status");
CREATE INDEX "RegulatoryAction_businessId_status_idx" ON "RegulatoryAction"("businessId", "status");
CREATE INDEX "RegulatoryAction_profileId_status_idx" ON "RegulatoryAction"("profileId", "status");
CREATE INDEX "RegulatoryAction_actionType_status_idx" ON "RegulatoryAction"("actionType", "status");
CREATE INDEX "RegulatoryAction_severity_status_idx" ON "RegulatoryAction"("severity", "status");
CREATE INDEX "RegulatoryAction_authorityName_idx" ON "RegulatoryAction"("authorityName");
CREATE INDEX "RegulatoryAction_sourcePublishedAt_idx" ON "RegulatoryAction"("sourcePublishedAt");
