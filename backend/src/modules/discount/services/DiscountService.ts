import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { IDiscountService } from './IDiscountService';
import { IDiscountRepository } from '../repositories/IDiscountRepository';
import Discount, { CreateDiscountData, DiscountResponse, DiscountListResponse, DiscountFilters } from '../entities/Discount';
import { AppError } from '../../../utils/AppError';

export class DiscountService implements IDiscountService {
  constructor(
    @inject(TYPES.IDiscountRepository) private discountRepository: IDiscountRepository
  ) {}

  async createDiscount(data: CreateDiscountData): Promise<DiscountResponse> {
    try {
      if (!data.name) {
        throw new AppError('Discount name is required', 400);
      }

      // Check if discount with same name exists
      const existingDiscount = await this.discountRepository.findByName(data.name);
      if (existingDiscount) {
        throw new AppError('Discount with this name already exists', 400);
      }

      // Validate discount type
      if (!['Percentage', 'Fixed Amount'].includes(data.discountType)) {
        throw new AppError('Invalid discount type', 400);
      }

      // Validate discount value
      if (data.value <= 0) {
        throw new AppError('Discount value must be greater than 0', 400);
      }

      if (data.discountType === 'Percentage' && data.value > 100) {
        throw new AppError('Percentage discount cannot exceed 100%', 400);
      }

      // Validate dates
      if (!data.startDate) {
        throw new AppError('Start date is required', 400);
      }

      if (!data.endDate) {
        throw new AppError('End date is required', 400);
      }

      if (data.startDate > data.endDate) {
        throw new AppError('End date must be after start date', 400);
      }

      const discount = new Discount({
        name: data.name,
        description: data.description || '',
        discountType: data.discountType,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 1
      });

      const createdDiscount = await this.discountRepository.create(discount);

      // Add products to discount if provided
      if (data.productIds && data.productIds.length > 0) {
        for (const productId of data.productIds) {
          await this.discountRepository.addProductToDiscount(createdDiscount.id!, productId);
        }
      }

      return createdDiscount.toResponse();
    } catch (error) {
      console.error('Error creating discount:', error);
      throw error instanceof AppError ? error : new AppError('Error creating discount', 500);
    }
  }

  async updateDiscount(
    id: number,
    data: Partial<CreateDiscountData>
  ): Promise<DiscountResponse> {
    try {
      const existingDiscount = await this.discountRepository.findById(id);
      if (!existingDiscount) {
        throw new AppError('Discount not found', 404);
      }

      // Check if new name is unique
      if (data.name && data.name !== existingDiscount.name) {
        const discountWithSameName = await this.discountRepository.findByName(data.name);
        if (discountWithSameName) {
          throw new AppError('Discount with this name already exists', 400);
        }
      }

      // Validate discount type if provided
      if (data.discountType && !['Percentage', 'Fixed Amount'].includes(data.discountType)) {
        throw new AppError('Invalid discount type', 400);
      }

      // Validate discount value if provided
      if (data.value !== undefined) {
        if (data.value <= 0) {
          throw new AppError('Discount value must be greater than 0', 400);
        }

        if ((data.discountType === 'Percentage' || 
            (data.discountType === undefined && existingDiscount.discountType === 'Percentage')) && 
            data.value > 100) {
          throw new AppError('Percentage discount cannot exceed 100%', 400);
        }
      }

      // Validate dates if provided
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        throw new AppError('End date must be after start date', 400);
      }

      if (data.startDate && !data.endDate && data.startDate > existingDiscount.endDate) {
        throw new AppError('Start date cannot be after existing end date', 400);
      }

      if (data.endDate && !data.startDate && data.endDate < existingDiscount.startDate) {
        throw new AppError('End date cannot be before existing start date', 400);
      }

      const updateData: Partial<Discount> = {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate })
      };

      const updatedDiscount = await this.discountRepository.update(id, updateData);

      // Update product associations if provided
      if (data.productIds) {
        // Get current product IDs
        const currentProductIds = await this.discountRepository.getProductsForDiscount(id);
        // Remove products that are no longer associated
        for (const productId of currentProductIds) {
          if (!data.productIds.includes(productId)) {
            await this.discountRepository.removeProductFromDiscount(id, productId);
          }
        }

        // Add new product associations
        for (const productId of data.productIds) {
          if (!currentProductIds.includes(productId)) {
            await this.discountRepository.addProductToDiscount(id, productId);
          }
        }
      }

      return updatedDiscount.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating discount', 500);
    }
  }

  async deleteDiscount(id: number): Promise<void> {
    try {
      const discount = await this.discountRepository.findById(id);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }

      await this.discountRepository.delete(id);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting discount', 500);
    }
  }

  async getDiscountById(id: number): Promise<DiscountResponse> {
    try {
      const discount = await this.discountRepository.findById(id);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }
      return discount.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting discount', 500);
    }
  }

  async getDiscounts(
    page: number = 1,
    limit: number = 10,
    filters: DiscountFilters = {}
  ): Promise<DiscountListResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const { discounts, total } = await this.discountRepository.findAll({
        page,
        limit,
        filters
      });

      return {
        discounts: discounts.map(discount => discount.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting discounts:', error);
      throw new AppError('Error getting discounts', 500);
    }
  }

  async getActiveDiscounts(): Promise<DiscountResponse[]> {
    try {
      const { discounts } = await this.discountRepository.findAll({
        page: 1,
        limit: 1000,
        filters: { active: true }
      });

      return discounts.map(discount => discount.toResponse());
    } catch (error) {
      throw new AppError('Error getting active discounts', 500);
    }
  }

  async getDiscountsByProductId(productId: number): Promise<DiscountResponse[]> {
    try {
      const discounts = await this.discountRepository.findByProductId(productId);
      return discounts.map(discount => discount.toResponse());
    } catch (error) {
      throw new AppError('Error getting discounts by product ID', 500);
    }
  }

  async addProductToDiscount(discountId: number, productId: number): Promise<void> {
    try {
      const discount = await this.discountRepository.findById(discountId);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }

      await this.discountRepository.addProductToDiscount(discountId, productId);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error adding product to discount', 500);
    }
  }

  async removeProductFromDiscount(discountId: number, productId: number): Promise<void> {
    try {
      const discount = await this.discountRepository.findById(discountId);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }

      await this.discountRepository.removeProductFromDiscount(discountId, productId);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error removing product from discount', 500);
    }
  }

  async getProductsForDiscount(discountId: number): Promise<number[]> {
    try {
      const discount = await this.discountRepository.findById(discountId);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }

      return await this.discountRepository.getProductsForDiscount(discountId);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting products for discount', 500);
    }
  }
}
