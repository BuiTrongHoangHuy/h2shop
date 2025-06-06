import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IPaymentRepository, Payment } from './IPaymentRepository';
import { ResultSetHeader } from 'mysql2';

@injectable()
export class PaymentRepository implements IPaymentRepository {
    async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO payments (order_id, user_id, amount, payment_method, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [payment.orderId, payment.userId, payment.amount, payment.paymentMethod, payment.status]
        );

        const [rows] = await pool.query<any[]>(
            'SELECT * FROM payments WHERE id = ?',
            [result.insertId]
        );

        return this.mapToPayment(rows[0]);
    }

    async updatePaymentStatus(id: number, status: 'Pending' | 'Completed' | 'Failed'): Promise<void> {
        await pool.query(
            'UPDATE payments SET status = ? WHERE id = ?',
            [status, id]
        );
    }

    async getPaymentByOrderId(orderId: number): Promise<Payment | null> {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM payments WHERE order_id = ?',
            [orderId]
        );

        if (rows.length === 0) return null;
        return this.mapToPayment(rows[0]);
    }

    private mapToPayment(row: any): Payment {
        return {
            id: row.id,
            orderId: row.order_id,
            userId: row.user_id,
            amount: row.amount,
            paymentMethod: row.payment_method,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
} 