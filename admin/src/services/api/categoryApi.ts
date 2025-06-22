import axiosInstance from './axiosInstance';
import {Category} from "@/types";



export interface CreateCategoryData {
  name: string;
  description: string;
  parentId?: number;
  image?: File;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentId?: number;
  image?: File;
}

// Backend response interfaces
interface BackendCategoryResponse {
  id: string;
  name: string;
  description: string;
  parentId: number | null;
  status: number;
  image: any;
  createdAt: Date;
  updatedAt: Date;
}

interface BackendCategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CategoryApi {
  private baseUrl = '/category';

  // Get all categories
  async getCategories(
      page = 1,
      limit = 10,
      filters?: {
      search?: string;
      parentId?: number | null;
      status?: number;
      }
    ): Promise<BackendCategoryListResponse> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (filters?.search) params.search = filters.search;
      if (filters?.parentId !== undefined) params.parentId = filters.parentId;
      if (filters?.status !== undefined) params.status = filters.status;
      const response = await axiosInstance.get(this.baseUrl, { params });
      return response.data;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get a single category by ID
  async getCategoryById(id: string): Promise<BackendCategoryResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create a new category
  async createCategory(data: CreateCategoryData): Promise<BackendCategoryResponse> {
    try {
      /*const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);

      if (data.parentId) {
        formData.append('parentId', data.parentId.toString());
      }

      if (data.image) {
        formData.append('image', data.image);
      }*/
      const response = await axiosInstance.post(this.baseUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return  response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a category
  async updateCategory(id: string, data: UpdateCategoryData): Promise<BackendCategoryResponse> {
    try {

      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return  response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Network error');
  }
}

export const categoryApi = new CategoryApi(); 