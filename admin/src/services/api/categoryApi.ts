import axiosInstance from './axiosInstance';
import {TypeImage} from "@/types/typeImage";

export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  status: number;
  image: TypeImage | null;
  created_at: string;
  updated_at: string;
}


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
  categories: BackendCategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CategoryApi {
  private baseUrl = '/category';

  // Get all categories
  async getCategories(): Promise<{ data: Category[] }> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      const backendResponse: BackendCategoryListResponse = response.data;
      return {
        data: backendResponse.categories.map(cat => ({
          id: parseInt(cat.id),
          name: cat.name,
          description: cat.description,
          parent_id: cat.parentId,
          status: cat.status,
          image: cat.image?.url || null,
          created_at: cat.createdAt.toString(),
          updated_at: cat.updatedAt.toString(),
        }))
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get a single category by ID
  async getCategoryById(id: string): Promise<{ data: Category }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      const backendResponse: BackendCategoryResponse = response.data;
      return {
        data: {
          id: parseInt(backendResponse.id),
          name: backendResponse.name,
          description: backendResponse.description,
          parent_id: backendResponse.parentId,
          status: backendResponse.status,
          image: backendResponse.image?.url || null,
          created_at: backendResponse.createdAt.toISOString(),
          updated_at: backendResponse.updatedAt.toISOString(),
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create a new category
  async createCategory(data: CreateCategoryData): Promise<{ data: Category }> {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);
      
      if (data.parentId) {
        formData.append('parentId', data.parentId.toString());
      }

      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await axiosInstance.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const backendResponse: BackendCategoryResponse = response.data;
      return {
        data: {
          id: parseInt(backendResponse.id),
          name: backendResponse.name,
          description: backendResponse.description,
          parent_id: backendResponse.parentId,
          status: backendResponse.status,
          image: backendResponse.image?.url || null,
          created_at: backendResponse.createdAt.toISOString(),
          updated_at: backendResponse.updatedAt.toISOString(),
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a category
  async updateCategory(id: string, data: UpdateCategoryData): Promise<{ data: Category }> {
    try {
      const formData = new FormData();

      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.parentId !== undefined) formData.append('parentId', data.parentId.toString()); // Changed to match backend
      if (data.image) formData.append('image', data.image);

      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const backendResponse: BackendCategoryResponse = response.data;
      return {
        data: {
          id: parseInt(backendResponse.id),
          name: backendResponse.name,
          description: backendResponse.description,
          parent_id: backendResponse.parentId,
          status: backendResponse.status,
          image: backendResponse.image?.url || null,
          created_at: backendResponse.createdAt.toISOString(),
          updated_at: backendResponse.updatedAt.toISOString(),
        }
      };
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