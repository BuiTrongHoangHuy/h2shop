import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import { TYPES } from "../../../types";
import { IDiscountService } from "../services/IDiscountService";
import { DiscountController } from "../controllers/DiscountController";

const discountRouter = () => {
    const router = Router();
    const discountService = container.get<IDiscountService>(TYPES.IDiscountService);
    const discountController = new DiscountController(discountService);

    // Public routes
    router.get('/', (req, res) => discountController.getDiscounts(req, res));
    router.get('/active', (req, res) => discountController.getActiveDiscounts(req, res));
    router.get('/:id', (req, res) => discountController.getDiscountById(req, res));
    router.get('/product/:productId', (req, res) => discountController.getDiscountsByProductId(req, res));
    router.get('/:id/products', (req, res) => discountController.getProductsForDiscount(req, res));

    // Protected routes
    router.post('/', authenticate, (req, res) => discountController.createDiscount(req, res));
    router.put('/:id', authenticate, (req, res) => discountController.updateDiscount(req, res));
    router.delete('/:id', authenticate, (req, res) => discountController.deleteDiscount(req, res));
    router.post('/:id/products', authenticate, (req, res) => discountController.addProductToDiscount(req, res));
    router.delete('/:id/products/:productId', authenticate, (req, res) => discountController.removeProductFromDiscount(req, res));

    return router;
}

export default discountRouter;