import { RiskLevel, VerificationStatus } from "@prisma/client";
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
    const privacyTags = ["Data Misuse", "Contact List Abuse", "Photo Morphing"];
    const hiddenChargeTags = ["Hidden Charges", "Payment Not Updated", "Loan Not Closed"];
    const totalPatternPercent = (tags: string[]) =>
      app.complaintSummaries
        .filter((summary) => tags.some((tag) => summary.tag.toLowerCase().includes(tag.toLowerCase())))
        .reduce((sum, summary) => sum + summary.percentage, 0);

    const severePatternPercent = totalPatternPercent(severeTags);
    const privacyPatternPercent = totalPatternPercent(privacyTags);
    const hiddenChargePatternPercent = totalPatternPercent(hiddenChargeTags);
    const verifiedSignal =
      verification.verificationStatus === VerificationStatus.VERIFIED
        ? 100
        : verification.verificationStatus === VerificationStatus.PARTIALLY_VERIFIED
          ? 65
          : 35;

    const components: ScoreComponent[] = [
      {
        key: "averageRating",
        label: "Average review rating",
        score: clamp((averageRating / 5) * 100),
        weight: config.averageRatingWeight,
        explanation: "Based on published and partially published user reviews.",
      },
      {
        key: "reviewVolume",
        label: "Review volume",
        score: clamp(Math.min(reviewCount, 500) / 5),
        weight: config.reviewVolumeWeight,
        explanation: "Higher review volume improves confidence but does not prove safety.",
      },
      {
        key: "recentComplaintTrend",
        label: "Recent complaint trend",
        score: clamp(100 - severePatternPercent),
        weight: config.recentComplaintTrendWeight,
        explanation: "Uses aggregated complaint pattern percentages.",
      },
      {
        key: "complaintSeverity",
        label: "Complaint severity",
        score: clamp(100 - severePatternPercent - privacyPatternPercent / 2),
        weight: config.complaintSeverityWeight,
        explanation: "Higher severe user-reported pattern share reduces this component.",
      },
      {
        key: "verifiedBorrowerSignals",
        label: "Verified borrower signals",
        score: 50,
        weight: config.verifiedBorrowerWeight,
        explanation: "Placeholder score until borrower verification events are implemented.",
      },
      {
        key: "companyResponseActivity",
        label: "Company response activity",
        score: clamp(reviewCount ? (approvedResponses / reviewCount) * 100 : 0),
        weight: config.companyResponseWeight,
        explanation: "Only approved company responses are counted.",
      },
      {
        key: "grievanceAvailability",
        label: "Grievance detail availability",
        score: verification.grievanceAvailable ? 100 : 20,
        weight: config.grievanceAvailabilityWeight,
        explanation: "Checks whether public support or grievance contact details are available.",
      },
      {
        key: "publicDetailVerification",
        label: "Public detail verification",
        score: verifiedSignal,
        weight: config.publicDetailVerificationWeight,
        explanation: "Reflects platform verification status for public details.",
      },
      {
        key: "reviewIntegrity",
        label: "Review integrity",
        score: 85,
        weight: config.reviewIntegrityWeight,
        explanation: "Placeholder score until integrity signals are fully wired.",
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
