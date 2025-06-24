import { Review } from '../entities/Review';

export interface ReviewFilters {
  userId?: number;
  productId?: number;
  minRating?: number;
  maxRating?: number;
}

export interface IReviewRepository {
  findAll(options: {
    page: number;
    limit: number;
    filters?: ReviewFilters;
  }): Promise<{ reviews: Review[]; total: number }>;
  
  create(review: Review): Promise<Review>;
  
  update(id: number, data: Partial<Review>): Promise<Review>;
  
  delete(id: number): Promise<void>;
  
  findById(id: number): Promise<Review | null>;
  
  findByUserAndProduct(userId: number, productId: number): Promise<Review | null>;
  
  findByProductId(productId: number): Promise<Review[]>;
  
  findByUserId(userId: number): Promise<Review[]>;
}