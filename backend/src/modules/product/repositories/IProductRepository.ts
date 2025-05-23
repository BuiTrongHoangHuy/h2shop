import Product from '../entities/Product';
import { ProductFilters } from '../entities/Product';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(options: {
    page?: number;
    limit?: number;
    filters?: ProductFilters;
  }): Promise<{
    products: Product[];
    total: number;
  }>;
} 