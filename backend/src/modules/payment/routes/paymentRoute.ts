import { Router } from 'express';
import { container } from '../../../container';
import { PaymentController } from '../controllers/PaymentController';
import { PaymentService } from '../services/PaymentService';
import { authenticate } from '../../auth/middleware/authenticate';
import { TYPES } from '../../../types';

const paymentRouter = () => {
    const router = Router();
    const paymentService = container.get<PaymentService>(TYPES.IPaymentService);
    const paymentController = new PaymentController(paymentService);

    router.post('/create', authenticate, (req, res) => paymentController.createPaymentUrl(req, res));

    router.get('/order/:orderId', authenticate, (req, res) => paymentController.getPaymentByOrderId(req, res));

    router.get('/vnpay_return', (req, res) => paymentController.handleVNPayReturn(req, res));

    router.get('/vnpay-ipn', (req, res) => paymentController.handleVNPayIPN(req, res));
    return router;
};

export default paymentRouter; 