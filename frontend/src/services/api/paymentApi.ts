const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
import axiosInstance from "@/services/api/axiosInstance";

const paymentApi = {
  createPaymentUrl: async (orderId: string, amount: number) => {
    const response = await axiosInstance.post(`${API_URL}/payment/create`, {
      orderId,
      amount
    });
    return response.data;
  },

  getPaymentByOrderId: async (orderId: string) => {
    const response = await axiosInstance.get(`${API_URL}/payment/order/${orderId}`);
    return response.data;
  }
};

export default paymentApi; 