import { CreateCategoryData, CategoryResponse, CategoryListResponse, CategoryFilters } from '../entities/Category';

export interface ICategoryService {
  createCategory(data: CreateCategoryData): Promise<CategoryResponse>;
  updateCategory(id: number, data: Partial<CreateCategoryData>): Promise<CategoryResponse>;
  deleteCategory(id: number): Promise<void>;
  getCategoryById(id: number): Promise<CategoryResponse>;
  getCategories(page?: number, limit?: number, filters?: CategoryFilters): Promise<CategoryListResponse>;
  getChildCategories(parentId: number): Promise<CategoryResponse[]>;
  updateCategoryImage(categoryId: number, imageUrl: string): Promise<CategoryResponse>;
  deleteCategoryImage(categoryId: number): Promise<CategoryResponse>;
} 