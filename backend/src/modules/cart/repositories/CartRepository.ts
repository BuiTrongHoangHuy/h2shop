import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import Cart from '../entities/Cart';
import { ICartRepository } from './ICartRepository';

@injectable()
export class CartRepository implements ICartRepository {
    async getCartByUser(userId: string): Promise<Cart[]> {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM cart WHERE user_id = ?',
            [userId]
        );
        return rows.map(row => new Cart({
            id: row.id.toString(),
            userId: row.user_id.toString(),
            variantId: row.variant_id.toString(),
            quantity: row.quantity,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }

    async addToCart(userId: string, variantId: string, quantity: number): Promise<void> {
        await pool.query(
            `INSERT INTO cart (user_id, variant_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [userId, variantId, quantity]
        );
    }


}