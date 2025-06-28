export interface PurchaseOrderDetail {
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

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  totalPrice: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  note?: string;
  details: PurchaseOrderDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePurchaseOrderData {
  supplierName: string;
  totalPrice: number;
  note?: string;
  details: CreatePurchaseOrderDetailData[];
}

export interface CreatePurchaseOrderDetailData {
  variantId: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrderListResponse {
  purchaseOrders: PurchaseOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 