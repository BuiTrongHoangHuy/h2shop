export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  userName: string;
  userImage?: string;
} 