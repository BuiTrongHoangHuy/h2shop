import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import {TYPES} from "../../../types";
import {ICategoryService} from "../services/ICategoryService";
import {CategoryController} from "../controllers/CategoryController";


const categoryRouter = () => {
    const router = Router();
    const cartService = container.get<ICategoryService>(TYPES.ICategoryService);
    const categoryController = new CategoryController(cartService);

    router.use(authenticate);

    router.get('/', (req, res) => categoryController.getCategories(req, res));
    router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
    router.post('/', (req, res) => categoryController.createCategory(req, res));
    return router;
}

export default categoryRouter;