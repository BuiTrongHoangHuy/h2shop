import axiosInstance from './axiosInstance';

export interface Product {
  id: string;
  name: string;
  description: string;
  images: {url:string}[] | null;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  categoryId: string;
  images?: File[];
  variants: {
    sku: string;
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
  }[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  categoryId?: string;
  images?: {url: string}[];
  variants?: {
    sku: string;
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
  }[];
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductListResponse {
  status: string;
  data: {
    products: Product[];
    total: number;
  };
}

export interface ProductResponse {
  status: string;
  data: Product;
}

class ProductApi {
  private baseUrl = '/product';

  // Get all products with pagination and filters
  async getProducts(page = 1, limit = 10, filters?: ProductFilters): Promise<ProductListResponse> {
    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
        ...(filters?.inStock !== undefined && { inStock: filters.inStock.toString() })
      };

      const response = await axiosInstance.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get a single product by ID
  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<ProductListResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create a new product
  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {

      const response = await axiosInstance.post(this.baseUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a product
  async updateProduct(id: string, data: UpdateProductData): Promise<ProductResponse> {
    try {
      const formData = new FormData();

      // Append product data
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.categoryId) formData.append('categoryId', data.categoryId);

      // Append variants as JSON string
      if (data.variants) {
        formData.append('variants', JSON.stringify(data.variants));
      }

      // Append images if any
      /*if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }*/

      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a product
  async deleteProduct(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete multiple products
  async deleteProducts(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map(id => this.deleteProduct(id)));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add a variant to a product
  async addVariant(productId: string, variantData: Omit<ProductVariant, 'id' | 'productId' | 'created_at' | 'updated_at'>): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${productId}/variants`, variantData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a product variant
  async updateVariant(productId: string, variantId: string, variantData: Partial<ProductVariant>): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${productId}/variants/${variantId}`, variantData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a product variant
  async deleteVariant(productId: string, variantId: string): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${productId}/variants/${variantId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update product stock
  async updateStock(productId: string, variantId: string, quantity: number): Promise<ProductResponse> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${productId}/stock`, {
        variantId,
        quantity
      });
      
      return response.data;
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

export const productApi = new ProductApi(); 