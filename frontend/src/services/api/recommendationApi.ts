import axiosInstance from "@/services/api/axiosInstance";
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Recommendation {
  id: string;
  userId: string | null;
  productId: string | null;
  score: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationResponse {
  status: string;
  data: Recommendation[];
}

const recommendationApi = {
  // Get personalized recommendations for authenticated user
  getRecommendationsForUser: async (limit?: number): Promise<RecommendationResponse> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await axiosInstance.get(`${API_URL}/recommendation/user${params}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get recommendations');
      throw error;
    }
  },

  // Get popular products (public endpoint)
  getPopularProducts: async (limit?: number): Promise<RecommendationResponse> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await axiosInstance.get(`${API_URL}/recommendation/popular${params}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get popular products');
      throw error;
    }
  },

  // Get similar products for a specific product (public endpoint)
  getSimilarProducts: async (productId: string, limit?: number): Promise<RecommendationResponse> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await axiosInstance.get(`${API_URL}/recommendation/similar/${productId}${params}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get similar products');
      throw error;
    }
  },

  // Get frequently bought together products (public endpoint)
  getFrequentlyBoughtTogether: async (productId: string, limit?: number): Promise<RecommendationResponse> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await axiosInstance.get(`${API_URL}/recommendation/frequently-bought/${productId}${params}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get frequently bought together products');
      throw error;
    }
  }
};

export default recommendationApi; 