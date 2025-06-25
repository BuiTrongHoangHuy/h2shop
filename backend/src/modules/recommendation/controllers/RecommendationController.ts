import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { IRecommendationService } from '../services/IRecommendationService';

export class RecommendationController {
  constructor(
    @inject(TYPES.IRecommendationService) private readonly recommendationService: IRecommendationService
  ) {}

  async getRecommendationsForUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!userId) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User authentication required' 
        });
      }

      const recommendations = await this.recommendationService.getRecommendationsForUser(userId, limit);
      
      res.json({
        status: 'success',
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting recommendations for user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get recommendations'
      });
    }
  }

  async getPopularProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recommendations = await this.recommendationService.getPopularProducts(limit);
      
      res.json({
        status: 'success',
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting popular products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get popular products'
      });
    }
  }

  async getSimilarProducts(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!productId) {
        return res.status(400).json({
          status: 'error',
          message: 'Product ID is required'
        });
      }

      const recommendations = await this.recommendationService.getSimilarProducts(productId, limit);
      
      res.json({
        status: 'success',
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting similar products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get similar products'
      });
    }
  }

  async getFrequentlyBoughtTogether(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!productId) {
        return res.status(400).json({
          status: 'error',
          message: 'Product ID is required'
        });
      }

      const recommendations = await this.recommendationService.getFrequentlyBoughtTogether(productId, limit);
      
      res.json({
        status: 'success',
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting frequently bought together products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get frequently bought together products'
      });
    }
  }
} 