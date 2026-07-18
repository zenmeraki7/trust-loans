import type { Request, Response } from "express";
import { toModerationReviewDetailDto, toModerationReviewListItemDto } from "./adminModeration.dto.js";
import { adminModerationService } from "./adminModeration.service.js";

export const adminModerationController = {
  async listReviews(req: Request, res: Response) {
    const result = await adminModerationService.listReviews(req.query);
    res.json({ ...result, items: result.items.map(toModerationReviewListItemDto) });
  },

  async getReview(req: Request, res: Response) {
    const review = await adminModerationService.getReview(req.params.id);
    res.json(toModerationReviewDetailDto(review));
  },

  async approve(req: Request, res: Response) {
    const review = await adminModerationService.approve({ id: req.params.id, actorId: req.user?.id, ...req.body });
    res.json(toModerationReviewDetailDto(review));
  },

  async reject(req: Request, res: Response) {
    const review = await adminModerationService.reject({ id: req.params.id, actorId: req.user?.id, reason: req.body.reason });
    res.json(toModerationReviewDetailDto(review));
  },

  async requestInfo(req: Request, res: Response) {
    const review = await adminModerationService.requestInfo({ id: req.params.id, actorId: req.user?.id, reason: req.body.reason });
    res.json(toModerationReviewDetailDto(review));
  },

  async redact(req: Request, res: Response) {
    const review = await adminModerationService.redact({
      id: req.params.id,
      actorId: req.user?.id,
      publicBody: req.body.publicBody,
      reason: req.body.reason,
    });
    res.json(toModerationReviewDetailDto(review));
  },
};

