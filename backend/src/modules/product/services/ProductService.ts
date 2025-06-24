import {IProductService} from './IProductService';
import {IProductRepository} from '../repositories/IProductRepository';
import Product, {CreateProductData, ProductFilters, ProductListResponse, ProductResponse} from '../entities/Product';
import ProductVariant, {CreateVariantData} from '../entities/ProductVariant';
import {AppError} from '../../../utils/AppError';
import {inject} from "inversify";
import {TYPES} from "../../../types";

export class ProductService implements IProductService {
  constructor(@inject(TYPES.IProductRepository) private productRepository: IProductRepository) {}

  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {
      if (!data.name || !data.categoryId) {
        throw new AppError('Missing required fields', 400);
      }


      console.log('data:', data);
      const product = new Product({
        name: data.name,
        description: data.description || '',
        categoryId: data.categoryId,
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

  async updateProduct(
    id: string,
    data: Partial<CreateProductData>
  ): Promise<ProductResponse> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      // Update product data
      const updateData: Partial<Product> = {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId && { categoryId: data.categoryId }),
      };
      console.log('data:', data);
      console.log('updatedData:', updateData);
      console.log('existingProduct:', data.variants);
      console.log('existingProduct:', typeof(data.variants));
      console.log('existingProduct:', data.variants?.length);
      if (data.variants) {
        const variants = typeof data.variants === 'string'
            ? JSON.parse(data.variants)
            : data.variants;

        if (Array.isArray(variants) && variants.length > 0) {
          updateData.variants = variants.map(variantData => {
            if (!variantData.sku || !variantData.price || variantData.stockQuantity === undefined) {
              throw new AppError('Missing required variant fields', 400);
            }
            return new ProductVariant({
              id: variantData.id ? variantData.id : null,
              sku: variantData.sku,
              color: variantData.color || '',
              size: variantData.size || '',
              price: +variantData.price,
              stockQuantity: variantData.stockQuantity,
              isActive: true
            });
          });
        }
      }

      const updatedProduct = await this.productRepository.update(id, updateData);
      return updatedProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Internal server error", 500);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      await this.productRepository.delete(id);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting product', 500);
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

  async getProductsByCategory(
      categoryId: string,
      page: number = 1,
      limit: number = 10,
      filters: ProductFilters = {}
  ): Promise<ProductListResponse> {
    try {
      const {products, total} = await this.productRepository.findByCategory(categoryId);
      return {
        products: products.map(product => product.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw new AppError('Error getting products by category', 500);
    }
  }

  async addProductVariant(productId: string, data: CreateVariantData): Promise<ProductResponse> {
    try {
      if (!data.sku || !data.price || data.stockQuantity === undefined) {
        throw new AppError('Missing required variant fields', 400);
      }

      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Check if SKU already exists
      const existingVariant = product.variants.find((v: ProductVariant) => v.sku === data.sku);
      if (existingVariant) {
        throw new AppError('Variant with this SKU already exists', 400);
      }

      const variant = new ProductVariant({
        productId,
        sku: data.sku,
        color: data.color || '',
        size: data.size || '',
        price: data.price,
        stockQuantity: data.stockQuantity,
        isActive: true
      });

      product.addVariant(variant);
      const updatedProduct = await this.productRepository.update(productId, {
        variants: product.variants,
        stock: product.stock
      });
      return updatedProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error adding product variant', 500);
    }
  }

  async updateProductVariant(
    productId: string,
    variantId: string,
    data: Partial<CreateVariantData>
  ): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const variant = product.variants.find((v: ProductVariant) => v.id === variantId);
      if (!variant) {
        throw new AppError('Variant not found', 404);
      }

      // Check if SKU is being changed and already exists
      if (data.sku && data.sku !== variant.sku) {
        const existingVariant = product.variants.find((v: ProductVariant) => v.sku === data.sku);
        if (existingVariant) {
          throw new AppError('Variant with this SKU already exists', 400);
        }
      }

      // Update variant data
      Object.assign(variant, {
        ...(data.sku && { sku: data.sku }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.size !== undefined && { size: data.size }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stockQuantity !== undefined && { stockQuantity: data.stockQuantity })
      });

      product.updateStock();

      const updatedProduct = await this.productRepository.update(productId, {
        variants: product.variants,
        stock: product.stock
      });
      return updatedProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating product variant', 500);
    }
  }

  async deleteProductVariant(productId: string, variantId: string): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const variantExists = product.variants.some((v: ProductVariant) => v.id === variantId);
      if (!variantExists) {
        throw new AppError('Variant not found', 404);
      }

      product.removeVariant(variantId);
      const updatedProduct = await this.productRepository.update(productId, {
        variants: product.variants,
        stock: product.stock
      });
      return updatedProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting product variant', 500);
    }
  }

  async updateProductStock(productId: string, variantId: string, quantity: number): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const variant = product.variants.find((v: ProductVariant) => v.id === variantId);
      if (!variant) {
        throw new AppError('Variant not found', 404);
      }

      if (quantity < 0 && Math.abs(quantity) > variant.stockQuantity) {
        throw new AppError('Insufficient stock', 400);
      }

      variant.stockQuantity += quantity;
      product.updateStock();

      const updatedProduct = await this.productRepository.update(productId, {
        variants: product.variants,
        stock: product.stock
      });
      return updatedProduct.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating product stock', 500);
    }
  }

  /*async addProductImage(productId: string, image: Express.Multer.File): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const imageUrl = await uploadImage(image, 'products');
      product.images.push(imageUrl);

      const updatedProduct = await this.productRepository.update(productId, {
        images: product.images
      });
      return updatedProduct.toResponse();
    } catch (error) {
      // Delete uploaded image if update fails
      if (image) {
        try {
          await deleteImage(image.filename);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
      throw error instanceof AppError ? error : new AppError('Error adding product image', 500);
    }
  }

  async deleteProductImage(productId: string, imageUrl: string): Promise<ProductResponse> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const imageIndex = product.images.indexOf(imageUrl);
      if (imageIndex === -1) {
        throw new AppError('Image not found', 404);
      }

      try {
        await deleteImage(imageUrl);
        product.images.splice(imageIndex, 1);

        const updatedProduct = await this.productRepository.update(productId, {
          images: product.images
        });
        return updatedProduct.toResponse();
      } catch (error) {
        throw new AppError('Error deleting image file', 500);
      }
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting product image', 500);
    }
  }*/
}