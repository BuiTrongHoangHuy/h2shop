import { Product } from '../../product/entities/Product';
import { Image } from '../../../utils/image';

// Base category properties
interface CategoryProps {
  id?: number | null;
  name?: string;
  description?: string;
  parentId?: number | null;
  status?: number;
  image?: Image | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new category
export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: number;
  image?: string;
}

// Interface for category list response
export interface CategoryListResponse {
  categories: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface for category response
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  status: number;
  image: Image | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilters {
  search?: string;
  parentId?: number;
  status?: number;
}

class Category {
  id: number | null;
  name: string;
  description: string;
  parentId: number | null;
  status: number;
  image: Image | null;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    name = '',
    description = '',
    parentId = null,
    status = 1,
    image = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }: CategoryProps = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.parentId = parentId;
    this.status = status;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (this.status !== undefined && ![0, 1].includes(this.status)) {
      throw new Error('Invalid status value');
    }

    return true;
  }

  toResponse(): CategoryResponse {
    return {
      id: this.id!,
      name: this.name,
      description: this.description,
      parentId: this.parentId,
      status: this.status,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Category; 