import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { ICategoryRepository } from './ICategoryRepository';
import Category, { CategoryFilters } from '../entities/Category';

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor() {}

  private mapToCategory(row: any): Category {
    return new Category({
      id: row.id,
      name: row.name,
      description: row.description,
      parentId: row.parent_id,
      status: row.status,
      image: row.image,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  async findAll(options: {
    page: number;
    limit: number;
    filters?: CategoryFilters;
  }): Promise<{ categories: Category[]; total: number }> {
    const offset = (options.page - 1) * options.limit;
    const values: any[] = [];
    const conditions: string[] = [];

    if (options.filters) {
      if (options.filters.search) {
        conditions.push('name LIKE ?');
        values.push(`%${options.filters.search}%`);
      }
      if (options.filters.parentId !== undefined) {
        conditions.push('parent_id = ?');
        values.push(options.filters.parentId);
      }
      if (options.filters.status !== undefined) {
        conditions.push('status = ?');
        values.push(options.filters.status);
      }
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const [rows] = await pool.query<any[]>(
        `SELECT * FROM categories ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...values, options.limit, offset]
    );

    const [countRows] = await pool.query<any[]>(
        `SELECT COUNT(*) as total FROM categories ${whereClause}`,
        values
    );

    return {
      categories: rows.map(row => this.mapToCategory(row)),
      total: countRows[0].total
    };
  }

  async create(category: Category): Promise<Category> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<any>(
          `INSERT INTO categories (name, description, parent_id, status, image) 
         VALUES (?, ?, ?, ?, ?)`,
          [
            category.name,
            category.description,
            category.parentId,
            category.status,
            category.image ? JSON.stringify(category.image) : null
          ]
      );

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM categories WHERE id = ?',
          [result.insertId]
      );

      await connection.commit();
      return this.mapToCategory(rows[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
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
      if (data.parentId !== undefined) {
        fields.push('parent_id = ?');
        values.push(data.parentId);
      }
      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);
      }
      if (data.image !== undefined) {
        fields.push('image = ?');
        values.push(data.image ? JSON.stringify(data.image) : null);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `
        UPDATE categories 
        SET ${fields.join(', ')} 
        WHERE id = ?`;

      await connection.query(query, values);

      const [rows] = await connection.query<any[]>(
          'SELECT * FROM categories WHERE id = ?',
          [id]
      );

      await connection.commit();

      if (rows.length === 0) {
        throw new Error('Category not found');
      }

      return this.mapToCategory(rows[0]);
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
      await connection.query('DELETE FROM categories WHERE id = ?', [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: number): Promise<Category | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM categories WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? this.mapToCategory(rows[0]) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM categories WHERE name = ?',
        [name]
    );
    return rows.length > 0 ? this.mapToCategory(rows[0]) : null;
  }



  async findChildren(parentId: number): Promise<Category[]> {
    const [rows] = await pool.query<any[]>(
        'SELECT * FROM categories WHERE parent_id = ?',
        [parentId]
    );
    return rows.map(row => this.mapToCategory(row));
  }
}
