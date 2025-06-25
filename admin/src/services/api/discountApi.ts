import axiosInstance from './axiosInstance';
import { Discount } from '@/types';

export interface CreateDiscountData {
  name: string;
  description?: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: string;
  endDate: string;
  productIds?: number[];
}

export interface UpdateDiscountData {
  name?: string;
  description?: string;
  discountType?: 'Percentage' | 'Fixed Amount';
  value?: number;
  startDate?: string;
  endDate?: string;
  status?: number;
  productIds?: number[];
}

export interface DiscountListResponse {
  discounts: Discount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class DiscountApi {
  private baseUrl = '/discount';

  async getDiscounts(page = 1, limit = 10, filters?: { search?: string; status?: number; discountType?: string }): Promise<DiscountListResponse> {
    try {
      const params: Record<string, any> = { page, limit };
      if (filters?.search) params.search = filters.search;
      if (filters?.status !== undefined) params.status = filters.status;
      if (filters?.discountType) params.discountType = filters.discountType;
      const response = await axiosInstance.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDiscount(data: CreateDiscountData): Promise<Discount> {
    try {
      const response = await axiosInstance.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDiscount(id: number, data: UpdateDiscountData): Promise<Discount> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDiscount(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addProductToDiscount(discountId: number, productId: number): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseUrl}/${discountId}/products`, { productId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeProductFromDiscount(discountId: number, productId: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${discountId}/products/${productId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductsForDiscount(discountId: number): Promise<number[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${discountId}/products`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Network error');
  }
}

export const discountApi = new DiscountApi(); 