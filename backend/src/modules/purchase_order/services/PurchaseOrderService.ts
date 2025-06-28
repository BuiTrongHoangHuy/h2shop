import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { IPurchaseOrderService } from './IPurchaseOrderService';
import { IPurchaseOrderRepository } from '../repositories/IPurchaseOrderRepository';
import PurchaseOrder, { 
  CreatePurchaseOrderData, 
  PurchaseOrderDetail,
  PurchaseOrderFilters, 
  PurchaseOrderListResponse, 
  PurchaseOrderResponse 
} from '../entities/PurchaseOrder';
import { AppError } from '../../../utils/AppError';
import {IProductService} from "../../product/services/IProductService";

export class PurchaseOrderService implements IPurchaseOrderService {
  constructor(
    @inject(TYPES.IPurchaseOrderRepository) private purchaseOrderRepository: IPurchaseOrderRepository,
    @inject(TYPES.IProductService) private productService: IProductService

  ) {}

  async createPurchaseOrder(data: CreatePurchaseOrderData): Promise<PurchaseOrderResponse> {
    try {
      if (!data.supplierName || data.supplierName.trim().length === 0) {
        throw new AppError('Supplier name is required', 400);
      }

      if (data.totalPrice < 0) {
        throw new AppError('Total price cannot be negative', 400);
      }

      const purchaseOrder = new PurchaseOrder({
        supplierName: data.supplierName,
        totalPrice: data.totalPrice,
        status: 'Pending',
        note: data.note,
        details: []
      });

      if (data.details && data.details.length > 0) {
        data.details.forEach(detailData => {
          if (!detailData.variantId || detailData.quantity <= 0 || detailData.price < 0) {
            throw new AppError('Invalid detail data', 400);
          }
          purchaseOrder.addDetail(new PurchaseOrderDetail({
            variantId: detailData.variantId,
            quantity: detailData.quantity,
            price: detailData.price
          }));
        });
      }

      const createdPurchaseOrder = await this.purchaseOrderRepository.create(purchaseOrder);
      return createdPurchaseOrder.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error creating purchase order', 500);
    }
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrderResponse> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findById(id);
      if (!purchaseOrder) {
        throw new AppError('Purchase order not found', 404);
      }
      return purchaseOrder.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error getting purchase order', 500);
    }
  }

  async getPurchaseOrders(
    page: number = 1,
    limit: number = 10,
    filters: PurchaseOrderFilters = {}
  ): Promise<PurchaseOrderListResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const { purchaseOrders, total } = await this.purchaseOrderRepository.findAll({
        page,
        limit,
        ...filters
      });

      return {
        purchaseOrders: purchaseOrders.map(purchaseOrder => purchaseOrder.toResponse()),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting purchase orders:', error);
      throw new AppError('Error getting purchase orders', 500);
    }
  }

  async updatePurchaseOrder(id: string, data: Partial<CreatePurchaseOrderData>): Promise<PurchaseOrderResponse> {
    try {
      const existingPurchaseOrder = await this.purchaseOrderRepository.findById(id);
      if (!existingPurchaseOrder) {
        throw new AppError('Purchase order not found', 404);
      }

      // Update purchase order data
      const updateData: Partial<PurchaseOrder> = {
        ...(data.supplierName && { supplierName: data.supplierName }),
        ...(data.note !== undefined && { note: data.note }),
      };

      if (data.details) {
        const details = data.details.map(detailData => {
          if (!detailData.variantId || detailData.quantity <= 0 || detailData.price < 0) {
            throw new AppError('Invalid detail data', 400);
          }
          return new PurchaseOrderDetail({
            variantId: detailData.variantId,
            quantity: detailData.quantity,
            price: detailData.price
          });
        });
        updateData.details = details;
      }

      const updatedPurchaseOrder = await this.purchaseOrderRepository.update(id, updateData);
      return updatedPurchaseOrder.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating purchase order', 500);
    }
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findById(id);
      if (!purchaseOrder) {
        throw new AppError('Purchase order not found', 404);
      }

      // Check if purchase order can be deleted (only if status is Pending)
      if (purchaseOrder.status !== 'Pending') {
        throw new AppError('Only pending purchase orders can be deleted', 400);
      }

      await this.purchaseOrderRepository.delete(id);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error deleting purchase order', 500);
    }
  }

  async updatePurchaseOrderStatus(id: string, status: 'Pending' | 'Received' | 'Cancelled'): Promise<PurchaseOrderResponse> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findById(id);
      if (!purchaseOrder) {
        throw new AppError('Purchase order not found', 404);
      }

      // Validate status transition
      if (purchaseOrder.status === 'Cancelled' && status !== 'Cancelled') {
        throw new AppError('Cancelled purchase orders cannot be updated', 400);
      }

      if (purchaseOrder.status === 'Received' && status === 'Pending') {
        throw new AppError('Received purchase orders cannot be set back to pending', 400);
      }

      if( status === 'Received' && purchaseOrder.status !== 'Received') {
        for (const detail of purchaseOrder.details) {
          await this.productService.updateProductStock(
              detail.variant?.product?.id!,
              detail.variantId,
              detail.quantity
          );
        }
      }
      const updatedPurchaseOrder = await this.purchaseOrderRepository.updateStatus(id, status);
      return updatedPurchaseOrder.toResponse();
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Error updating purchase order status', 500);
    }
  }
}
