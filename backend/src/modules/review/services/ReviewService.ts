import { inject } from 'inversify';
import { IReviewService, ReviewResponse, ReviewListResponse, CreateReviewData, UpdateReviewData } from './IReviewService';
import { IReviewRepository, ReviewFilters } from '../repositories/IReviewRepository';
import { Review } from '../entities/Review';
import { AppError } from '../../../utils/AppError';
import { TYPES } from '../../../types';

export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.IReviewRepository) private reviewRepository: IReviewRepository
  ) {}

  async getReviews(
    page: number = 1,
    limit: number = 10,
    filters: ReviewFilters = {}
  ): Promise<ReviewListResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const { reviews, total } = await this.reviewRepository.findAll({
        page,
        limit,
        filters
      });
      return {
        reviews: reviews.map(review => review.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw new AppError('Error getting reviews', 500);
    }
  }

  async getReviewById(id: number): Promise<ReviewResponse> {
    try {
      const review = await this.reviewRepository.findById(id);
      if (!review) {
        throw new AppError('Review not found', 404);
      }
      return review.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting review', 500);
    }
  }

  async getReviewsByProductId(productId: number): Promise<ReviewResponse[]> {
    try {
      const reviews = await this.reviewRepository.findByProductId(productId);
      console.log(reviews);
      return reviews.map(review => review.toResponse());
    } catch (error) {
      throw new AppError('Error getting reviews by product ID', 500);
    }
  }

  async getReviewsByUserId(userId: number): Promise<ReviewResponse[]> {
    try {
      const reviews = await this.reviewRepository.findByUserId(userId);
      return reviews.map(review => review.toResponse());
    } catch (error) {
      throw new AppError('Error getting reviews by user ID', 500);
    }
  }

  async createReview(data: CreateReviewData): Promise<ReviewResponse> {
    try {
      // Check if user has already reviewed this product
      const existingReview = await this.reviewRepository.findByUserAndProduct(data.userId, data.productId);
      if (existingReview) {
        throw new AppError('User has already reviewed this product', 400);
      }

      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }

      const review = new Review({
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment || '',
      });

      // Validate review
      review.validate();

      const createdReview = await this.reviewRepository.create(review);
      return createdReview.toResponse();
    } catch (error) {

      throw error instanceof AppError ? error : new AppError('Error creating review', 500);
    }
  }

  async updateReview(id: number, data: UpdateReviewData): Promise<ReviewResponse> {
    try {
      const existingReview = await this.reviewRepository.findById(id);
      if (!existingReview) {
        throw new AppError('Review not found', 404);
      }

      // Validate rating if provided
      if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }

      const updateData: Partial<Review> = {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment })
      };

      const updatedReview = await this.reviewRepository.update(id, updateData);
      return updatedReview.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating review', 500);
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      const review = await this.reviewRepository.findById(id);
      if (!review) {
        throw new AppError('Review not found', 404);
      }

      await this.reviewRepository.delete(id);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting review', 500);
    }
  }

}
