import { RegulatoryActionSeverity, RiskLevel, VerificationStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { scoringRepository } from "./scoring.repository.js";
import type { ScoreBreakdown, ScoreComponent, ScoringJobName } from "./scoring.types.js";
import type { RecalculateScoringInput, UpdateScoringConfigInput } from "./scoring.validators.js";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const riskFromScore = (score: number, severePatternPercent: number): RiskLevel => {
  if (severePatternPercent >= 35) return RiskLevel.SEVERE_COMPLAINT_PATTERN;
  if (score >= 75) return RiskLevel.LOW;
  if (score >= 50) return RiskLevel.MEDIUM;
  if (score >= 25) return RiskLevel.HIGH;
  return RiskLevel.UNDER_REVIEW;
};

const hasText = (value?: string | null) => Boolean(value?.trim());

const hasAnyText = (...values: Array<string | null | undefined>) => values.some(hasText);

const totalPatternPercent = (summaries: Array<{ tag: string; percentage: number }>, tags: string[]) =>
  summaries
    .filter((summary) => tags.some((tag) => summary.tag.toLowerCase().includes(tag.toLowerCase())))
    .reduce((sum, summary) => sum + summary.percentage, 0);

const qualityFromComplaintPercent = (percent: number) => clamp(100 - percent * 2);

export const scoringService = {
  getConfig() {
    return scoringRepository.getActiveConfig();
  },

  async updateConfig(input: UpdateScoringConfigInput, actorId?: string) {
    const before = await scoringRepository.getActiveConfig();
    const updated = await scoringRepository.updateActiveConfig(input);
    await auditLog({
      actorId,
      action: "scoring.config.updated",
      targetType: "ScoringConfig",
      targetId: updated.id,
      beforeJson: before,
      afterJson: updated,
      reason: "Admin updated scoring configuration",
    });
    return updated;
  },

  async calculateAppScoreBreakdown(appId: string): Promise<ScoreBreakdown> {
    const [config, app, verification] = await Promise.all([
      scoringRepository.getActiveConfig(),
      scoringRepository.getAppScoreData(appId),
      scoringRepository.getVerificationSignal(appId),
    ]);
    if (!app) throw new AppError("Loan app not found", 404);

    const reviewCount = app.reviews.length;
    const averageRating = reviewCount ? app.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
    const approvedResponses = app.reviews.flatMap((review) => review.companyResponses).filter((response) => response.status === "APPROVED").length;
    const severeTags = ["Harassment", "Threat Calls", "Photo Morphing", "Data Misuse", "Fake Legal Notice"];
    const recoveryTags = ["Harassment", "Threat Calls", "Recovery", "Fake Legal Notice", "Abusive"];
    const privacyTags = ["Data Misuse", "Contact List Abuse", "Photo Morphing", "Privacy"];
    const contactAccessTags = ["Contact List Abuse", "Contact", "Relative", "Office"];
    const hiddenChargeTags = ["Hidden Charges", "Processing Fee", "Payment Not Updated", "Loan Not Closed", "Fee"];
    const harassmentTags = ["Harassment", "Threat Calls", "Abusive", "Repeated Calls"];
    const severePatternPercent = totalPatternPercent(app.complaintSummaries, severeTags);
    const recoveryPatternPercent = totalPatternPercent(app.complaintSummaries, recoveryTags);
    const privacyPatternPercent = totalPatternPercent(app.complaintSummaries, privacyTags);
    const contactAccessPatternPercent = totalPatternPercent(app.complaintSummaries, contactAccessTags);
    const hiddenChargePatternPercent = totalPatternPercent(app.complaintSummaries, hiddenChargeTags);
    const harassmentPatternPercent = totalPatternPercent(app.complaintSummaries, harassmentTags);
    const verifiedSignal =
      verification.verificationStatus === VerificationStatus.VERIFIED
        ? 100
        : verification.verificationStatus === VerificationStatus.PARTIALLY_VERIFIED
          ? 65
          : 35;
    const identityFieldCount = [
      app.legalEntityName,
      app.companyName,
      app.associatedRegulatedEntity ?? app.claimedNbfcPartner,
      app.rbiRegistrationNumber,
      app.rbiRegistrationSourceUrl,
    ].filter(hasText).length;
    const disclosureFieldCount = [app.interestRateRange, app.processingFees, app.latePaymentCharges, app.loanTenure].filter(hasText).length;
    const privacyFieldCount = [app.privacyDisclosure, app.contactAccessDisclosure].filter(hasText).length;
    const hasStore = hasAnyText(app.playStoreUrl, app.appStoreUrl);
    const hasDomain = hasText(app.websiteUrl);
    const domainConsistencyScore = hasStore && hasDomain ? 100 : hasStore || hasDomain ? 65 : 25;
    const regulatoryActionLabels = app.publicWarningLabels.filter((label) => /regulatory|rbi|order|enforcement|ban|blacklist|action/i.test(label));
    const structuredRegulatoryActions = app.regulatoryActions;
    const mostSevereRegulatoryAction = structuredRegulatoryActions.find((action) =>
      action.severity === RegulatoryActionSeverity.CRITICAL || action.severity === RegulatoryActionSeverity.HIGH,
    ) ?? structuredRegulatoryActions[0];
    const confirmedRegulatoryActionScore = mostSevereRegulatoryAction
      ? mostSevereRegulatoryAction.severity === RegulatoryActionSeverity.CRITICAL
        ? 5
        : mostSevereRegulatoryAction.severity === RegulatoryActionSeverity.HIGH
          ? 20
          : mostSevereRegulatoryAction.severity === RegulatoryActionSeverity.MEDIUM
            ? 45
            : 65
      : regulatoryActionLabels.length > 0
        ? 20
        : app.rbiRegistrationVerifiedAt || app.rbiRegistrationNumber
          ? 90
          : 70;

    const components: ScoreComponent[] = [
      {
        key: "regulatoryIdentityClarity",
        label: "Regulatory identity clarity",
        score: clamp((identityFieldCount / 5) * 70 + verifiedSignal * 0.3),
        weight: config.publicDetailVerificationWeight,
        explanation: "Checks legal entity, claimed or associated regulated entity, RBI registration fields, source URL, and verification status.",
      },
      {
        key: "interestFeeTransparency",
        label: "Interest and fee transparency",
        score: clamp((disclosureFieldCount / 4) * 100 - hiddenChargePatternPercent),
        weight: config.averageRatingWeight,
        explanation: "Rewards listed interest range, processing fees, late-payment charges, and loan tenure; hidden-charge complaints reduce this factor.",
      },
      {
        key: "grievanceContactAvailability",
        label: "Availability of grievance contacts",
        score: verification.grievanceAvailable ? 100 : 20,
        weight: config.grievanceAvailabilityWeight,
        explanation: "Checks whether support or grievance email/phone details are available publicly.",
      },
      {
        key: "privacyDisclosureClarity",
        label: "Privacy disclosures",
        score: clamp((privacyFieldCount / 2) * 100 - privacyPatternPercent),
        weight: config.privacyComplaintPenalty,
        explanation: "Rewards privacy and contact-access disclosures; privacy/data misuse complaint patterns reduce this factor.",
      },
      {
        key: "recoveryRelatedComplaints",
        label: "Recovery-related complaints",
        score: qualityFromComplaintPercent(recoveryPatternPercent),
        weight: config.complaintSeverityWeight,
        explanation: "Uses complaint summaries for recovery harassment, threats, abusive recovery, and fake legal notices.",
      },
      {
        key: "contactAccessComplaints",
        label: "Contact-access complaints",
        score: qualityFromComplaintPercent(contactAccessPatternPercent),
        weight: config.privacyComplaintPenalty,
        explanation: "Uses contact-list abuse, relatives, workplace, and contact-access complaint patterns.",
      },
      {
        key: "repeatedHarassmentReports",
        label: "Repeated harassment reports",
        score: qualityFromComplaintPercent(harassmentPatternPercent),
        weight: config.recentComplaintTrendWeight,
        explanation: "Uses repeated harassment, threat-call, abusive-call, and related complaint summaries.",
      },
      {
        key: "appStoreDomainConsistency",
        label: "App-store and domain consistency",
        score: domainConsistencyScore,
        weight: config.reviewIntegrityWeight,
        explanation: "Checks whether official website/domain and app-store links are present together.",
      },
      {
        key: "confirmedRegulatoryActions",
        label: "Confirmed regulatory actions",
        score: confirmedRegulatoryActionScore,
        weight: config.staleVerificationPenalty,
        explanation: mostSevereRegulatoryAction
          ? `${mostSevereRegulatoryAction.authorityName} recorded ${mostSevereRegulatoryAction.actionType.replaceAll("_", " ").toLowerCase()} (${mostSevereRegulatoryAction.severity.toLowerCase()}): ${mostSevereRegulatoryAction.title}.`
          : regulatoryActionLabels.length > 0
          ? `Public warning labels indicate possible regulatory action: ${regulatoryActionLabels.join(", ")}.`
          : "No confirmed regulatory-action warning label is recorded in this profile.",
      },
      {
        key: "complaintResponsiveness",
        label: "Responsiveness to complaints",
        score: reviewCount ? clamp((approvedResponses / reviewCount) * 100) : 50,
        weight: config.companyResponseWeight,
        explanation: "Uses approved public company responses when available; neutral when no complaint-response data exists.",
      },
    ];

    const totalWeight = components.reduce((sum, component) => sum + component.weight, 0) || 1;
    const weightedScore = components.reduce((sum, component) => sum + component.score * component.weight, 0) / totalWeight;
    const penalties = [
      {
        key: "severeComplaintPattern",
        value: severePatternPercent >= 20 ? config.severeComplaintPenalty : 0,
        explanation: "Applied when severe user-reported complaint patterns are elevated.",
      },
      {
        key: "privacyComplaintPattern",
        value: privacyPatternPercent >= 15 ? config.privacyComplaintPenalty : 0,
        explanation: "Applied when data/privacy complaint patterns are elevated.",
      },
      {
        key: "hiddenChargePattern",
        value: hiddenChargePatternPercent >= 20 ? config.hiddenChargeComplaintPenalty : 0,
        explanation: "Applied when hidden charge or payment issue patterns are elevated.",
      },
      {
        key: "verificationStaleOrMissing",
        value: verification.verificationStatus === VerificationStatus.UNDER_VERIFICATION ? config.staleVerificationPenalty : 0,
        explanation: "Applied when public details remain under verification.",
      },
    ].filter((penalty) => penalty.value > 0);

    const trustScore = clamp(weightedScore - penalties.reduce((sum, penalty) => sum + penalty.value, 0));
    const riskLevel = riskFromScore(trustScore, severePatternPercent);

    return {
      appId,
      trustScore,
      riskLevel,
      components,
      complaintPatternPercentages: app.complaintSummaries.map((summary) => ({
        tag: summary.tag,
        percentage: summary.percentage,
        count: summary.count,
      })),
      penalties,
      publicNote:
        "Trust scores and risk labels are awareness indicators based on available public details and user-submitted reviews. They are not legal or regulatory findings.",
      calculatedAt: new Date().toISOString(),
    };
  },

  async recalculateApp(appId: string, actorId?: string, reason?: string) {
    const breakdown = await this.calculateAppScoreBreakdown(appId);
    await scoringRepository.updateAppScore(appId, breakdown.trustScore, breakdown.riskLevel);
    await auditLog({
      actorId,
      action: "score.recalculate.app",
      targetType: "LoanApp",
      targetId: appId,
      afterJson: { trustScore: breakdown.trustScore, riskLevel: breakdown.riskLevel },
      reason,
    });
    return breakdown;
  },

  async runJob(input: RecalculateScoringInput, actorId?: string) {
    const job = input.job as ScoringJobName;
    if (job === "score.recalculate.app") {
      if (!input.appId) throw new AppError("appId is required for app recalculation", 400);
      return { job, result: await this.recalculateApp(input.appId, actorId, input.reason) };
    }

    if (job === "complaint.summary.rebuild") {
      if (!input.appId) throw new AppError("appId is required for complaint summary rebuild", 400);
      await scoringRepository.rebuildComplaintSummary(input.appId);
      return { job, appId: input.appId, status: "completed" };
    }

    if (job === "score.recalculate.all") {
      const appIds = await scoringRepository.listAppIds();
      const results = [];
      for (const appId of appIds) {
        results.push(await this.recalculateApp(appId, actorId, input.reason));
      }
      return { job, count: results.length, results };
    }

    await auditLog({
      actorId,
      action: job,
      targetType: input.entityId ? "Entity" : "System",
      targetId: input.entityId,
      reason: input.reason ?? "Queued scoring job awaiting persistence support for this target type",
    });
    return {
      job,
      status: "queued",
      note: "Worker adapter is ready; entity scoring and risk signal detection can be connected when entity persistence is added.",
    };
  },

  async recalculateLoanAppPublicMetrics(loanAppId: string) {
    const reviews = await scoringRepository.getPublishedReviewStats(loanAppId);
    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10) / 10
      : 0;

    const tagCounts = new Map<string, number>();
    reviews.flatMap((review) => review.tags).forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
    const summaries = Array.from(tagCounts.entries()).map(([tag, count]) => ({
      tag,
      count,
      percentage: reviewCount ? Math.round((count / reviewCount) * 10000) / 100 : 0,
    }));

    const severeTags = ["harassment", "threat", "photo morphing", "data misuse", "fake legal"];
    const severeCount = summaries
      .filter((summary) => severeTags.some((tag) => summary.tag.toLowerCase().includes(tag)))
      .reduce((sum, summary) => sum + summary.count, 0);
    const severeRatio = reviewCount ? severeCount / reviewCount : 0;
    const baseScore = reviewCount ? averageRating * 20 : 0;
    const trustScore = clamp(baseScore - severeRatio * 30);
    const riskLevel = riskFromScore(trustScore, severeRatio * 100);

    await scoringRepository.replaceComplaintSummaries({ loanAppId, summaries });
    await scoringRepository.updateLoanAppMetrics({
      loanAppId,
      averageRating,
      reviewCount,
      trustScore,
      riskLevel,
    });

    return { loanAppId, averageRating, reviewCount, trustScore, riskLevel, summaries };
  },
};
