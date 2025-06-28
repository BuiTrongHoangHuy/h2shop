import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IPurchaseOrderRepository } from './IPurchaseOrderRepository';
import PurchaseOrder, { PurchaseOrderDetail } from '../entities/PurchaseOrder';
import { AppError } from '../../../utils/AppError';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface PurchaseOrderRow extends RowDataPacket {
  id: number;
  supplier_name: string;
  total_price: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  note: string;
  created_at: Date;
  updated_at: Date;
}

interface PurchaseOrderDetailRow extends RowDataPacket {
  id: number;
  purchase_order_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

interface VariantRow extends RowDataPacket {
  id: number;
  sku: string;
  color: string;
  size: string;
  price: number;
  product_id: number;
  product_name: string;
}

interface CountResult extends RowDataPacket {
  total: number;
}

@injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
  async create(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [purchaseOrderResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO purchase_orders (supplier_name, total_price, status, note)
           VALUES (?, ?, ?, ?)`,
          [
            purchaseOrder.supplierName,
            purchaseOrder.totalPrice,
            purchaseOrder.status,
            purchaseOrder.note || null
          ]
        );

        const purchaseOrderId = purchaseOrderResult.insertId;

        if (purchaseOrder.details && purchaseOrder.details.length > 0) {
          const detailValues = purchaseOrder.details.map(detail => [
            purchaseOrderId,
            detail.variantId,
            detail.quantity,
            detail.price
          ]);

          await connection.query(
            `INSERT INTO purchase_order_details (purchase_order_id, variant_id, quantity, price)
             VALUES ?`,
            [detailValues]
          );
        }

        await connection.commit();

        // Fetch the created purchase order with its details
        const createdPurchaseOrder = await this.findById(purchaseOrderId.toString());
        if (!createdPurchaseOrder) {
          throw new AppError('Error retrieving created purchase order', 500);
        }
        return createdPurchaseOrder;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw new AppError('Error creating purchase order', 500);
    }
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    try {
      // Get purchase order
      const [purchaseOrders] = await pool.query<PurchaseOrderRow[]>(
        'SELECT * FROM purchase_orders WHERE id = ?',
        [id]
      );

      if (purchaseOrders.length === 0) {
        return null;
      }

      // Get details with variant information
      const [details] = await pool.query<PurchaseOrderDetailRow[]>(
        `SELECT pod.*, pv.sku, pv.color, pv.size, pv.price as variant_price, 
                p.id as product_id, p.name as product_name
         FROM purchase_order_details pod
         LEFT JOIN product_variants pv ON pod.variant_id = pv.id
         LEFT JOIN products p ON pv.product_id = p.id
         WHERE pod.purchase_order_id = ?`,
        [id]
      );

      const purchaseOrderDetails = details.map(detail => new PurchaseOrderDetail({
        id: detail.id.toString(),
        purchaseOrderId: detail.purchase_order_id.toString(),
        variantId: detail.variant_id.toString(),
        variant: {
          id: detail.variant_id.toString(),
          sku: detail.sku,
          color: detail.color,
          size: detail.size,
          price: detail.variant_price,
          product: {
            id: detail.product_id.toString(),
            name: detail.product_name
          }
        },
        quantity: detail.quantity,
        price: detail.price,
        createdAt: detail.created_at
      }));

      return new PurchaseOrder({
        id: purchaseOrders[0].id.toString(),
        supplierName: purchaseOrders[0].supplier_name,
        totalPrice: purchaseOrders[0].total_price,
        status: purchaseOrders[0].status,
        note: purchaseOrders[0].note,
        details: purchaseOrderDetails,
        createdAt: purchaseOrders[0].created_at,
        updatedAt: purchaseOrders[0].updated_at
      });
    } catch (error) {
      console.error('Error finding purchase order:', error);
      throw new AppError('Error finding purchase order', 500);
    }
  }

  async findAll(filters: {
    page?: number;
    limit?: number;
    status?: 'Pending' | 'Received' | 'Cancelled';
    supplierName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ purchaseOrders: PurchaseOrder[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;

      // Build query conditions
      const conditions: string[] = [];
      const params: any[] = [];

      if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }

      if (filters.supplierName) {
        conditions.push('supplier_name LIKE ?');
        params.push(`%${filters.supplierName}%`);
      }

      if (filters.startDate) {
        conditions.push('created_at >= ?');
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        conditions.push('created_at <= ?');
        params.push(filters.endDate);
      }

      const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

      // Get total count
      const [countResult] = await pool.query<CountResult[]>(
        `SELECT COUNT(*) as total FROM purchase_orders ${whereClause}`,
        params
      );

      // Get purchase orders
      const [purchaseOrders] = await pool.query<PurchaseOrderRow[]>(
        `SELECT * FROM purchase_orders ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      // Get details for all purchase orders
      const purchaseOrderIds = purchaseOrders.map(po => po.id);
      const safeIds = purchaseOrderIds.length > 0 ? purchaseOrderIds : [-1];
      const placeholders = safeIds.map(() => '?').join(',');

      const [details] = await pool.query<PurchaseOrderDetailRow[]>(
        `SELECT pod.*, pv.sku, pv.color, pv.size, pv.price as variant_price, 
                p.id as product_id, p.name as product_name
         FROM purchase_order_details pod
         LEFT JOIN product_variants pv ON pod.variant_id = pv.id
         LEFT JOIN products p ON pv.product_id = p.id
         WHERE pod.purchase_order_id IN (${placeholders})`,
        safeIds
      );

      // Map details to purchase orders
      const detailsByPurchaseOrderId = details.reduce<Record<number, PurchaseOrderDetail[]>>((acc, detail) => {
        if (!acc[detail.purchase_order_id]) {
          acc[detail.purchase_order_id] = [];
        }
        acc[detail.purchase_order_id].push(new PurchaseOrderDetail({
          id: detail.id.toString(),
          purchaseOrderId: detail.purchase_order_id.toString(),
          variantId: detail.variant_id.toString(),
          variant: {
            id: detail.variant_id.toString(),
            sku: detail.sku,
            color: detail.color,
            size: detail.size,
            price: detail.variant_price,
            product: {
              id: detail.product_id.toString(),
              name: detail.product_name
            }
          },
          quantity: detail.quantity,
          price: detail.price,
          createdAt: detail.created_at
        }));
        return acc;
      }, {});

      const mappedPurchaseOrders = purchaseOrders.map(po => new PurchaseOrder({
        id: po.id.toString(),
        supplierName: po.supplier_name,
        totalPrice: po.total_price,
        status: po.status,
        note: po.note,
        details: detailsByPurchaseOrderId[po.id] || [],
        createdAt: po.created_at,
        updatedAt: po.updated_at
      }));

      return {
        purchaseOrders: mappedPurchaseOrders,
        total: countResult[0].total
      };
    } catch (error) {
      console.error('Error finding purchase orders:', error);
      throw new AppError('Error finding purchase orders', 500);
    }
  }

  async update(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (data.supplierName !== undefined) {
          updateFields.push('supplier_name = ?');
          updateValues.push(data.supplierName);
        }
        if (data.totalPrice !== undefined) {
          updateFields.push('total_price = ?');
          updateValues.push(data.totalPrice);
        }
        if (data.status !== undefined) {
          updateFields.push('status = ?');
          updateValues.push(data.status);
        }
        if (data.note !== undefined) {
          updateFields.push('note = ?');
          updateValues.push(data.note);
        }

        if (updateFields.length > 0) {
          await connection.query(
            `UPDATE purchase_orders
             SET ${updateFields.join(', ')}
             WHERE id = ?`,
            [...updateValues, id]
          );
        }

        if (data.details) {
          // Delete existing details
          await connection.query(
            'DELETE FROM purchase_order_details WHERE purchase_order_id = ?',
            [id]
          );

          // Insert new details
          if (data.details.length > 0) {
            const detailValues = data.details.map(detail => [
              id,
              detail.variantId,
              detail.quantity,
              detail.price
            ]);

            await connection.query(
              `INSERT INTO purchase_order_details (purchase_order_id, variant_id, quantity, price)
               VALUES ?`,
              [detailValues]
            );
          }
        }

        await connection.commit();

        // Return updated purchase order
        const updatedPurchaseOrder = await this.findById(id);
        if (!updatedPurchaseOrder) {
          throw new AppError('Purchase order not found', 404);
        }

        return updatedPurchaseOrder;
      } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating purchase order', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Delete details first
        await connection.query(
          'DELETE FROM purchase_order_details WHERE purchase_order_id = ?',
          [id]
        );

        // Delete purchase order
        const [result]: any = await connection.query(
          'DELETE FROM purchase_orders WHERE id = ?',
          [id]
        );

        if (result.affectedRows === 0) {
          throw new AppError('Purchase order not found', 404);
        }

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting purchase order', 500);
    }
  }

  async updateStatus(id: string, status: 'Pending' | 'Received' | 'Cancelled'): Promise<PurchaseOrder> {
    try {
      const [result]: any = await pool.query(
        'UPDATE purchase_orders SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new AppError('Purchase order not found', 404);
      }

      const updatedPurchaseOrder = await this.findById(id);
      if (!updatedPurchaseOrder) {
        throw new AppError('Error retrieving updated purchase order', 500);
      }

      return updatedPurchaseOrder;
    } catch (error) {
      console.error('Error updating purchase order status:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating purchase order status', 500);
    }
  }
}
