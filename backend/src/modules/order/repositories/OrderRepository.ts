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


}