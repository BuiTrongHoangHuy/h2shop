import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IDiscountRepository } from './IDiscountRepository';
import Discount, { DiscountFilters } from '../entities/Discount';

@injectable()
export class DiscountRepository implements IDiscountRepository {
  constructor() {}

  private mapToDiscount(row: any): Discount {
    return new Discount({
      id: row.id,
      name: row.name,
      description: row.description,
      discountType: row.discount_type,
      value: row.value,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  async findAll(options: {
    page: number;
    limit: number;
    filters?: DiscountFilters;
  }): Promise<{ discounts: Discount[]; total: number }> {
    const offset = (options.page - 1) * options.limit;
    const values: any[] = [];
    const conditions: string[] = [];

    if (options.filters) {
      if (options.filters.search) {
        conditions.push('name LIKE ?');
        values.push(`%${options.filters.search}%`);
      }
      if (options.filters.discountType) {
        conditions.push('discount_type = ?');
        values.push(options.filters.discountType);
      }
      if (options.filters.status !== undefined) {
        conditions.push('status = ?');
        values.push(options.filters.status);
      }
      if (options.filters.active) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        conditions.push('status = 1 AND start_date <= ? AND end_date >= ?');
        values.push(now, now);
      }
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const [rows] = await pool.query<any[]>(
        `SELECT * FROM discounts ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...values, options.limit, offset]
    );

    const [countRows] = await pool.query<any[]>(
        `SELECT COUNT(*) as total FROM discounts ${whereClause}`,
        values
    );

    return {
      discounts: rows.map(row => this.mapToDiscount(row)),
      total: countRows[0].total
    };
  }

  async create(discount: Discount): Promise<Discount> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<any>(
          `INSERT INTO discounts (name, description, discount_type, value, start_date, end_date, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            discount.name,
            discount.description,
            discount.discountType,
            discount.value,
            discount.startDate,
            discount.endDate,
            discount.status
          ]
      );

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM discounts WHERE id = ?',
          [result.insertId]
      );

      await connection.commit();
      return this.mapToDiscount(rows[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id: number, data: Partial<Discount>): Promise<Discount> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }
      if (data.discountType !== undefined) {
        fields.push('discount_type = ?');
        values.push(data.discountType);
      }
      if (data.value !== undefined) {
        fields.push('value = ?');
        values.push(data.value);
      }
      if (data.startDate !== undefined) {
        fields.push('start_date = ?');
        values.push(data.startDate);
      }
      if (data.endDate !== undefined) {
        fields.push('end_date = ?');
        values.push(data.endDate);
      }
      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `
        UPDATE discounts 
        SET ${fields.join(', ')} 
        WHERE id = ?`;

      await connection.query(query, values);

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM discounts WHERE id = ?',
          [id]
      );

      await connection.commit();

      if (rows.length === 0) {
        throw new Error('Discount not found');
      }

      return this.mapToDiscount(rows[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // First delete any product associations
      await connection.query('DELETE FROM discount_products WHERE discount_id = ?', [id]);

      // Then delete the discount
      await connection.query('DELETE FROM discounts WHERE id = ?', [id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: number): Promise<Discount | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM discounts WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? this.mapToDiscount(rows[0]) : null;
  }

  async findByName(name: string): Promise<Discount | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM discounts WHERE name = ?',
        [name]
    );
    return rows.length > 0 ? this.mapToDiscount(rows[0]) : null;
  }

  async findByProductId(productId: number): Promise<Discount[]> {
    const [rows] = await pool.query<any[]>(
        `SELECT d.* FROM discounts d
         JOIN discount_products dp ON d.id = dp.discount_id
         WHERE dp.product_id = ? AND d.status = 1 AND d.start_date <= NOW() AND d.end_date >= NOW()`,
        [productId]
    );
    return rows.map(row => this.mapToDiscount(row));
  }

  async addProductToDiscount(discountId: number, productId: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if the association already exists
      const [existingRows] = await connection.query<any[]>(
        'SELECT * FROM discount_products WHERE discount_id = ? AND product_id = ?',
        [discountId, productId]
      );

      if (existingRows.length === 0) {
        await connection.query(
          'INSERT INTO discount_products (discount_id, product_id) VALUES (?, ?)',
          [discountId, productId]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async removeProductFromDiscount(discountId: number, productId: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'DELETE FROM discount_products WHERE discount_id = ? AND product_id = ?',
        [discountId, productId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getProductsForDiscount(discountId: number): Promise<number[]> {
    const [rows] = await pool.query<any[]>(
      'SELECT product_id FROM discount_products WHERE discount_id = ?',
      [discountId]
    );

    return rows.map(row => row.product_id);
  }
}
