import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import { container } from "../../../container";
import { IProductService } from "../services/IProductService";
import { TYPES } from "../../../types";
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const productRouter = (): Router => {
  const router = Router();
  const productService = container.get<IProductService>(TYPES.IProductService);
  const productController = new ProductController(productService);

  // Public routes
  router.get('/',
      (req, res) => productController.getProducts(req, res));
  router.get('/:id', (req, res) => productController.getProduct(req, res));
  router.get('/category/:categoryId', (req, res) => productController.getProductsByCategory(req, res));

  router.use(authenticate);
  router.get('/discounted-products/all', (req, res) => productController.findDiscountedProducts(req, res));
  router.get('/discounted-products/find-by-id/:id', (req, res) => productController.findByIdWithDiscount(req, res));
  // Product CRUD routes
  router.post('/', (req,res) => productController.createProduct(req, res));
  
  router.put('/:id', (req,res) => productController.updateProduct(req, res));
  
  router.delete('/:id', 
    (req,res) => productController.deleteProduct(req, res)
  );

  // Variant routes
  router.post('/:id/variants',
    authorize(['admin']),
    (req, res) => productController.addVariant(req, res)
  );

  router.put('/:id/variants/:variantId',
    authorize(['admin']),
    (req, res) => productController.updateVariant(req, res)
  );

  router.delete('/:id/variants/:variantId',
    authorize(['admin']),
    (req, res) => productController.deleteVariant(req, res)
  );

  // Stock management
  router.patch('/:id/stock',
    authorize(['admin']),
    (req, res) => productController.updateStock(req, res)
  );


  return router;
};

export default productRouter; 