import { CreateCategoryData, CategoryResponse, CategoryListResponse, CategoryFilters } from '../entities/Category';

export interface ICategoryService {
  createCategory(data: CreateCategoryData): Promise<CategoryResponse>;
  getCategoryById(id: number): Promise<CategoryResponse>;
  getCategories(page?: number, limit?: number, filters?: CategoryFilters): Promise<CategoryListResponse>;

} 