import Product from '../entities/Product';
import { ProductFilters } from '../entities/Product';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(options: {
    page?: number;
    limit?: number;
    filters?: ProductFilters;
  }): Promise<{
    products: Product[];
    total: number;
  }>;
  findByCategory(categoryId: string): Promise<{
    products: Product[];
    total: number;
  }>;
  findBySku(sku: string): Promise<Product | null>;
  updateStock(id: string, quantity: number): Promise<Product>;
  findDiscountedProducts(
      page?: number,
      limit?: number
  ): Promise<{
    products: Product[];
    total: number;
  }>;
  findByIdWithDiscount(id: string): Promise<Product | null>;
} 