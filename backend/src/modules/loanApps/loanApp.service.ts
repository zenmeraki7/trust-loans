import { AppError } from "../../utils/AppError.js";
import { auditLog } from "../../utils/auditLogger.js";
import { getPagination, paginatedResponse } from "../../utils/pagination.js";
import { toPublicReviewDto } from "../reviews/review.dto.js";
import { loanAppRepository } from "./loanApp.repository.js";
import type { CreateLoanAppInput, LoanAppSort, SuggestLoanAppInput } from "./loanApp.validators.js";

export const loanAppService = {
  async list(query: unknown) {
    const pagination = getPagination(query);
    const filters = query as { q?: string; riskLevel?: string; verificationStatus?: string; sort?: LoanAppSort };
    const { items, total } = await loanAppRepository.findMany({
      skip: pagination.skip,
      take: pagination.take,
      q: filters.q,
      riskLevel: filters.riskLevel,
      verificationStatus: filters.verificationStatus,
      sort: filters.sort,
    });
    return paginatedResponse(items, total, pagination.page, pagination.limit);
  },

  async getProfile(slugOrId: string) {
    const app = await loanAppRepository.findBySlug(slugOrId) ?? await loanAppRepository.findById(slugOrId);
    if (!app) {
      throw new AppError("Loan app not found", 404);
    }
    return app;
  },

  async suggest(input: SuggestLoanAppInput, actorId?: string) {
    const app = await loanAppRepository.suggestApp(input);
    await auditLog({
      actorId,
      action: "loan_app.suggested",
      targetType: "LoanApp",
      targetId: app.id,
      afterJson: { name: app.name, status: app.status },
      reason: "Public loan app suggestion",
    });
    return app;
  },

  async create(input: CreateLoanAppInput, actorId?: string) {
    const existing = await loanAppRepository.findBySlug(input.slug);
    if (existing) {
      throw new AppError("Loan app slug already exists", 409);
    }
    const app = await loanAppRepository.createApp(input);
    await auditLog({
      actorId,
      action: "loan_app.created",
      targetType: "LoanApp",
      targetId: app.id,
      afterJson: { slug: app.slug, name: app.name, status: app.status },
      reason: "Admin loan app creation",
    });
    return app;
  },

  async getPublicReviews(appId: string, query: unknown) {
    const app = await loanAppRepository.findById(appId);
    if (!app) {
      throw new AppError("Loan app not found", 404);
    }

    const pagination = getPagination(query);
    const [items, total] = await Promise.all([
      loanAppRepository.findPublishedReviewsByAppId({
        appId,
        skip: pagination.skip,
        take: pagination.take,
      }),
      loanAppRepository.countPublishedReviewsByAppId(appId),
    ]);

    return paginatedResponse(items.map(toPublicReviewDto), total, pagination.page, pagination.limit);
  },
};

