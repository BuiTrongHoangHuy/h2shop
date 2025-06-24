import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IReviewRepository, ReviewFilters } from './IReviewRepository';
import { Review } from '../entities/Review';

@injectable()
export class ReviewRepository implements IReviewRepository {
  constructor() {}

  private mapToReview(row: any): Review {
    return new Review({
      id: row.id,
      userId: row.user_id,
      productId: row.product_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userName: row.userName,
    });
  }

  async findAll(options: {
    page: number;
    limit: number;
    filters?: ReviewFilters;
  }): Promise<{ reviews: Review[]; total: number }> {
    const offset = (options.page - 1) * options.limit;
    const values: any[] = [];
    const conditions: string[] = [];

    if (options.filters) {
      if (options.filters.userId !== undefined) {
        conditions.push('user_id = ?');
        values.push(options.filters.userId);
      }
      if (options.filters.productId !== undefined) {
        conditions.push('product_id = ?');
        values.push(options.filters.productId);
      }
      if (options.filters.minRating !== undefined) {
        conditions.push('rating >= ?');
        values.push(options.filters.minRating);
      }
      if (options.filters.maxRating !== undefined) {
        conditions.push('rating <= ?');
        values.push(options.filters.maxRating);
      }
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const [rows] = await pool.query<any[]>(
        `SELECT * FROM reviews ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...values, options.limit, offset]
    );

    const [countRows] = await pool.query<any[]>(
        `SELECT COUNT(*) as total FROM reviews ${whereClause}`,
        values
    );

    return {
      reviews: rows.map(row => this.mapToReview(row)),
      total: countRows[0].total
    };
  }

  async create(review: Review): Promise<Review> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<any>(
          `INSERT INTO reviews (user_id, product_id, rating, comment) 
           VALUES (?, ?, ?, ?)`,
          [
            review.userId,
            review.productId,
            review.rating,
            review.comment
          ]
      );

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM reviews WHERE id = ?',
          [result.insertId]
      );

      await connection.commit();
      return this.mapToReview(rows[0]);
    } catch (error) {
      await connection.rollback();
      console.log("eprrrrrr",error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id: number, data: Partial<Review>): Promise<Review> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const values: any[] = [];

      if (data.rating !== undefined) {
        fields.push('rating = ?');
        values.push(data.rating);
      }
      if (data.comment !== undefined) {
        fields.push('comment = ?');
        values.push(data.comment);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `
        UPDATE reviews 
        SET ${fields.join(', ')} 
        WHERE id = ?`;

      await connection.query(query, values);

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM reviews WHERE id = ?',
          [id]
      );

      await connection.commit();

      if (rows.length === 0) {
        throw new Error('Review not found');
      }

      return this.mapToReview(rows[0]);
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
      await connection.query('DELETE FROM reviews WHERE id = ?', [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: number): Promise<Review | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM reviews WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? this.mapToReview(rows[0]) : null;
  }

  async findByUserAndProduct(userId: number, productId: number): Promise<Review | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
        [userId, productId]
    );
    return rows.length > 0 ? this.mapToReview(rows[0]) : null;
  }

  async findByProductId(productId: number): Promise<Review[]> {
    const [rows] = await pool.query<any[]>(
        `SELECT r.*, u.full_name as userName 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ? 
         ORDER BY r.created_at DESC`,
        [productId]
    );
    console.log("gegegeg",rows);
    return rows.map(row => this.mapToReview(row));
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows.map(row => this.mapToReview(row));
  }
}