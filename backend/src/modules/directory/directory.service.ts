import { BusinessAccountStatus, BusinessAccountType, BusinessProfileStatus, Prisma, ProfileStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import type { PublicDirectoryQuery } from "./directory.validators.js";

type DirectoryType = "loan_app" | "nbfc" | "bank" | "digital_lender";

const riskLevelMap: Record<string, "low" | "medium" | "high" | "severe"> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  SEVERE_COMPLAINT_PATTERN: "severe",
  UNDER_REVIEW: "medium",
  INSUFFICIENT_DATA: "medium",
};

const verificationLabel = (value?: string | null) =>
  (value ?? "UNDER_VERIFICATION").toLowerCase().replaceAll("_", " ");

const riskLabel = (value?: string | null) => riskLevelMap[value ?? ""] ?? "medium";

const businessTypeToDirectoryType = (type: BusinessAccountType): DirectoryType => {
  if (type === BusinessAccountType.BANK) return "bank";
  if (type === BusinessAccountType.NBFC) return "nbfc";
  return "digital_lender";
};

const includesSearch = (q?: string) => {
  if (!q) return undefined;
  return { contains: q, mode: Prisma.QueryMode.insensitive };
};

const containsText = (value: string | null | undefined, filter: string | undefined) =>
  !filter || Boolean(value?.toLowerCase().includes(filter.toLowerCase()));

const arrayContainsText = (values: string[] | undefined, filter: string | undefined) =>
  !filter || Boolean(values?.some((value) => value.toLowerCase().includes(filter.toLowerCase())));

const matchesComplaintVolume = (reviewCount: number, query: PublicDirectoryQuery) => {
  if (query.minComplaintVolume !== undefined && reviewCount < query.minComplaintVolume) return false;
  if (query.complaintVolume === "has_complaints") return reviewCount > 0;
  if (query.complaintVolume === "high_volume") return reviewCount >= 100;
  return true;
};

const matchesRegulatoryStatus = (input: { verifiedAt?: Date | null; registrationNumber?: string | null; registrationClaim?: string | null; verificationStatus?: string | null }, status: PublicDirectoryQuery["regulatoryStatus"]) => {
  if (status === "all") return true;
  if (status === "verified") return Boolean(input.verifiedAt || input.registrationNumber || input.verificationStatus === "VERIFIED");
  if (status === "claimed") return Boolean(input.registrationClaim || input.verificationStatus === "PARTIALLY_VERIFIED");
  return !input.verifiedAt && !input.registrationNumber && input.verificationStatus !== "VERIFIED";
};

const matchesStoreAvailability = (input: { playStoreUrl?: string | null; appStoreUrl?: string | null }, availability: PublicDirectoryQuery["appStoreAvailability"]) => {
  if (availability === "any") return true;
  if (availability === "play_store") return Boolean(input.playStoreUrl);
  if (availability === "app_store") return Boolean(input.appStoreUrl);
  if (availability === "both") return Boolean(input.playStoreUrl && input.appStoreUrl);
  return Boolean(input.playStoreUrl || input.appStoreUrl);
};

const matchesSafety = (riskLevel: string | null | undefined, safetyLevel: PublicDirectoryQuery["safetyLevel"]) =>
  safetyLevel === "all" || riskLabel(riskLevel) === safetyLevel;

export const directoryService = {
  async search(query: PublicDirectoryQuery) {
    const pagination = getPagination(query);
    const q = query.q?.trim();
    const includeType = (type: DirectoryType) => query.type === "all" || query.type === type;
    const appWhere: Prisma.LoanAppWhereInput = {
      status: { not: ProfileStatus.ARCHIVED },
      ...(q
        ? {
            OR: [
              { name: includesSearch(q) },
              { legalEntityName: includesSearch(q) },
              { developerName: includesSearch(q) },
              { companyName: includesSearch(q) },
              { claimedNbfcPartner: includesSearch(q) },
              { packageName: includesSearch(q) },
            ],
          }
        : {}),
      ...(query.riskLevel ? { riskLevel: query.riskLevel as never } : {}),
      ...(query.verificationStatus ? { verificationStatus: query.verificationStatus as never } : {}),
      ...(query.legalEntity ? { OR: [{ legalEntityName: includesSearch(query.legalEntity) }, { companyName: includesSearch(query.legalEntity) }] } : {}),
      ...(query.nbfc ? { OR: [{ claimedNbfcPartner: includesSearch(query.nbfc) }, { associatedRegulatedEntity: includesSearch(query.nbfc) }] } : {}),
    };
    const nbfcWhere: Prisma.NbfcCompanyWhereInput = {
      status: { not: ProfileStatus.ARCHIVED },
      ...(q
        ? {
            OR: [
              { name: includesSearch(q) },
              { slug: includesSearch(q) },
              { associatedRegulatedEntity: includesSearch(q) },
              { nbfcRegistrationClaim: includesSearch(q) },
              { officialWebsite: includesSearch(q) },
            ],
          }
        : {}),
      ...(query.riskLevel ? { riskLevel: query.riskLevel as never } : {}),
      ...(query.verificationStatus ? { verificationStatus: query.verificationStatus as never } : {}),
      ...(query.legalEntity ? { name: includesSearch(query.legalEntity) } : {}),
      ...(query.nbfc ? { OR: [{ name: includesSearch(query.nbfc) }, { nbfcRegistrationClaim: includesSearch(query.nbfc) }, { associatedRegulatedEntity: includesSearch(query.nbfc) }] } : {}),
    };
    const businessWhere: Prisma.BusinessAccountWhereInput = {
      status: { notIn: [BusinessAccountStatus.ARCHIVED, BusinessAccountStatus.REVOKED] },
      accountType: { in: [BusinessAccountType.BANK, BusinessAccountType.NBFC, BusinessAccountType.LOAN_APP_OPERATOR] },
      ...(q
        ? {
            OR: [
              { legalName: includesSearch(q) },
              { displayName: includesSearch(q) },
              { slug: includesSearch(q) },
              { profiles: { some: { displayName: includesSearch(q) } } },
            ],
          }
        : {}),
    };

    const [apps, nbfcs, businesses] = await Promise.all([
      includeType("loan_app")
        ? prisma.loanApp.findMany({ where: appWhere, take: 200, orderBy: [{ trustScore: "desc" }, { updatedAt: "desc" }] })
        : Promise.resolve([]),
      includeType("nbfc")
        ? prisma.nbfcCompany.findMany({ where: nbfcWhere, take: 200, orderBy: [{ updatedAt: "desc" }] })
        : Promise.resolve([]),
      query.type === "all" || ["nbfc", "bank", "digital_lender"].includes(query.type)
        ? prisma.businessAccount.findMany({
            where: businessWhere,
            take: 200,
            orderBy: [{ updatedAt: "desc" }],
            include: {
              _count: { select: { profiles: true, memberships: true, verificationReviews: true } },
              profiles: {
                where: { status: { not: BusinessProfileStatus.ARCHIVED } },
                take: 3,
                orderBy: { updatedAt: "desc" },
                include: {
                  loanApp: { select: { slug: true } },
                  nbfcCompany: { select: { slug: true } },
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    const items = [
      ...apps.filter((app) =>
        matchesComplaintVolume(app.reviewCount, query) &&
        matchesRegulatoryStatus({ verifiedAt: app.rbiRegistrationVerifiedAt, registrationNumber: app.rbiRegistrationNumber, registrationClaim: app.claimedNbfcPartner, verificationStatus: app.verificationStatus }, query.regulatoryStatus) &&
        matchesStoreAvailability(app, query.appStoreAvailability) &&
        matchesSafety(app.riskLevel, query.safetyLevel) &&
        containsText(app.interestRateRange, query.interestRate) &&
        containsText(app.processingFees, query.processingFee) &&
        containsText(app.loanTenure, query.loanTenure) &&
        (arrayContainsText(app.knownComplaintCategories, query.complaintCategory) || arrayContainsText(app.publicWarningLabels, query.complaintCategory)) &&
        (containsText(app.recoveryPracticeInfo, query.recoveryConcern) || arrayContainsText(app.knownComplaintCategories, query.recoveryConcern) || arrayContainsText(app.publicWarningLabels, query.recoveryConcern))
      ).map((app) => ({
        id: `loan-app:${app.id}`,
        sourceId: app.id,
        slug: app.slug,
        name: app.name,
        type: "loan_app" as const,
        href: `/loan-apps/${app.slug}`,
        subtitle: [app.developerName, app.companyName].filter(Boolean).join(" • ") || "Loan app profile",
        description: app.claimedNbfcPartner ? `Claimed lending/NBFC partner: ${app.claimedNbfcPartner}` : "Community risk and review profile.",
        legalEntityName: app.legalEntityName,
        associatedRegulatedEntity: app.associatedRegulatedEntity ?? app.claimedNbfcPartner,
        interestRateRange: app.interestRateRange,
        processingFees: app.processingFees,
        loanTenure: app.loanTenure,
        complaintCategories: app.knownComplaintCategories,
        publicWarningLabels: app.publicWarningLabels,
        appStoreAvailability: app.playStoreUrl && app.appStoreUrl ? "both" : app.playStoreUrl ? "play_store" : app.appStoreUrl ? "app_store" : "not_listed",
        logoUrl: app.logoUrl,
        verificationStatus: verificationLabel(app.verificationStatus),
        riskLevel: riskLabel(app.riskLevel),
        trustScore: app.trustScore,
        reviewCount: app.reviewCount,
        linkedAppsCount: 1,
        updatedAt: app.updatedAt,
      })),
      ...nbfcs.filter((nbfc) =>
        matchesRegulatoryStatus({ verifiedAt: nbfc.rbiRegistrationVerifiedAt, registrationNumber: nbfc.rbiRegistrationNumber, registrationClaim: nbfc.nbfcRegistrationClaim, verificationStatus: nbfc.verificationStatus }, query.regulatoryStatus) &&
        matchesStoreAvailability(nbfc, query.appStoreAvailability) &&
        matchesSafety(nbfc.riskLevel, query.safetyLevel) &&
        containsText(nbfc.interestRateRange, query.interestRate) &&
        containsText(nbfc.processingFees, query.processingFee) &&
        containsText(nbfc.loanTenure, query.loanTenure) &&
        (arrayContainsText(nbfc.knownComplaintCategories, query.complaintCategory) || arrayContainsText(nbfc.publicWarningLabels, query.complaintCategory)) &&
        (containsText(nbfc.recoveryPracticeInfo, query.recoveryConcern) || arrayContainsText(nbfc.knownComplaintCategories, query.recoveryConcern) || arrayContainsText(nbfc.publicWarningLabels, query.recoveryConcern))
      ).map((nbfc) => ({
        id: `nbfc:${nbfc.id}`,
        sourceId: nbfc.id,
        slug: nbfc.slug,
        name: nbfc.name,
        type: "nbfc" as const,
        href: `/entities/${nbfc.slug}`,
        subtitle: nbfc.nbfcRegistrationClaim || nbfc.officialWebsite || "NBFC / lender profile",
        description: nbfc.companyDescription || "Public NBFC/company profile linked to loan app records and grievance details.",
        legalEntityName: nbfc.name,
        associatedRegulatedEntity: nbfc.associatedRegulatedEntity ?? nbfc.name,
        interestRateRange: nbfc.interestRateRange,
        processingFees: nbfc.processingFees,
        loanTenure: nbfc.loanTenure,
        complaintCategories: nbfc.knownComplaintCategories,
        publicWarningLabels: nbfc.publicWarningLabels,
        appStoreAvailability: nbfc.playStoreUrl && nbfc.appStoreUrl ? "both" : nbfc.playStoreUrl ? "play_store" : nbfc.appStoreUrl ? "app_store" : "not_listed",
        logoUrl: nbfc.logoUrl,
        verificationStatus: verificationLabel(nbfc.verificationStatus),
        riskLevel: riskLabel(nbfc.riskLevel),
        trustScore: null,
        reviewCount: 0,
        linkedAppsCount: 0,
        updatedAt: nbfc.updatedAt,
      })),
      ...businesses
        .filter((business) => {
          const primaryProfile = business.profiles[0];
          return includeType(businessTypeToDirectoryType(business.accountType)) &&
            containsText(business.legalName, query.legalEntity) &&
            containsText(primaryProfile?.associatedRegulatedEntity, query.nbfc) &&
            matchesRegulatoryStatus({ verifiedAt: primaryProfile?.rbiRegistrationVerifiedAt, registrationNumber: primaryProfile?.rbiRegistrationNumber, verificationStatus: business.status }, query.regulatoryStatus) &&
            matchesStoreAvailability(primaryProfile ?? {}, query.appStoreAvailability) &&
            containsText(primaryProfile?.interestRateRange, query.interestRate) &&
            containsText(primaryProfile?.processingFees, query.processingFee) &&
            containsText(primaryProfile?.loanTenure, query.loanTenure) &&
            (arrayContainsText(primaryProfile?.knownComplaintCategories, query.complaintCategory) || arrayContainsText(primaryProfile?.publicWarningLabels, query.complaintCategory)) &&
            (containsText(primaryProfile?.recoveryPracticeInfo, query.recoveryConcern) || arrayContainsText(primaryProfile?.knownComplaintCategories, query.recoveryConcern) || arrayContainsText(primaryProfile?.publicWarningLabels, query.recoveryConcern));
        })
        .map((business) => {
          const type = businessTypeToDirectoryType(business.accountType);
          const primaryProfile = business.profiles[0];
          const href = primaryProfile?.loanApp?.slug
            ? `/loan-apps/${primaryProfile.loanApp.slug}`
            : primaryProfile?.nbfcCompany?.slug
              ? `/entities/${primaryProfile.nbfcCompany.slug}`
              : `/business/claim?business=${encodeURIComponent(business.slug)}`;
          return {
            id: `business:${business.id}`,
            sourceId: business.id,
            slug: business.slug,
            name: business.displayName || business.legalName,
            type,
            href,
            subtitle: business.accountType.replaceAll("_", " ").toLowerCase(),
            description: primaryProfile?.officialWebsite || "Verified lender/business account record.",
            legalEntityName: business.legalName,
            associatedRegulatedEntity: primaryProfile?.associatedRegulatedEntity,
            interestRateRange: primaryProfile?.interestRateRange,
            processingFees: primaryProfile?.processingFees,
            loanTenure: primaryProfile?.loanTenure,
            complaintCategories: primaryProfile?.knownComplaintCategories ?? [],
            publicWarningLabels: primaryProfile?.publicWarningLabels ?? [],
            appStoreAvailability: primaryProfile?.playStoreUrl && primaryProfile?.appStoreUrl ? "both" : primaryProfile?.playStoreUrl ? "play_store" : primaryProfile?.appStoreUrl ? "app_store" : "not_listed",
            logoUrl: null,
            verificationStatus: business.status.replaceAll("_", " ").toLowerCase(),
            riskLevel: "medium" as const,
            trustScore: null,
            reviewCount: 0,
            linkedAppsCount: business._count.profiles,
            updatedAt: business.updatedAt,
          };
        }),
    ].sort((a, b) => {
      const scoreA = (a.trustScore ?? 50) + a.reviewCount * 0.1 + a.linkedAppsCount * 2;
      const scoreB = (b.trustScore ?? 50) + b.reviewCount * 0.1 + b.linkedAppsCount * 2;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    const start = pagination.skip;
    const pageItems = items.slice(start, start + pagination.take);
    const counts = items.reduce(
      (acc, item) => {
        acc[item.type] += 1;
        return acc;
      },
      { loan_app: 0, nbfc: 0, bank: 0, digital_lender: 0 },
    );

    return {
      ...paginatedResponse(pageItems, items.length, pagination.page, pagination.limit),
      facets: counts,
    };
  },
};
