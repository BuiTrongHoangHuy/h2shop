import axios from 'axios';
import {Image} from "@/types/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Category {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  status: number;
  image?: Image;
  createdAt: string;
  updatedAt: string;
}


export interface CreateCategoryData {
  name: string;
  description: string;
  parentId?: number;
  image?: string;
}

export interface CategoryFilters {
  search?: string;
  parentId?: number;
  status?: number;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}

const categoryApi = {
  getCategories: async (page: number = 1, limit: number = 10, filters?: CategoryFilters): Promise<CategoryResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.parentId && { parentId: filters.parentId.toString() }),
      ...(filters?.status && { status: filters.status.toString() })
    });

    const response = await axios.get(`${API_URL}/category?${params}`);
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await axios.get(`${API_URL}/category/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await axios.post(`${API_URL}/category`, data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await axios.put(`${API_URL}/category/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/category/${id}`);
  },

  getChildCategories: async (parentId: number): Promise<Category[]> => {
    const response = await axios.get(`${API_URL}/category/${parentId}/children`);
    return response.data;
  },

  uploadCategoryImage: async (id: number, imageFile: File): Promise<Category> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${API_URL}/category/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCategoryImage: async (id: number): Promise<Category> => {
    const response = await axios.delete(`${API_URL}/category/${id}/image`);
    return response.data;
  }
};

export default categoryApi; 