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

  async updateCategory(
    id: number,
    data: Partial<CreateCategoryData>
  ): Promise<CategoryResponse> {
    try {
      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new AppError('Category not found', 404);
      }

      // Check if new name is unique
      if (data.name && data.name !== existingCategory.name) {
        const categoryWithSameName = await this.categoryRepository.findByName(data.name);
        if (categoryWithSameName) {
          throw new AppError('Category with this name already exists', 400);
        }
      }

      // Check if new parent exists
      if (data.parentId) {
        const parentCategory = await this.categoryRepository.findById(data.parentId);
        if (!parentCategory) {
          throw new AppError('Parent category not found', 404);
        }
        // Prevent circular reference
        if (data.parentId === id) {
          throw new AppError('Category cannot be its own parent', 400);
        }
      }

      const updateData: Partial<Category> = {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.image && { image: {url:data.image} })
      };

      const updatedCategory = await this.categoryRepository.update(id, updateData);
      return updatedCategory.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating category', 500);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if category has children
      const children = await this.categoryRepository.findChildren(id);
      if (children.length > 0) {
        throw new AppError('Cannot delete category with subcategories', 400);
      }

      // Delete category image if exists
      /*if (category.image?.url) {
        try {
          await deleteImage(category.image.url);
        } catch (err) {
          console.error('Error deleting category image:', err);
        }
      }*/

      await this.categoryRepository.delete(id);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting category', 500);
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

  async getChildCategories(parentId: number): Promise<CategoryResponse[]> {
    try {
      const children = await this.categoryRepository.findChildren(parentId);
      return children.map(child => child.toResponse());
    } catch (error) {
      throw new AppError('Error getting child categories', 500);
    }
  }

  async updateCategoryImage(categoryId: number, imageUrl: string): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Delete old image if exists
      /*if (category.image?.url) {
        try {
          await deleteImage(category.image.url);
        } catch (err) {
          console.error('Error deleting old category image:', err);
        }
      }*/

      const updatedCategory = await this.categoryRepository.update(categoryId, {
        image: { url: imageUrl }
      });

      return updatedCategory.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating category image', 500);
    }
  }

  async deleteCategoryImage(categoryId: number): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      if (!category.image?.url) {
        throw new AppError('Category has no image to delete', 400);
      }

     /* try {
        await deleteImage(category.image.url);
      } catch (err) {
        console.error('Error deleting category image:', err);
      }*/

      const updatedCategory = await this.categoryRepository.update(categoryId, {
        image: null
      });

      return updatedCategory.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting category image', 500);
    }
  }
} 