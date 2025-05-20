import { pool } from '../../../config/database';
import Auth from '../entities/Auth';
import bcrypt from 'bcryptjs';
import { IAuthRepository } from './IAuthRepository';

class AuthRepository implements IAuthRepository {
  async findByUserId(userId: number): Promise<Auth | null> {
    try {
      const [rows]: any[] = await pool.query(
        'SELECT * FROM auths WHERE user_id = ? AND status = 1',
        [userId]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Auth({
        id: rows[0].id,
        userId: rows[0].user_id,
        email: rows[0].email,
        salt: rows[0].salt,
        password: rows[0].password,
        status: rows[0].status,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      });
    } catch (error) {
      console.error('Error finding auth by user ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Auth | null> {
    try {
      const [rows]: any[] = await pool.query(
        'SELECT * FROM auths WHERE email = ? AND status = 1',
        [email]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Auth({
        id: rows[0].id,
        userId: rows[0].user_id,
        email: rows[0].email,
        salt: rows[0].salt,
        password: rows[0].password,
        status: rows[0].status,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      });
    } catch (error) {
      console.error('Error finding auth by email:', error);
      throw error;
    }
  }

  async create(auth: Auth): Promise<Auth> {
    try {
      const salt = bcrypt.genSaltSync(10);
      
      const hashedPassword = bcrypt.hashSync(auth.password as string, salt);
      
      const [result]: any[] = await pool.query(
        `INSERT INTO auths (user_id, email, salt, password, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          auth.userId,
          auth.email,
          salt,
          hashedPassword,
          auth.status
        ]
      );
      
      return { 
        ...auth, 
        id: result.insertId,
        salt,
        password: hashedPassword
      } as Auth;
    } catch (error) {
      console.error('Error creating auth:', error);
      throw error;
    }
  }

  async update(auth: Auth): Promise<Auth> {
    try {
      if (auth.password) {

        const salt = bcrypt.genSaltSync(10);
        
        const hashedPassword = bcrypt.hashSync(auth.password as string, salt);
        
        await pool.query(
          `UPDATE auths 
           SET email = ?, salt = ?, password = ?, status = ? 
           WHERE id = ?`,
          [
            auth.email,
            salt,
            hashedPassword,
            auth.status,
            auth.id
          ]
        );
        
        return { 
          ...auth, 
          salt,
          password: hashedPassword
        } as Auth;
      } else {

        await pool.query(
          `UPDATE auths 
           SET email = ?, status = ? 
           WHERE id = ?`,
          [
            auth.email,
            auth.status,
            auth.id
          ]
        );
        
        return auth;
      }
    } catch (error) {
      console.error('Error updating auth:', error);
      throw error;
    }
  }

  async delete(userId: number): Promise<boolean> {
    try {

      await pool.query(
        'UPDATE auths SET status = 0 WHERE user_id = ?',
        [userId]
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting auth:', error);
      throw error;
    }
  }

  async verifyPassword(email: string, password: string): Promise<Auth | null> {
    try {
      const auth = await this.findByEmail(email);
      
      if (!auth) {
        return null;
      }
      
      const isPasswordValid = bcrypt.compareSync(password, auth.password as string);
      
      if (!isPasswordValid) {
        return null;
      }
      
      return auth;
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }
}

export default AuthRepository;