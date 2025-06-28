import axiosInstance from './axiosInstance';
import { 
  PurchaseOrder, 
  CreatePurchaseOrderData, 
  PurchaseOrderListResponse
} from '@/types';

export const purchaseOrderApi = {
  // Get all purchase orders with pagination
  getPurchaseOrders: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PurchaseOrderListResponse }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await axiosInstance.get(`/purchase-order?${params.toString()}`);
    return response.data;
  },

  // Get a single purchase order by ID
  getPurchaseOrderById: async (id: string): Promise<{ data: PurchaseOrder }> => {
    const response = await axiosInstance.get(`/purchase-order/${id}`);
    return response.data;
  },

  // Create a new purchase order
  createPurchaseOrder: async (data: CreatePurchaseOrderData): Promise<{ data: PurchaseOrder }> => {
    const response = await axiosInstance.post('/purchase-order', data);
    return response.data;
  },

  // Update an existing purchase order
  updatePurchaseOrder: async (id: string, data: Partial<CreatePurchaseOrderData>): Promise<{ data: PurchaseOrder }> => {
    const response = await axiosInstance.put(`/purchase-order/${id}`, data);
    return response.data;
  },

  // Delete a purchase order
  deletePurchaseOrder: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/purchase-order/${id}`);
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (
    id: string, 
    status: 'Pending' | 'Received' | 'Cancelled'
  ): Promise<{ data: PurchaseOrder }> => {
    const response = await axiosInstance.patch(`/purchase-order/${id}/status`, { status });
    return response.data;
  },
}; 