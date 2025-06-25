import { Router } from 'express';
import { RecommendationController } from '../controllers/RecommendationController';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import { TYPES } from '../../../types';
import { IRecommendationService } from '../services/IRecommendationService';

const recommendationRouter = () => {
  const router = Router();
  const recommendationService = container.get<IRecommendationService>(TYPES.IRecommendationService);
  const recommendationController = new RecommendationController(recommendationService);

  // Get recommendations for authenticated user
  router.get('/user', authenticate, (req, res) => recommendationController.getRecommendationsForUser(req, res));

  // Get popular products (public endpoint)
  router.get('/popular', (req, res) => recommendationController.getPopularProducts(req, res));

  // Get similar products for a specific product (public endpoint)
  router.get('/similar/:productId', (req, res) => recommendationController.getSimilarProducts(req, res));

  // Get frequently bought together products (public endpoint)
  router.get('/frequently-bought/:productId', (req, res) => recommendationController.getFrequentlyBoughtTogether(req, res));

  return router;
};

export default recommendationRouter; 