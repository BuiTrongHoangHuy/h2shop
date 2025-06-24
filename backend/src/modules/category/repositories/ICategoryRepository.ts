import Category from '../entities/Category';
import { CategoryFilters } from '../entities/Category';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  update(id: number, data: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(options: {
    page: number;
    limit: number;
    filters?: CategoryFilters;
  }): Promise<{ categories: Category[]; total: number }>;
  findChildren(parentId: number): Promise<Category[]>;
}