import axios from 'axios';
import axiosInstance from "@/services/api/axiosInstance";

export interface Image{
  url:string
}
// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  images: { url: string }[];
  categoryId?: string;
  variants: {
    id: string;
    color?: string;
    size?: string;
    price: number;
    stockQuantity: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
  originalPrice?: number;
  discount?: number;
  rating?: {
    value: number;
    count: number;
  };
  saleEndsIn?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  images?: string[];
  variants?: {
    sku: string;
    color?: string;
    size?: string;
    price: number;
    stockQuantity: number;
  }[];
}

export interface ProductResponse {
  status: string;
  data: {
    products: Product[];
    total: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ProductApi {
  private baseUrl = `${API_URL}/product`;

  async getProducts(page = 1, limit = 10, filters?: ProductFilters): Promise<ProductResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
        ...(filters?.inStock !== undefined && { inStock: filters.inStock.toString() })
      });

      const response = await axiosInstance.get(`${this.baseUrl}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get a single product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get products by category ID
    async getProductsByCategoryId(categoryId: string, page = 1, limit = 10): Promise<ProductResponse> {
        try {
        const response = await axiosInstance.get(`${this.baseUrl}/category/${categoryId}`, {
            params: { page, limit }
        });
        return response.data;
        } catch (error) {
        throw this.handleError(error);
        }
    }
  // Create a new product
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const formData = new FormData();

      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'variants') {
          formData.append(key, value.toString());
        }
      });

      // Append variants as JSON string
      if (data.variants) {
        formData.append('variants', JSON.stringify(data.variants));
      }

      // Append images if any
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a product
  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
    try {
      const formData = new FormData();

      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'variants' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append variants as JSON string
      if (data.variants) {
        formData.append('variants', JSON.stringify(data.variants));
      }

      // Append images if any
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axios.put(`${this.baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a product
  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add a variant to a product
  async addVariant(productId: string, variantData: Omit<ProductVariant, 'id' | 'isActive'>): Promise<Product> {
    try {
      const response = await axios.post(`${this.baseUrl}/${productId}/variants`, variantData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a product variant
  async updateVariant(productId: string, variantId: string, variantData: Partial<ProductVariant>): Promise<Product> {
    try {
      const response = await axios.put(`${this.baseUrl}/${productId}/variants/${variantId}`, variantData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a product variant
  async deleteVariant(productId: string, variantId: string): Promise<Product> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${productId}/variants/${variantId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update product stock
  async updateStock(productId: string, variantId: string, quantity: number): Promise<Product> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${productId}/stock`, {
        variantId,
        quantity
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}
export const productApi = new ProductApi();