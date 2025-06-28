import PurchaseOrder, { PurchaseOrderFilters } from '../entities/PurchaseOrder';

export interface IPurchaseOrderRepository {
  create(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;
  findById(id: string): Promise<PurchaseOrder | null>;
  findAll(filters: {
    page?: number;
    limit?: number;
    status?: 'Pending' | 'Received' | 'Cancelled';
    supplierName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ purchaseOrders: PurchaseOrder[]; total: number }>;
  update(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: 'Pending' | 'Received' | 'Cancelled'): Promise<PurchaseOrder>;
}
