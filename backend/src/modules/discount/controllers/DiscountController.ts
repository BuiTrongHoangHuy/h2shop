import { Request, Response } from 'express';
import { inject } from 'inversify';
import { IDiscountService } from '../services/IDiscountService';
import { TYPES } from '../../../types';
import { CreateDiscountData } from '../entities/Discount';

export class DiscountController {
  constructor(
    @inject(TYPES.IDiscountService) private discountService: IDiscountService
  ) {}

  async getDiscounts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      search: req.query.search as string,
      discountType: req.query.discountType as 'Percentage' | 'Fixed Amount' | undefined,
      status: req.query.status ? parseInt(req.query.status as string) : undefined,
      active: req.query.active === 'true'
    };

    const discounts = await this.discountService.getDiscounts(page, limit, filters);
    res.json(discounts);
  }

  async getDiscountById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const discount = await this.discountService.getDiscountById(id);
    res.json(discount);
  }

  async getActiveDiscounts(req: Request, res: Response) {
    const activeDiscounts = await this.discountService.getActiveDiscounts();
    res.json(activeDiscounts);
  }

  async getDiscountsByProductId(req: Request, res: Response) {
    const productId = parseInt(req.params.productId);
    const discounts = await this.discountService.getDiscountsByProductId(productId);
    res.json(discounts);
  }

  async createDiscount(req: Request, res: Response) {
    const discountData: CreateDiscountData = {
      name: req.body.name,
      description: req.body.description,
      discountType: req.body.discountType,
      value: parseFloat(req.body.value),
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      productIds: req.body.productIds ? req.body.productIds.map((id: string) => parseInt(id)) : undefined
    };

    const discount = await this.discountService.createDiscount(discountData);
    res.status(201).json(discount);
  }

  async updateDiscount(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updateData: Partial<CreateDiscountData> = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description !== undefined && { description: req.body.description }),
      ...(req.body.discountType && { discountType: req.body.discountType }),
      ...(req.body.value !== undefined && { value: parseFloat(req.body.value) }),
      ...(req.body.startDate && { startDate: new Date(req.body.startDate) }),
      ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
      ...(req.body.productIds && { productIds: req.body.productIds.map((id: string) => parseInt(id)) })
    };

    const discount = await this.discountService.updateDiscount(id, updateData);
    res.json(discount);
  }

  async deleteDiscount(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await this.discountService.deleteDiscount(id);
    res.status(204).send();
  }

  async addProductToDiscount(req: Request, res: Response) {
    const discountId = parseInt(req.params.id);
    const productId = parseInt(req.body.productId);
    
    await this.discountService.addProductToDiscount(discountId, productId);
    res.status(200).json({ message: 'Product added to discount successfully' });
  }

  async removeProductFromDiscount(req: Request, res: Response) {
    const discountId = parseInt(req.params.id);
    const productId = parseInt(req.params.productId);
    
    await this.discountService.removeProductFromDiscount(discountId, productId);
    res.status(200).json({ message: 'Product removed from discount successfully' });
  }

  async getProductsForDiscount(req: Request, res: Response) {
    const discountId = parseInt(req.params.id);
    const productIds = await this.discountService.getProductsForDiscount(discountId);
    res.json(productIds);
  }
}