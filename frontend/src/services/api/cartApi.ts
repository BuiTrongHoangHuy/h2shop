import axiosInstance from "@/services/api/axiosInstance";
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  variant?: {
    id: string;
    color?: string;
    size?: string;
    price: number;
    discountedPrice?: number;
    stockQuantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      images: { url: string }[];
      discount?: {
        id: string;
        name: string;
        discountType: 'Percentage' | 'Fixed Amount';
        value: number;
        startDate: string;
        endDate: string;
        status: number;
      };
    };
  };
}

export interface CartResponse {
  status: string;
  data: CartItem[];
}

let cartQuantityUpdateCallback: (() => void) | null = null;

export const setCartQuantityUpdateCallback = (callback: () => void) => {
  console.log('🛒 CartApi: Setting cart update callback');
  cartQuantityUpdateCallback = callback;
};

const triggerCartUpdate = () => {
  console.log('🛒 CartApi: Triggering cart update');
  if (cartQuantityUpdateCallback) {
    console.log('🛒 CartApi: Callback exists, calling it');
    setTimeout(() => {
      console.log('🛒 CartApi: Executing callback');
      cartQuantityUpdateCallback?.();
    }, 100);
  } else {
    console.log('🛒 CartApi: No callback registered');
  }
};

const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/cart`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get cart');
      throw error;
    }
  },

  getCartWithDiscount: async (): Promise<CartResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/cart/discounted-cart`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get cart with discount');
      throw error;
    }
  },

  addToCart: async (variantId: string, quantity: number): Promise<{ status: string }> => {
    try {
      const response = await axiosInstance.post(`${API_URL}/cart/add`, {
        variantId,
        quantity
      });
      toast.success(response.data.message || 'Item added to cart successfully');
      triggerCartUpdate();
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    }
  },

  updateCartItem: async (variantId: string, quantity: number): Promise<{ status: string }> => {
    try {
      const response = await axiosInstance.put(`${API_URL}/cart/update`, {
        variantId,
        quantity
      });
      toast.success(response.data.message || 'Cart item updated successfully');
      triggerCartUpdate();
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart item');
      throw error;
    }
  },

  removeCartItem: async (variantId: string): Promise<{ status: string }> => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/cart/remove`, {
        data: { variantId }
      });
      toast.success(response.data.message || 'Item removed from cart successfully');
      triggerCartUpdate();
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
      throw error;
    }
  },

  clearCart: async (): Promise<{ status: string }> => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/cart/clear`);
      toast.success(response.data.message || 'Cart cleared successfully');
      triggerCartUpdate();
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    }
  }
};

export default cartApi; 