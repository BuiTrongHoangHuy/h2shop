import axiosInstance from "@/services/api/axiosInstance";

export interface OrderDetail {
  variantId: string;
  quantity: number;
  price: number;
  productId?: string;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  details: OrderDetail[];
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const orderApi = {
  createOrder: async (totalPrice: number, details: OrderDetail[]) => {
    const response = await axiosInstance.post(`${API_URL}/order/create`, {
      totalPrice,
      details
    });
    return response.data;
  },

  getOrders: async () => {
    const response = await axiosInstance.get(`${API_URL}/order`);
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`${API_URL}/order/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await axiosInstance.patch(`${API_URL}/order/${orderId}/status`, {
      status
    });
    return response.data;
  },

  hasUserPurchasedProduct: async (productId: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/order/user/has-purchased/${productId}`);
      return response.data.hasPurchased;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }
};

export default orderApi; 