import PurchaseOrder, { 
  CreatePurchaseOrderData, 
  PurchaseOrderFilters, 
  PurchaseOrderListResponse, 
  PurchaseOrderResponse 
} from '../entities/PurchaseOrder';

export interface IPurchaseOrderService {
  createPurchaseOrder(data: CreatePurchaseOrderData): Promise<PurchaseOrderResponse>;
  getPurchaseOrderById(id: string): Promise<PurchaseOrderResponse>;
  getPurchaseOrders(
    page?: number,
    limit?: number,
    filters?: PurchaseOrderFilters
  ): Promise<PurchaseOrderListResponse>;
  updatePurchaseOrder(id: string, data: Partial<CreatePurchaseOrderData>): Promise<PurchaseOrderResponse>;
  deletePurchaseOrder(id: string): Promise<void>;
  updatePurchaseOrderStatus(id: string, status: 'Pending' | 'Received' | 'Cancelled'): Promise<PurchaseOrderResponse>;
}
