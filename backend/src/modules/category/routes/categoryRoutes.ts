import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { container } from '../../../container';
import {TYPES} from "../../../types";
import {ICategoryService} from "../services/ICategoryService";
import {CategoryController} from "../controllers/CategoryController";
import multer from 'multer';
import path from 'path';


const categoryRouter = () => {
    const router = Router();
    const categoryService = container.get<ICategoryService>(TYPES.ICategoryService);
    const categoryController = new CategoryController(categoryService);

    //router.use(authenticate);

    router.get('/', (req, res) => categoryController.getCategories(req, res));
    router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
    router.get('/:id/children', (req, res) => categoryController.getChildCategories(req, res));
    router.post('/', (req, res) => categoryController.createCategory(req, res));
    router.put('/:id', (req, res) => categoryController.updateCategory(req, res));
    router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));
    router.post('/:id/upload-image', (req, res) => categoryController.uploadCategoryImage(req, res));
    router.delete('/:id/delete-image', (req, res) => categoryController.deleteCategoryImage(req, res));
    return router;
}

export default categoryRouter;