export interface Discount {
  id: number;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  startDate: string; // ISO string for frontend
  endDate: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountFilters {
    search?: string;
    discountType?: 'Percentage' | 'Fixed Amount';
    status?: number;
    active?: boolean;
}