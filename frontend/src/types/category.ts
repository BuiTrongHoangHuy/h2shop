export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  status: number;
  image?: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
} 