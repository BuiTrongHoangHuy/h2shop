import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import { OrderService } from '../services/OrderService';
import { IOrderService } from "../services/IOrderService";
import { TYPES } from "../../../types";


const orderRouter = () => {

    const router = Router();
    const orderService = container.get<IOrderService>(TYPES.IOrderService);
    const orderController = new OrderController(orderService);

    router.get('/all', (req, res) => orderController.getAllOrders(req, res));
    router.get('/all-with-user-and-payment', (req, res) => orderController.getAllOrdersWithUserAndPayment(req, res));
    router.patch('/:id/status', (req, res) => orderController.updateOrderStatus(req, res));

    router.use(authenticate);

    router.post('/create', (req, res) => orderController.createOrder(req, res));
    router.get('/', (req, res) => orderController.getOrders(req, res));
    router.get('/:id', (req, res) => orderController.getOrder(req, res));
    router.get('/user/has-purchased/:productId', (req, res) => orderController.hasUserPurchasedProduct(req, res));

    return router;
}

export default orderRouter;