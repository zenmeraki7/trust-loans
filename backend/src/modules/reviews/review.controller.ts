import type { Request, Response } from "express";
import { toPublicReviewDto, toSubmittedReviewDto } from "./review.dto.js";
import { reviewService } from "./review.service.js";

export const reviewController = {
  async create(req: Request, res: Response) {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(toSubmittedReviewDto(review));
  },

  async getById(req: Request, res: Response) {
    const review = await reviewService.getPublicReview(req.params.id);
    res.json(toPublicReviewDto(review));
  },

  async helpful(req: Request, res: Response) {
    const review = await reviewService.markHelpful(req.params.id);
    res.json({ id: review.id, helpfulCount: review.helpfulCount });
  },
};

