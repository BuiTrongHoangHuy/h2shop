import Category from './Category';
import ProductVariant from './ProductVariant';
import {Image} from "../../../utils/image";

interface ProductProps {
  id?: string | null;
  name?: string;
  description?: string;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
  };
  price?: number;
  stock?: number;
  images?: Image[];
  variants?: ProductVariant[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  images?: string[];
  variants?: CreateProductVariantData[];
}

export interface CreateProductVariantData {
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  stock: number;
  images: Image[];
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

class Product {
  id: string | null;
  name: string;
  description: string;
  categoryId: string | null;
  category?: Category;
  price: number;
  stock: number;
  images: Image[];
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    name = '',
    description = '',
    categoryId = null,
    price = 0,
    stock = 0,
    images = [],
    variants = [],
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }: ProductProps = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.price = price;
    this.stock = stock;
    this.images = images;
    this.variants = variants;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (!this.categoryId) {
      throw new Error('Category ID is required');
    }

    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (this.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return true;
  }

  addVariant(variant: ProductVariant): void {
    if (variant.productId !== this.id) {
      variant.productId = this.id;
    }
    this.variants.push(variant);
    this.updateStock();
  }

  removeVariant(variantId: string): void {
    this.variants = this.variants.filter(v => v.id !== variantId);
    this.updateStock();
  }

  updateStock(): void {
    this.stock = this.variants.reduce((total, variant) => total + variant.stockQuantity, 0);
    this.updatedAt = new Date();
  }

  setCategory(category: Category): void {
    this.category = category;
    this.categoryId = category.id || null;
  }

  toResponse(): ProductResponse {
    return {
      id: this.id!,
      name: this.name,
      description: this.description,
      category: {
        id: this.categoryId!,
        name: this.category?.name || ''
      },
      price: this.price,
      stock: this.stock,
      images: this.images,
      variants: this.variants,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Product; 