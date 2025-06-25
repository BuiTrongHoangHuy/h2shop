import { Product } from '../../product/entities/Product';

// Base discount properties
interface DiscountProps {
  id?: number | null;
  name?: string;
  description?: string;
  discountType?: 'Percentage' | 'Fixed Amount';
  value?: number;
  startDate?: Date;
  endDate?: Date;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new discount
export interface CreateDiscountData {
  name: string;
  description?: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: Date;
  endDate: Date;
  productIds?: number[];
}

// Interface for discount list response
export interface DiscountListResponse {
  discounts: DiscountResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface for discount response
export interface DiscountResponse {
  id: number;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: Date;
  endDate: Date;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountProductResponse {
  id: number;
  name: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: Date;
  endDate: Date;
  status: number;
}

export interface DiscountFilters {
  search?: string;
  discountType?: 'Percentage' | 'Fixed Amount';
  status?: number;
  active?: boolean; // To filter discounts that are currently active
}

class Discount {
  id: number | null;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: Date;
  endDate: Date;
  status: number;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    name = '',
    description = '',
    discountType = 'Percentage',
    value = 0,
    startDate = new Date(),
    endDate = new Date(),
    status = 1,
    createdAt = new Date(),
    updatedAt = new Date()
  }: DiscountProps = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.discountType = discountType;
    this.value = value;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Discount name is required');
    }

    if (!this.discountType) {
      throw new Error('Discount type is required');
    }

    if (this.value <= 0) {
      throw new Error('Discount value must be greater than 0');
    }

    if (this.discountType === 'Percentage' && this.value > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (!this.startDate) {
      throw new Error('Start date is required');
    }

    if (!this.endDate) {
      throw new Error('End date is required');
    }

    if (this.startDate > this.endDate) {
      throw new Error('End date must be after start date');
    }

    if (this.status !== undefined && ![0, 1].includes(this.status)) {
      throw new Error('Invalid status value');
    }

    return true;
  }

  isActive(): boolean {
    const now = new Date();
    return this.status === 1 && this.startDate <= now && this.endDate >= now;
  }

  toResponse(): DiscountResponse {
    return {
      id: this.id!,
      name: this.name,
      description: this.description,
      discountType: this.discountType,
      value: this.value,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Discount;