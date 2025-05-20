import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

// Database configuration interface
interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

// Database configuration
const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'h2shop',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection
const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

export {
  pool,
  testConnection
};