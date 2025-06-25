import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IRecommendationRepository } from '../repositories/IRecommendationRepository';
import { IRecommendationService } from './IRecommendationService';
import { Recommendation } from '../entities/Recommendation';

@injectable()
export class RecommendationService implements IRecommendationService {
  constructor(
    @inject(TYPES.IRecommendationRepository) private recommendationRepository: IRecommendationRepository
  ) {}

  async getRecommendationsForUser(userId: string, limit: number = 10): Promise<Recommendation[]> {
    return this.recommendationRepository.getRecommendationsForUser(userId, limit);
  }

  async getPopularProducts(limit: number = 10): Promise<Recommendation[]> {
    return this.recommendationRepository.getPopularProducts(limit);
  }

  async getSimilarProducts(productId: string, limit: number = 10): Promise<Recommendation[]> {
    return this.recommendationRepository.getSimilarProducts(productId, limit);
  }

  async getFrequentlyBoughtTogether(productId: string, limit: number = 10): Promise<Recommendation[]> {
    return this.recommendationRepository.getFrequentlyBoughtTogether(productId, limit);
  }
} 