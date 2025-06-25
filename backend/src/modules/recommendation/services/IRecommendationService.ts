import { Recommendation } from '../entities/Recommendation';

export interface IRecommendationService {
  getRecommendationsForUser(userId: string, limit?: number): Promise<Recommendation[]>;
  getPopularProducts(limit?: number): Promise<Recommendation[]>;
  getSimilarProducts(productId: string, limit?: number): Promise<Recommendation[]>;
  getFrequentlyBoughtTogether(productId: string, limit?: number): Promise<Recommendation[]>;
} 