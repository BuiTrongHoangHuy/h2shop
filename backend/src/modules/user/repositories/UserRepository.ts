import { pool } from '../../../config/database';
import User from '../entities/User';
import { IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    try {
      const [rows]: any[] = await pool.query(
        'SELECT * FROM users WHERE id = ? AND status = 1',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User({
        id: rows[0].id,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        gender: rows[0].gender,
        role: rows[0].role,
        avatar: rows[0].avatar ? JSON.parse(rows[0].avatar) : null,
        address: rows[0].address,
        status: rows[0].status,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const [rows]: any[] = await pool.query(
        'SELECT * FROM users WHERE phone = ? AND status = 1',
        [phone]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User({
        id: rows[0].id,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        gender: rows[0].gender,
        role: rows[0].role,
        avatar: rows[0].avatar ? JSON.parse(rows[0].avatar) : null,
        address: rows[0].address,
        status: rows[0].status,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      });
    } catch (error) {
      console.error('Error finding user by phone:', error);
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const [result]: any[] = await pool.query(
        `INSERT INTO users (full_name, phone, gender, role, avatar, address, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.fullName,
          user.phone,
          user.gender,
          user.role,
          user.avatar ? JSON.stringify(user.avatar) : null,
          user.address,
          user.status
        ]
      );
      
      return { ...user, id: result.insertId } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      await pool.query(
        `UPDATE users 
         SET full_name = ?, phone = ?, gender = ?, role = ?, avatar = ?, address = ?, status = ? 
         WHERE id = ?`,
        [
          user.fullName,
          user.phone,
          user.gender,
          user.role,
          user.avatar ? JSON.stringify(user.avatar) : null,
          user.address,
          user.status,
          user.id
        ]
      );
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Soft delete by setting status to 0
      await pool.query(
        'UPDATE users SET status = 0 WHERE id = ?',
        [id]
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const [rows]: any[] = await pool.query(
        'SELECT * FROM users WHERE status = 1 LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      const [countResult]: any[] = await pool.query(
        'SELECT COUNT(*) as total FROM users WHERE status = 1'
      );
      
      const total = countResult[0].total;
      
      const users = rows.map((row: any) => new User({
        id: row.id,
        fullName: row.full_name,
        phone: row.phone,
        gender: row.gender,
        role: row.role,
        avatar: row.avatar ? JSON.parse(row.avatar) : null,
        address: row.address,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }
}

export default UserRepository;
