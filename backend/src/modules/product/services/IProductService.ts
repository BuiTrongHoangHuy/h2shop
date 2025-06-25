import  { CreateProductData, ProductResponse, ProductListResponse, ProductFilters } from '../entities/Product';
import { CreateVariantData } from '../entities/ProductVariant';

export interface IProductService {
  createProduct(data: CreateProductData): Promise<ProductResponse>;
  updateProduct(id: string, data: Partial<CreateProductData>, images?: Express.Multer.File[]): Promise<ProductResponse>;
  deleteProduct(id: string): Promise<void>;
  getProductById(id: string): Promise<ProductResponse>;
  getProducts(page?: number, limit?: number, filters?: ProductFilters): Promise<ProductListResponse>;
  getProductsByCategory( categoryId: string, page?: number, limit?: number, filters?: ProductFilters): Promise<ProductListResponse>;
  addProductVariant(productId: string, data: CreateVariantData): Promise<ProductResponse>;
  updateProductVariant(productId: string, variantId: string, data: Partial<CreateVariantData>): Promise<ProductResponse>;
  deleteProductVariant(productId: string, variantId: string): Promise<ProductResponse>;
  updateProductStock(productId: string, variantId: string, quantity: number): Promise<ProductResponse>;
  //addProductImage(productId: string, image: Express.Multer.File): Promise<ProductResponse>;
  //deleteProductImage(productId: string, imageUrl: string): Promise<ProductResponse>;
  findDiscountedProducts( page?: number, limit?: number): Promise<ProductListResponse>;
  findByIdWithDiscount(id: string): Promise<ProductResponse>;

}