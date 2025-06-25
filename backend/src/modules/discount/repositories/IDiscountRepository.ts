import Discount from '../entities/Discount';
import { DiscountFilters } from '../entities/Discount';

export interface IDiscountRepository {
  create(discount: Discount): Promise<Discount>;
  update(id: number, data: Partial<Discount>): Promise<Discount>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Discount | null>;
  findByName(name: string): Promise<Discount | null>;
  findAll(options: {
    page: number;
    limit: number;
    filters?: DiscountFilters;
  }): Promise<{ discounts: Discount[]; total: number }>;
  findByProductId(productId: number): Promise<Discount[]>;
  addProductToDiscount(discountId: number, productId: number): Promise<void>;
  removeProductFromDiscount(discountId: number, productId: number): Promise<void>;
  getProductsForDiscount(discountId: number): Promise<number[]>;
}
