import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IPurchaseOrderService } from '../services/IPurchaseOrderService';
import { AppError } from '../../../utils/AppError';

@injectable()
export class PurchaseOrderController {
  constructor(
    @inject(TYPES.IPurchaseOrderService) private readonly purchaseOrderService: IPurchaseOrderService
  ) {}

  async createPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrder = await this.purchaseOrderService.createPurchaseOrder(req.body);
      res.status(201).json({
        status: 'success',
        data: purchaseOrder
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async getPurchaseOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status as 'Pending' | 'Received' | 'Cancelled',
        supplierName: req.query.supplierName as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      const result = await this.purchaseOrderService.getPurchaseOrders(page, limit, filters);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async getPurchaseOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const purchaseOrder = await this.purchaseOrderService.getPurchaseOrderById(id);
      
      res.json({
        status: 'success',
        data: purchaseOrder
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const purchaseOrder = await this.purchaseOrderService.updatePurchaseOrder(id, req.body);

      res.json({
        status: 'success',
        data: purchaseOrder
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async deletePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.purchaseOrderService.deletePurchaseOrder(id);
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  async updatePurchaseOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['Pending', 'Received', 'Cancelled'].includes(status)) {
        throw new AppError('Invalid status. Must be Pending, Received, or Cancelled', 400);
      }

      const purchaseOrder = await this.purchaseOrderService.updatePurchaseOrderStatus(id, status);

      res.json({
        status: 'success',
        data: purchaseOrder
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }
}
