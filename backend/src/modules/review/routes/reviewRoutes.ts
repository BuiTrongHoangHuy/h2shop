import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import { TYPES } from "../../../types";
import { IReviewService } from "../services/IReviewService";
import { ReviewController } from "../controllers/ReviewController";

const reviewRouter = () => {
    const router = Router();
    const reviewService = container.get<IReviewService>(TYPES.IReviewService);
    const reviewController = new ReviewController(reviewService);

    // Public routes
    router.get('/', (req, res) => reviewController.getReviews(req, res));
    router.get('/:id', (req, res) => reviewController.getReviewById(req, res));
    router.get('/product/:productId', (req, res) => reviewController.getReviewsByProductId(req, res));
    router.get('/user/:userId', (req, res) => reviewController.getReviewsByUserId(req, res));

    // Protected routes
    router.post('/', authenticate, (req, res) => reviewController.createReview(req, res));
    router.put('/:id', authenticate, (req, res) => reviewController.updateReview(req, res));
    router.delete('/:id', authenticate, (req, res) => reviewController.deleteReview(req, res));

    return router;
}

export default reviewRouter;