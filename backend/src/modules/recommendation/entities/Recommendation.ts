interface IRecommendation {
  id?: string | null;
  userId: string | null;
  productId: string | null;
  score: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

class Recommendation implements IRecommendation {
  id?: string | null;
  userId: string | null;
  productId: string | null;
  score: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    userId = null,
    productId = null,
    score = 0,
    reason = '',
    createdAt = new Date(),
    updatedAt = new Date()
  }: Partial<IRecommendation>) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.score = score;
    this.reason = reason;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID is required');
    }
    
    if (!this.productId) {
      throw new Error('Product ID is required');
    }
    
    if (this.score < 0 || this.score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    
    return true;
  }

  updateScore(newScore: number): number {
    if (newScore < 0 || newScore > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    
    this.score = newScore;
    this.updatedAt = new Date();
    return this.score;
  }

  updateReason(newReason: string): string {
    this.reason = newReason;
    this.updatedAt = new Date();
    return this.reason;
  }
}

export { Recommendation, IRecommendation }; 