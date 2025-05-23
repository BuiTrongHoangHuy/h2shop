import  { CreateProductData, ProductResponse, ProductListResponse, ProductFilters } from '../entities/Product';
import { CreateVariantData } from '../entities/ProductVariant';

export interface IProductService {
  createProduct(data: CreateProductData): Promise<ProductResponse>;
  getProductById(id: string): Promise<ProductResponse>;
  getProducts(page?: number, limit?: number, filters?: ProductFilters): Promise<ProductListResponse>;

}