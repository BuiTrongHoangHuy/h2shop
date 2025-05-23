import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IProductService } from '../services/IProductService';
import { IProductController } from './IProductController';
import { AppError } from '../../../utils/AppError';
import { S3Service } from '../../../utils/s3Service';
import { validateCreateProduct, validateUpdateProduct } from '../validators/productValidator';

@injectable()
export class ProductController implements IProductController {
  private s3Service: S3Service;

  constructor(
    @inject(TYPES.IProductService) private readonly productService: IProductService
  ) {
    this.s3Service = new S3Service();
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateCreateProduct(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }

      /*const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError('At least one image is required', 400);
      }

      const imageUrls = await Promise.all(
        files.map(file => this.s3Service.uploadFile(file, 'products'))
      );*/

      const product = await this.productService.createProduct({
        ...value,
      });

      res.status(201).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        categoryId: req.query.categoryId as string,
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        inStock: req.query.inStock ? req.query.inStock === 'true' : undefined
      };

      const result = await this.productService.getProducts(page, limit, filters);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          hint: error
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

} 