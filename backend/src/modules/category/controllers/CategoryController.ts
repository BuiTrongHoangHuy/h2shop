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

  async updateCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updateData: Partial<CreateCategoryData> = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description !== undefined && { description: req.body.description }),
      ...(req.body.parentId !== undefined && { parentId: parseInt(req.body.parentId) }),
        ...(req.body.image && { image: req.body.image })

    };

    const category = await this.categoryService.updateCategory(id, updateData);
    res.json(category);
  }

  async deleteCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await this.categoryService.deleteCategory(id);
    res.status(204).send();
  }

  async getChildCategories(req: Request, res: Response) {
    const parentId = parseInt(req.params.id);
    const children = await this.categoryService.getChildCategories(parentId);
    res.json(children);
  }

  async uploadCategoryImage(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

   // const imageUrl = await uploadImage(req.file, 'categories');
    //const category = await this.categoryService.updateCategoryImage(id, imageUrl);
   // res.json(category);
  }

  async deleteCategoryImage(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const category = await this.categoryService.deleteCategoryImage(id);
    res.json(category);
  }
} 