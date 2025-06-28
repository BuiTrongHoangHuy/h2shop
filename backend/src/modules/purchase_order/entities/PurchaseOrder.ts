import { Image } from "../../../utils/image";

interface PurchaseOrderProps {
  id?: string | null;
  supplierName?: string;
  totalPrice?: number;
  status?: 'Pending' | 'Received' | 'Cancelled';
  note?: string;
  details?: PurchaseOrderDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePurchaseOrderData {
  supplierName: string;
  totalPrice: number;
  note?: string;
  details?: CreatePurchaseOrderDetailData[];
}

export interface CreatePurchaseOrderDetailData {
  variantId: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrderListResponse {
  purchaseOrders: PurchaseOrderResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PurchaseOrderResponse {
  id: string;
  supplierName: string;
  totalPrice: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  note?: string;
  details: PurchaseOrderDetailResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderDetailResponse {
  id: string;
  purchaseOrderId: string;
  variantId: string;
  variant?: {
    id: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    product?: {
      id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface PurchaseOrderFilters {
  status?: 'Pending' | 'Received' | 'Cancelled';
  supplierName?: string;
  startDate?: Date;
  endDate?: Date;
}

export class PurchaseOrder {
  id: string | null;
  supplierName: string;
  totalPrice: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  note?: string;
  details: PurchaseOrderDetail[];
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    supplierName = '',
    totalPrice = 0,
    status = 'Pending',
    note = '',
    details = [],
    createdAt = new Date(),
    updatedAt = new Date()
  }: PurchaseOrderProps = {}) {
    this.id = id;
    this.supplierName = supplierName;
    this.totalPrice = totalPrice;
    this.status = status;
    this.note = note;
    this.details = details;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate(): boolean {
    if (!this.supplierName || this.supplierName.trim().length === 0) {
      throw new Error('Supplier name is required');
    }

    if (this.totalPrice < 0) {
      throw new Error('Total price cannot be negative');
    }

    if (!['Pending', 'Received', 'Cancelled'].includes(this.status)) {
      throw new Error('Invalid status');
    }

    return true;
  }

  addDetail(detail: PurchaseOrderDetail): void {
    if (detail.purchaseOrderId !== this.id) {
      detail.purchaseOrderId = this.id;
    }
    this.details.push(detail);
    this.updateTotalPrice();
  }

  removeDetail(detailId: string): void {
    this.details = this.details.filter(d => d.id !== detailId);
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    this.totalPrice = this.details.reduce((total, detail) => total + (detail.price * detail.quantity), 0);
    this.updatedAt = new Date();
  }

  updateStatus(status: 'Pending' | 'Received' | 'Cancelled'): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  toResponse(): PurchaseOrderResponse {
    return {
      id: this.id!,
      supplierName: this.supplierName,
      totalPrice: this.totalPrice,
      status: this.status,
      note: this.note,
      details: this.details.map(detail => detail.toResponse()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export interface PurchaseOrderDetailProps {
  id?: string | null;
  purchaseOrderId?: string | null;
  variantId?: string;
  variant?: {
    id: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    product?: {
      id: string;
      name: string;
    };
  };
  quantity?: number;
  price?: number;
  createdAt?: Date;
}

export class PurchaseOrderDetail {
  id: string | null;
  purchaseOrderId: string | null;
  variantId: string;
  variant?: {
    id: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    product?: {
      id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
  createdAt: Date;

  constructor({
    id = null,
    purchaseOrderId = null,
    variantId = '',
    variant,
    quantity = 0,
    price = 0,
    createdAt = new Date()
  }: PurchaseOrderDetailProps = {}) {
    this.id = id;
    this.purchaseOrderId = purchaseOrderId;
    this.variantId = variantId;
    this.variant = variant;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt;
  }

  validate(): boolean {
    if (!this.variantId) {
      throw new Error('Variant ID is required');
    }

    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }

    return true;
  }

  toResponse(): PurchaseOrderDetailResponse {
    return {
      id: this.id!,
      purchaseOrderId: this.purchaseOrderId!,
      variantId: this.variantId,
      variant: this.variant,
      quantity: this.quantity,
      price: this.price,
      createdAt: this.createdAt
    };
  }
}

export default PurchaseOrder;
