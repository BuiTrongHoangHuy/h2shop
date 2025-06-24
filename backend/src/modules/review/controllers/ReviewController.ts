import { Request, Response } from 'express';
import { inject } from 'inversify';
import { IReviewService } from '../services/IReviewService';
import { TYPES } from '../../../types';
import { CreateReviewData, UpdateReviewData } from '../services/IReviewService';

export class ReviewController {
  constructor(
    @inject(TYPES.IReviewService) private reviewService: IReviewService
  ) {}

  async getReviews(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      productId: req.query.productId ? parseInt(req.query.productId as string) : undefined,
      minRating: req.query.minRating ? parseInt(req.query.minRating as string) : undefined,
      maxRating: req.query.maxRating ? parseInt(req.query.maxRating as string) : undefined
    };

    const reviews = await this.reviewService.getReviews(page, limit, filters);
    res.json(reviews);
  }

  async getReviewById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const review = await this.reviewService.getReviewById(id);
    res.json(review);
  }

  async getReviewsByProductId(req: Request, res: Response) {
    const productId = parseInt(req.params.productId);
    const reviews = await this.reviewService.getReviewsByProductId(productId);
    res.json(reviews);
  }

  async getReviewsByUserId(req: Request, res: Response) {
    const userId = req.user?.userId;
    const reviews = await this.reviewService.getReviewsByUserId(userId);
    res.json(reviews);
  }

  async createReview(req: Request, res: Response) {
    const reviewData: CreateReviewData = {
      userId : req.user?.userId,
      productId: parseInt(req.body.productId),
      rating: parseInt(req.body.rating),
      comment: req.body.comment
    };

    const review = await this.reviewService.createReview(reviewData);
    res.status(201).json(review);
  }

  async updateReview(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updateData: UpdateReviewData = {
      ...(req.body.rating !== undefined && { rating: parseInt(req.body.rating) }),
      ...(req.body.comment !== undefined && { comment: req.body.comment })
    };

    const review = await this.reviewService.updateReview(id, updateData);
    res.json(review);
  }

  async deleteReview(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await this.reviewService.deleteReview(id);
    res.status(204).send();
  }
}