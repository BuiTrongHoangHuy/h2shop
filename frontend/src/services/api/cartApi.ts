import axiosInstance from "@/services/api/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  data: CartItem[];
}

const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get(`${API_URL}/cart`);
    return response.data;
  },

  addToCart: async (variantId: string, quantity: number): Promise<{ status: string }> => {
    const response = await axiosInstance.post(`${API_URL}/cart/add`, {
      variantId,
      quantity
    });
    return response.data;
  },

  updateCartItem: async (variantId: string, quantity: number): Promise<{ status: string }> => {
    const response = await axiosInstance.put(`${API_URL}/cart/update`, {
      variantId,
      quantity
    });
    return response.data;
  },

  removeCartItem: async (variantId: string): Promise<{ status: string }> => {
    const response = await axiosInstance.delete(`${API_URL}/cart/remove`, {
      data: { variantId }
    });
    return response.data;
  },

  clearCart: async (): Promise<{ status: string }> => {
    const response = await axiosInstance.delete(`${API_URL}/cart/clear`);
    return response.data;
  }
};

export default cartApi; 