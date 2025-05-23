import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import Order, {OrderDetailsDataResponse} from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';
import { IOrderRepository } from './IOrderRepository';
import {ResultSetHeader} from "mysql2";

@injectable()
export class OrderRepository implements IOrderRepository {
  async createOrder(order: Order, details: OrderDetail[]): Promise<Order> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert order
      const [orderResult, _] = await connection.query(
          `INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)`,
          [order.userId, order.totalPrice, order.status || 'Pending']
      );
      const orderId = (orderResult as ResultSetHeader).insertId;

      // Insert order details
      for (const detail of details) {
        await connection.query(
            `INSERT INTO order_details (order_id, variant_id, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, detail.variantId, detail.quantity, detail.price]
        );
      }

      await connection.commit();
      return new Order({ ...order, id: orderId.toString() });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getOrdersByUser(userId: string): Promise<OrderDetailsDataResponse[]> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    const ordersWithDetails = await Promise.all(rows.map(async row => {
      const order = new Order({
        id: row.id.toString(),
        userId: row.user_id.toString(),
        totalPrice: row.total_price,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
      const details = await this.getOrderDetails(order.id!);
      return { order, details };
    }));
    return ordersWithDetails;
  }

  async getOrderById(orderId: string): Promise<OrderDetailsDataResponse | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    const order = new Order({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      totalPrice: row.total_price,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
    const details = await this.getOrderDetails(orderId);
    return { order, details };
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
    );
  }

  async getOrderDetails(orderId: string): Promise<OrderDetail[]> {
    const [rows] = await pool.query<any[]>(
        `SELECT od.*, 
            pv.sku, pv.color, pv.size, pv.price as variantPrice,
            p.id as productId, p.name as productName, p.description as productDescription
     FROM order_details od
     JOIN product_variants pv ON od.variant_id = pv.id
     JOIN products p ON pv.product_id = p.id
     WHERE od.order_id = ?`,
        [orderId]
    );
    return rows.map(row => new OrderDetail({
      id: row.id.toString(),
      orderId: row.order_id.toString(),
      variantId: row.variant_id.toString(),
      quantity: row.quantity,
      price: row.price,
      sku: row.sku,
      color: row.color,
      size: row.size,
      variantPrice: row.variantPrice,
      productId: row.productId?.toString(),
      productName: row.productName,
      productDescription: row.productDescription,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }
}