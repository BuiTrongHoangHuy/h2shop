import { ReviewResponse } from '../services/IReviewService';

interface IReview {
  id?: number | null;
  userId: number | null;
  productId: number | null;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userImage?: string;
}

class Review implements IReview {
  id?: number | null;
  userId: number | null;
  productId: number | null;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userImage?: string;

  constructor({
    id = null,
    userId = null,
    productId = null,
    rating = 0,
    comment = '',
    createdAt = new Date(),
    updatedAt = new Date(),
    userName,
    userImage,
  }: Partial<IReview>) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userName = userName;
    this.userImage = userImage;
  }

  validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID is required');
    }

    if (!this.productId) {
      throw new Error('Product ID is required');
    }

    if (this.rating < 1 || this.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return true;
  }

  updateComment(newComment: string): string {
    this.comment = newComment;
    this.updatedAt = new Date();
    return this.comment;
  }

  updateRating(newRating: number): number {
    if (newRating < 1 || newRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    this.rating = newRating;
    this.updatedAt = new Date();
    return this.rating;
  }

  toResponse(): {
    id: number;
    userId: number;
    productId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    userName: string | undefined;
    userImage: string | undefined
  } {
    return {
      id: this.id!,
      userId: this.userId!,
      productId: this.productId!,
      rating: this.rating,
      comment: this.comment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userName: this.userName,
      userImage: this.userImage,
    };
  }
}

export { Review, IReview }; 
