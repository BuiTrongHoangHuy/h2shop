import { Review } from '../entities/Review';
import { ReviewFilters } from '../repositories/IReviewRepository';

export interface ReviewListResponse {
  reviews: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  userName: string | undefined;
  userImage: string | undefined;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewData {
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface IReviewService {
  getReviews(
    page?: number,
    limit?: number,
    filters?: ReviewFilters
  ): Promise<ReviewListResponse>;

  getReviewById(id: number): Promise<ReviewResponse>;

  getReviewsByProductId(productId: number): Promise<ReviewResponse[]>;

  getReviewsByUserId(userId: number): Promise<ReviewResponse[]>;

  createReview(data: CreateReviewData): Promise<ReviewResponse>;

  updateReview(id: number, data: UpdateReviewData): Promise<ReviewResponse>;

  deleteReview(id: number): Promise<void>;
}