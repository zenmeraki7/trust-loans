-- CreateTable
DO $$ BEGIN
    CREATE TYPE "ProfileStatus" AS ENUM (
        'DRAFT',
        'PUBLISHED',
        'UNDER_REVIEW',
        'HIDDEN',
        'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "VerificationStatus" AS ENUM (
        'UNVERIFIED',
        'PARTIALLY_VERIFIED',
        'VERIFIED',
        'UNDER_VERIFICATION',
        'CONFLICTING_INFORMATION',
        'NEEDS_MANUAL_REVIEW'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ClaimStatus" AS ENUM (
        'UNCLAIMED',
        'CLAIM_PENDING',
        'CLAIMED',
        'DISPUTED_CLAIM'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RiskLevel" AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'SEVERE_COMPLAINT_PATTERN',
        'UNDER_REVIEW',
        'INSUFFICIENT_DATA'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE "NbfcCompany" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "officialWebsite" TEXT,
    "supportEmail" TEXT,
    "grievanceEmail" TEXT,
    "supportPhone" TEXT,
    "registeredAddress" TEXT,
    "nbfcRegistrationClaim" TEXT,
    "companyDescription" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PUBLISHED',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNDER_VERIFICATION',
    "claimStatus" "ClaimStatus" NOT NULL DEFAULT 'UNCLAIMED',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'INSUFFICIENT_DATA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NbfcCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NbfcCompany_slug_key" ON "NbfcCompany"("slug");

-- CreateIndex
CREATE INDEX "NbfcCompany_status_idx" ON "NbfcCompany"("status");

-- CreateIndex
CREATE INDEX "NbfcCompany_verificationStatus_idx" ON "NbfcCompany"("verificationStatus");

-- CreateIndex
CREATE INDEX "NbfcCompany_riskLevel_idx" ON "NbfcCompany"("riskLevel");
