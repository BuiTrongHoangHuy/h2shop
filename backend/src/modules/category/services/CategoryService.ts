import { inject } from 'inversify';
import { ICategoryService } from './ICategoryService';
import { ICategoryRepository } from '../repositories/ICategoryRepository';
import Category, { CreateCategoryData, CategoryResponse, CategoryListResponse, CategoryFilters } from '../entities/Category';
import { AppError } from '../../../utils/AppError';
import { TYPES } from '../../../types';

export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.ICategoryRepository) private categoryRepository: ICategoryRepository
  ) {}

  async createCategory(data: CreateCategoryData): Promise<CategoryResponse> {
    try {
      if (!data.name) {
        throw new AppError('Category name is required', 400);
      }

      // Check if category with same name exists
      const existingCategory = await this.categoryRepository.findByName(data.name);
      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }

      // If parentId is provided, check if parent category exists
      if (data.parentId) {
        const parentCategory = await this.categoryRepository.findById(data.parentId);
        if (!parentCategory) {
          throw new AppError('Parent category not found', 404);
        }
      }

      const category = new Category({
        name: data.name,
        description: data.description || '',
        parentId: data.parentId || null,
        status: 1,
        image: data.image ? { url: data.image } : null
      });

      const createdCategory = await this.categoryRepository.create(category);
      return createdCategory.toResponse();
    } catch (error) {
      console.error('Error getting categories:', error);

      throw error instanceof AppError ? error : new AppError('Error creating category', 500);
    }
  }




  async getCategoryById(id: number): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
      return category.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting category', 500);
    }
  }

  async getCategories(
    page: number = 1,
    limit: number = 10,
    filters: CategoryFilters = {}
  ): Promise<CategoryListResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const { categories, total } = await this.categoryRepository.findAll({
        page,
        limit,
        filters
      });

      return {
        categories: categories.map(category => category.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new AppError('Error getting categories', 500);
    }
  }


} 