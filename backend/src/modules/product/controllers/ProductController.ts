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
      /*const { error, value } = validateCreateProduct(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }*/

      const product = await this.productService.createProduct({
        ...req.body,
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

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const products = await this.productService.getProductsByCategory(categoryId);
      
      res.json({
        status: 'success',
        data: products
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

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      /*const { error, value } = validateUpdateProduct(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }*/
      console.log("davao control",req.body);
      let imageUrls: string[] | undefined;

      const product = await this.productService.updateProduct(id, {
        ...req.body
        /*...(imageUrls && { images: imageUrls })*/
      });

      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Delete images from S3
      //const product = await this.productService.getProductById(id);

      await this.productService.deleteProduct(id);
      res.status(204).send();
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

  async findDiscountedProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.productService.findDiscountedProducts(page, limit);

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

  async findByIdWithDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.findByIdWithDiscount(id);

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
  async addVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.addProductVariant(id, req.body);

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

  async updateVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id, variantId } = req.params;
      const product = await this.productService.updateProductVariant(id, variantId, req.body);

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

  async deleteVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id, variantId } = req.params;
      const product = await this.productService.deleteProductVariant(id, variantId);

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

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id, variantId } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number') {
        throw new AppError('Quantity must be a number', 400);
      }

      const product = await this.productService.updateProductStock(id, variantId, quantity);

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