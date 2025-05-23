import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import { CartService } from '../services/CartService';
import {ICartService} from "../services/ICartService";
import {TYPES} from "../../../types";


const cartRouter = () => {
    const router = Router();
    const cartService = container.get<ICartService>(TYPES.ICartService);
    const cartController = new CartController(cartService);

    router.use(authenticate);

    router.get('/', (req, res) => cartController.getCart(req, res));
    router.post('/add', (req, res) => cartController.addToCart(req, res));
    router.put('/update', (req, res) => cartController.updateCartItem(req, res));
    router.delete('/remove', (req, res) => cartController.removeCartItem(req, res));
    router.delete('/clear', (req, res) => cartController.clearCart(req, res));

    return router;
}

export default cartRouter;