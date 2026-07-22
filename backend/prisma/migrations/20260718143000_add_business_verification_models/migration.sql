DO $$ BEGIN
    CREATE TYPE "BusinessAccountType" AS ENUM ('BANK','NBFC','LOAN_APP_OPERATOR','SERVICE_PROVIDER','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessAccountStatus" AS ENUM ('PENDING_VERIFICATION','ACTIVE','SUSPENDED','REVOKED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessProfileType" AS ENUM ('BANK','NBFC','LOAN_APP','DEVELOPER','GRIEVANCE_OFFICE','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessProfileStatus" AS ENUM ('DRAFT','CLAIM_PENDING','UNDER_VERIFICATION','VERIFIED','PARTIALLY_VERIFIED','DISPUTED','SUSPENDED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessMembershipRole" AS ENUM ('OWNER','AUTHORIZED_REPRESENTATIVE','COMPLIANCE_OFFICER','GRIEVANCE_OFFICER','PROFILE_MANAGER','VIEWER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessMembershipStatus" AS ENUM ('PENDING','ACTIVE','SUSPENDED','REVOKED','EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessRegistrationType" AS ENUM ('RBI_REGISTRATION','CIN','GSTIN','PAN','BANK_LICENSE','BOARD_AUTHORIZATION','GRIEVANCE_OFFICER_AUTHORIZATION','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessRegistrationStatus" AS ENUM ('SUBMITTED','UNDER_REVIEW','VERIFIED','REJECTED','EXPIRED','SUPERSEDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "ProfileClaimStatus" AS ENUM ('SUBMITTED','UNDER_REVIEW','INFORMATION_REQUESTED','APPROVED','REJECTED','WITHDRAWN','EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationDocumentType" AS ENUM ('RBI_CERTIFICATE','COMPANY_REGISTRATION','BOARD_RESOLUTION','AUTHORIZATION_LETTER','DOMAIN_OWNERSHIP','GRIEVANCE_OFFICER_PROOF','GOVERNMENT_ID','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationDocumentStatus" AS ENUM ('UPLOADED','SCAN_PENDING','ACCEPTED_FOR_REVIEW','INFORMATION_REQUESTED','VERIFIED','REJECTED','EXPIRED','DELETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "DocumentRequirementStatus" AS ENUM ('ACTIVE','SATISFIED','WAIVED','EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "EmailVerificationPurpose" AS ENUM ('USER_EMAIL','BUSINESS_CONTACT','GRIEVANCE_CONTACT','REPRESENTATIVE_INVITE');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "EmailVerificationStatus" AS ENUM ('PENDING','VERIFIED','EXPIRED','REVOKED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "DomainVerificationMethod" AS ENUM ('DNS_TXT','HTML_FILE','META_TAG','EMAIL_TO_DOMAIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "DomainVerificationStatus" AS ENUM ('PENDING','VERIFIED','FAILED','EXPIRED','REVOKED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessRelationshipType" AS ENUM ('OWNS','OPERATES','DEVELOPS','LENDS_FOR','CLAIMED_NBFC_PARTNER','GRIEVANCE_CONTACT_FOR','SUPPORT_PROVIDER_FOR','DOMAIN_MATCH','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "BusinessRelationshipStatus" AS ENUM ('CLAIMED','UNDER_VERIFICATION','VERIFIED','PARTIALLY_VERIFIED','DISPUTED','REJECTED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationConfidence" AS ENUM ('LOW','MEDIUM','HIGH');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationReviewStatus" AS ENUM ('QUEUED','IN_REVIEW','INFORMATION_REQUESTED','APPROVED','REJECTED','ESCALATED','CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationReviewPriority" AS ENUM ('LOW','NORMAL','HIGH','URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationDecisionOutcome" AS ENUM ('APPROVE','PARTIALLY_APPROVE','REJECT','REQUEST_INFORMATION','ESCALATE','REVOKE');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "VerificationDecisionStatus" AS ENUM ('DRAFT','FINAL','SUPERSEDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "InformationRequestStatus" AS ENUM ('OPEN','RESPONDED','OVERDUE','CLOSED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "OfficialBusinessResponseStatus" AS ENUM ('SUBMITTED','UNDER_MODERATION','PUBLISHED','REJECTED','WITHDRAWN');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE "ProfileCorrectionRequestStatus" AS ENUM ('SUBMITTED','UNDER_REVIEW','INFORMATION_REQUESTED','ACCEPTED','PARTIALLY_ACCEPTED','REJECTED','APPLIED','WITHDRAWN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE "BusinessAccount" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "displayName" TEXT,
    "slug" TEXT NOT NULL,
    "accountType" "BusinessAccountType" NOT NULL,
    "status" "BusinessAccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "loanAppId" TEXT,
    "nbfcCompanyId" TEXT,
    "profileType" "BusinessProfileType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "officialWebsite" TEXT,
    "supportEmail" TEXT,
    "grievanceEmail" TEXT,
    "supportPhone" TEXT,
    "registeredAddress" TEXT,
    "status" "BusinessProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessMembership" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "BusinessMembershipRole" NOT NULL,
    "status" "BusinessMembershipStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "grantedByUserId" TEXT,
    "invitedEmail" TEXT,
    "invitedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessRegistration" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "submittedByUserId" TEXT NOT NULL,
    "registrationType" "BusinessRegistrationType" NOT NULL,
    "registrationNumber" TEXT,
    "issuingAuthority" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "status" "BusinessRegistrationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessRegistration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfileClaim" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "status" "ProfileClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "claimReason" TEXT,
    "requestedRole" "BusinessMembershipRole",
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProfileClaim_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentRequirement" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "profileId" TEXT,
    "requirementKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "documentType" "VerificationDocumentType" NOT NULL,
    "status" "DocumentRequirementStatus" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "requiredForRole" "BusinessMembershipRole",
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DocumentRequirement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationDocument" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "submittedByUserId" TEXT NOT NULL,
    "claimId" TEXT,
    "registrationId" TEXT,
    "requirementId" TEXT,
    "documentType" "VerificationDocumentType" NOT NULL,
    "status" "VerificationDocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "storageKey" TEXT NOT NULL,
    "maskedFileName" TEXT NOT NULL,
    "originalFileNameHash" TEXT,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT,
    "sensitiveFlags" TEXT[],
    "reviewedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "businessId" TEXT,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "EmailVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "purpose" "EmailVerificationPurpose" NOT NULL DEFAULT 'USER_EMAIL',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DomainVerification" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "verificationMethod" "DomainVerificationMethod" NOT NULL,
    "verificationValueHash" TEXT NOT NULL,
    "status" "DomainVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastCheckedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DomainVerification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessRelationship" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "fromProfileId" TEXT,
    "toProfileId" TEXT,
    "loanAppId" TEXT,
    "nbfcCompanyId" TEXT,
    "relationshipType" "BusinessRelationshipType" NOT NULL,
    "status" "BusinessRelationshipStatus" NOT NULL DEFAULT 'CLAIMED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "sourceUrl" TEXT,
    "confidence" "VerificationConfidence" NOT NULL DEFAULT 'LOW',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessRelationship_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationReview" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "claimId" TEXT,
    "documentId" TEXT,
    "relationshipId" TEXT,
    "assignedToUserId" TEXT,
    "status" "VerificationReviewStatus" NOT NULL DEFAULT 'QUEUED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "priority" "VerificationReviewPriority" NOT NULL DEFAULT 'NORMAL',
    "reviewNotes" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationDecision" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "reviewerUserId" TEXT NOT NULL,
    "outcome" "VerificationDecisionOutcome" NOT NULL,
    "status" "VerificationDecisionStatus" NOT NULL DEFAULT 'FINAL',
    "version" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT NOT NULL,
    "internalNotes" TEXT,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InformationRequest" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "claimId" TEXT,
    "reviewId" TEXT,
    "requestedByUserId" TEXT NOT NULL,
    "respondedByUserId" TEXT,
    "status" "InformationRequestStatus" NOT NULL DEFAULT 'OPEN',
    "version" INTEGER NOT NULL DEFAULT 1,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "responseText" TEXT,
    "dueAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InformationRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OfficialBusinessResponse" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT,
    "submittedByUserId" TEXT NOT NULL,
    "publicItemType" TEXT NOT NULL,
    "publicItemId" TEXT NOT NULL,
    "responseBody" TEXT NOT NULL,
    "status" "OfficialBusinessResponseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OfficialBusinessResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfileCorrectionRequest" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "currentValue" TEXT,
    "proposedValue" TEXT,
    "explanation" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "status" "ProfileCorrectionRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "reviewedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProfileCorrectionRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "businessId" TEXT;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "profileId" TEXT;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "businessId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "profileId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX "BusinessAccount_slug_key" ON "BusinessAccount"("slug");
CREATE UNIQUE INDEX "BusinessMembership_businessId_userId_role_key" ON "BusinessMembership"("businessId","userId","role");
CREATE UNIQUE INDEX "DocumentRequirement_businessId_profileId_requirementKey_key" ON "DocumentRequirement"("businessId","profileId","requirementKey");
CREATE UNIQUE INDEX "EmailVerification_tokenHash_key" ON "EmailVerification"("tokenHash");
CREATE UNIQUE INDEX "DomainVerification_businessId_domain_key" ON "DomainVerification"("businessId","domain");

CREATE INDEX "BusinessAccount_status_idx" ON "BusinessAccount"("status");
CREATE INDEX "BusinessAccount_createdByUserId_idx" ON "BusinessAccount"("createdByUserId");
CREATE INDEX "BusinessAccount_accountType_idx" ON "BusinessAccount"("accountType");
CREATE INDEX "BusinessProfile_businessId_idx" ON "BusinessProfile"("businessId");
CREATE INDEX "BusinessProfile_loanAppId_idx" ON "BusinessProfile"("loanAppId");
CREATE INDEX "BusinessProfile_nbfcCompanyId_idx" ON "BusinessProfile"("nbfcCompanyId");
CREATE INDEX "BusinessProfile_status_idx" ON "BusinessProfile"("status");
CREATE INDEX "BusinessProfile_profileType_idx" ON "BusinessProfile"("profileType");
CREATE INDEX "BusinessMembership_businessId_status_idx" ON "BusinessMembership"("businessId","status");
CREATE INDEX "BusinessMembership_userId_status_idx" ON "BusinessMembership"("userId","status");
CREATE INDEX "BusinessMembership_role_idx" ON "BusinessMembership"("role");
CREATE INDEX "BusinessRegistration_businessId_status_idx" ON "BusinessRegistration"("businessId","status");
CREATE INDEX "BusinessRegistration_profileId_status_idx" ON "BusinessRegistration"("profileId","status");
CREATE INDEX "BusinessRegistration_submittedByUserId_idx" ON "BusinessRegistration"("submittedByUserId");
CREATE INDEX "BusinessRegistration_registrationType_registrationNumber_idx" ON "BusinessRegistration"("registrationType","registrationNumber");
CREATE INDEX "ProfileClaim_businessId_status_idx" ON "ProfileClaim"("businessId","status");
CREATE INDEX "ProfileClaim_profileId_status_idx" ON "ProfileClaim"("profileId","status");
CREATE INDEX "ProfileClaim_submittedByUserId_status_idx" ON "ProfileClaim"("submittedByUserId","status");
CREATE INDEX "VerificationDocument_businessId_status_idx" ON "VerificationDocument"("businessId","status");
CREATE INDEX "VerificationDocument_profileId_status_idx" ON "VerificationDocument"("profileId","status");
CREATE INDEX "VerificationDocument_submittedByUserId_idx" ON "VerificationDocument"("submittedByUserId");
CREATE INDEX "VerificationDocument_claimId_idx" ON "VerificationDocument"("claimId");
CREATE INDEX "VerificationDocument_registrationId_idx" ON "VerificationDocument"("registrationId");
CREATE INDEX "VerificationDocument_requirementId_idx" ON "VerificationDocument"("requirementId");
CREATE INDEX "DocumentRequirement_businessId_status_idx" ON "DocumentRequirement"("businessId","status");
CREATE INDEX "DocumentRequirement_profileId_status_idx" ON "DocumentRequirement"("profileId","status");
CREATE INDEX "DocumentRequirement_documentType_idx" ON "DocumentRequirement"("documentType");
CREATE INDEX "EmailVerification_userId_status_idx" ON "EmailVerification"("userId","status");
CREATE INDEX "EmailVerification_businessId_status_idx" ON "EmailVerification"("businessId","status");
CREATE INDEX "EmailVerification_email_status_idx" ON "EmailVerification"("email","status");
CREATE INDEX "DomainVerification_businessId_status_idx" ON "DomainVerification"("businessId","status");
CREATE INDEX "DomainVerification_requestedByUserId_idx" ON "DomainVerification"("requestedByUserId");
CREATE INDEX "BusinessRelationship_businessId_status_idx" ON "BusinessRelationship"("businessId","status");
CREATE INDEX "BusinessRelationship_fromProfileId_idx" ON "BusinessRelationship"("fromProfileId");
CREATE INDEX "BusinessRelationship_toProfileId_idx" ON "BusinessRelationship"("toProfileId");
CREATE INDEX "BusinessRelationship_loanAppId_idx" ON "BusinessRelationship"("loanAppId");
CREATE INDEX "BusinessRelationship_nbfcCompanyId_idx" ON "BusinessRelationship"("nbfcCompanyId");
CREATE INDEX "BusinessRelationship_relationshipType_status_idx" ON "BusinessRelationship"("relationshipType","status");
CREATE INDEX "VerificationReview_businessId_status_idx" ON "VerificationReview"("businessId","status");
CREATE INDEX "VerificationReview_profileId_status_idx" ON "VerificationReview"("profileId","status");
CREATE INDEX "VerificationReview_claimId_idx" ON "VerificationReview"("claimId");
CREATE INDEX "VerificationReview_documentId_idx" ON "VerificationReview"("documentId");
CREATE INDEX "VerificationReview_relationshipId_idx" ON "VerificationReview"("relationshipId");
CREATE INDEX "VerificationReview_assignedToUserId_status_idx" ON "VerificationReview"("assignedToUserId","status");
CREATE INDEX "VerificationDecision_reviewId_idx" ON "VerificationDecision"("reviewId");
CREATE INDEX "VerificationDecision_businessId_outcome_idx" ON "VerificationDecision"("businessId","outcome");
CREATE INDEX "VerificationDecision_profileId_outcome_idx" ON "VerificationDecision"("profileId","outcome");
CREATE INDEX "VerificationDecision_reviewerUserId_idx" ON "VerificationDecision"("reviewerUserId");
CREATE INDEX "InformationRequest_businessId_status_idx" ON "InformationRequest"("businessId","status");
CREATE INDEX "InformationRequest_profileId_status_idx" ON "InformationRequest"("profileId","status");
CREATE INDEX "InformationRequest_claimId_idx" ON "InformationRequest"("claimId");
CREATE INDEX "InformationRequest_reviewId_idx" ON "InformationRequest"("reviewId");
CREATE INDEX "InformationRequest_requestedByUserId_idx" ON "InformationRequest"("requestedByUserId");
CREATE INDEX "InformationRequest_respondedByUserId_idx" ON "InformationRequest"("respondedByUserId");
CREATE INDEX "OfficialBusinessResponse_businessId_status_idx" ON "OfficialBusinessResponse"("businessId","status");
CREATE INDEX "OfficialBusinessResponse_profileId_status_idx" ON "OfficialBusinessResponse"("profileId","status");
CREATE INDEX "OfficialBusinessResponse_submittedByUserId_idx" ON "OfficialBusinessResponse"("submittedByUserId");
CREATE INDEX "OfficialBusinessResponse_publicItemType_publicItemId_idx" ON "OfficialBusinessResponse"("publicItemType","publicItemId");
CREATE INDEX "ProfileCorrectionRequest_businessId_status_idx" ON "ProfileCorrectionRequest"("businessId","status");
CREATE INDEX "ProfileCorrectionRequest_profileId_status_idx" ON "ProfileCorrectionRequest"("profileId","status");
CREATE INDEX "ProfileCorrectionRequest_submittedByUserId_status_idx" ON "ProfileCorrectionRequest"("submittedByUserId","status");
CREATE INDEX "ProfileCorrectionRequest_fieldKey_idx" ON "ProfileCorrectionRequest"("fieldKey");
CREATE INDEX "Notification_businessId_idx" ON "Notification"("businessId");
CREATE INDEX "Notification_profileId_idx" ON "Notification"("profileId");
CREATE INDEX "AuditLog_businessId_idx" ON "AuditLog"("businessId");
CREATE INDEX "AuditLog_profileId_idx" ON "AuditLog"("profileId");

ALTER TABLE "BusinessAccount" ADD CONSTRAINT "BusinessAccount_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_nbfcCompanyId_fkey" FOREIGN KEY ("nbfcCompanyId") REFERENCES "NbfcCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_grantedByUserId_fkey" FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessRegistration" ADD CONSTRAINT "BusinessRegistration_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessRegistration" ADD CONSTRAINT "BusinessRegistration_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessRegistration" ADD CONSTRAINT "BusinessRegistration_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileClaim" ADD CONSTRAINT "ProfileClaim_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileClaim" ADD CONSTRAINT "ProfileClaim_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileClaim" ADD CONSTRAINT "ProfileClaim_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DocumentRequirement" ADD CONSTRAINT "DocumentRequirement_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DocumentRequirement" ADD CONSTRAINT "DocumentRequirement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ProfileClaim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "BusinessRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "DocumentRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DomainVerification" ADD CONSTRAINT "DomainVerification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DomainVerification" ADD CONSTRAINT "DomainVerification_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessRelationship" ADD CONSTRAINT "BusinessRelationship_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessRelationship" ADD CONSTRAINT "BusinessRelationship_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessRelationship" ADD CONSTRAINT "BusinessRelationship_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessRelationship" ADD CONSTRAINT "BusinessRelationship_loanAppId_fkey" FOREIGN KEY ("loanAppId") REFERENCES "LoanApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BusinessRelationship" ADD CONSTRAINT "BusinessRelationship_nbfcCompanyId_fkey" FOREIGN KEY ("nbfcCompanyId") REFERENCES "NbfcCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ProfileClaim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "VerificationDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "BusinessRelationship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDecision" ADD CONSTRAINT "VerificationDecision_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "VerificationReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationDecision" ADD CONSTRAINT "VerificationDecision_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationDecision" ADD CONSTRAINT "VerificationDecision_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDecision" ADD CONSTRAINT "VerificationDecision_reviewerUserId_fkey" FOREIGN KEY ("reviewerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ProfileClaim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "VerificationReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InformationRequest" ADD CONSTRAINT "InformationRequest_respondedByUserId_fkey" FOREIGN KEY ("respondedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OfficialBusinessResponse" ADD CONSTRAINT "OfficialBusinessResponse_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OfficialBusinessResponse" ADD CONSTRAINT "OfficialBusinessResponse_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OfficialBusinessResponse" ADD CONSTRAINT "OfficialBusinessResponse_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileCorrectionRequest" ADD CONSTRAINT "ProfileCorrectionRequest_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileCorrectionRequest" ADD CONSTRAINT "ProfileCorrectionRequest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfileCorrectionRequest" ADD CONSTRAINT "ProfileCorrectionRequest_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BusinessProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
