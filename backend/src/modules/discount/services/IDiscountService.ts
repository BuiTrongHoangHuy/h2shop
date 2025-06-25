import { CreateDiscountData, DiscountResponse, DiscountListResponse, DiscountFilters } from '../entities/Discount';

export interface IDiscountService {
  createDiscount(data: CreateDiscountData): Promise<DiscountResponse>;
  updateDiscount(id: number, data: Partial<CreateDiscountData>): Promise<DiscountResponse>;
  deleteDiscount(id: number): Promise<void>;
  getDiscountById(id: number): Promise<DiscountResponse>;
  getDiscounts(page?: number, limit?: number, filters?: DiscountFilters): Promise<DiscountListResponse>;
  getActiveDiscounts(): Promise<DiscountResponse[]>;
  getDiscountsByProductId(productId: number): Promise<DiscountResponse[]>;
  addProductToDiscount(discountId: number, productId: number): Promise<void>;
  removeProductFromDiscount(discountId: number, productId: number): Promise<void>;
  getProductsForDiscount(discountId: number): Promise<number[]>;
}
