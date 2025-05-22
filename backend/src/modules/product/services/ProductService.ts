import { IProductService } from './IProductService';
import { IProductRepository } from '../repositories/IProductRepository';
import Product, { CreateProductData, ProductResponse, ProductListResponse, ProductFilters } from '../entities/Product';
import ProductVariant, { CreateVariantData } from '../entities/ProductVariant';
import { AppError } from '../../../utils/AppError';
import {inject} from "inversify";
import {TYPES} from "../../../types";

export class ProductService implements IProductService {
  constructor(@inject(TYPES.IProductRepository) private productRepository: IProductRepository) {}

  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {
      if (!data.name || !data.categoryId || data.price === undefined) {
        throw new AppError('Missing required fields', 400);
      }


      console.log('data:', data);
      const product = new Product({
        name: data.name,
        description: data.description || '',
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock || 0,
        isActive: true
      });

      if (data.variants && data.variants.length > 0) {

        data.variants.forEach(variantData => {
          if (!variantData.sku || !variantData.price || variantData.stockQuantity === undefined) {
            throw new AppError('Missing required variant fields', 400);
          }
          product.addVariant(new ProductVariant({
            sku: variantData.sku,
            color: variantData.color || '',
            size: variantData.size || '',
            price: variantData.price,
            stockQuantity: variantData.stockQuantity,
            isActive: true
          }));
        });
      }

      const createdProduct = await this.productRepository.create(product);
      return createdProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error creating product', 500);
    }
  }


  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      return product.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting product', 500);
    }
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const { products, total } = await this.productRepository.findAll({
        page,
        limit,
        ...filters
      });
      return {
        products: products.map(product => product.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.log('Error finding products:', error);
      throw new AppError('Error getting products', 500);
    }
  }


}