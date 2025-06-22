import { Request, Response } from 'express';
import { inject } from 'inversify';
import { ICategoryService } from '../services/ICategoryService';
import { TYPES } from '../../../types';

import { CreateCategoryData } from '../entities/Category';

export class CategoryController {
  constructor(
    @inject(TYPES.ICategoryService) private categoryService: ICategoryService
  ) {}

  async getCategories(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      search: req.query.search as string,
      parentId: req.query.parentId ? parseInt(req.query.parentId as string) : undefined,
      status: req.query.status ? parseInt(req.query.status as string) : undefined
    };

    const categories = await this.categoryService.getCategories(page, limit, filters);
    res.json(categories);
  }

  async getCategoryById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const category = await this.categoryService.getCategoryById(id);
    res.json(category);
  }

  async createCategory(req: Request, res: Response) {
    const categoryData: CreateCategoryData = {
      name: req.body.name,
      description: req.body.description,
      parentId: req.body.parentId ? parseInt(req.body.parentId) : undefined,
      image: req.body.image
    };

    /*if (req.file) {
      const imageUrl = await uploadImage(req.file, 'categories');
      categoryData.image = imageUrl;
    }*/

    const category = await this.categoryService.createCategory(categoryData);
    res.status(201).json(category);
  }

} 