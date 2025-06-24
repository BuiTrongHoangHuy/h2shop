import { Review } from '@/types/review';
import axiosInstance from './axiosInstance';

const reviewApi = {
  async getReviewsByProductId(productId: string): Promise<Review[]> {
    const response = await axiosInstance.get<Review[]>(`/review/product/${productId}`);
    return response.data;
  },

  async addReview(productId: string, rating: number, comment: string): Promise<Review> {
    const response = await axiosInstance.post<Review>('/review', { productId, rating, comment });
    return response.data;
  }
};

export default reviewApi; 