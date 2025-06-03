import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IProductRepository } from './IProductRepository';
import Product, { ProductFilters } from '../entities/Product';
import { AppError } from '../../../utils/AppError';
import ProductVariant from '../entities/ProductVariant';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {Image} from "../../../utils/image";

interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
  images: Image[];
  created_at: Date;
  updated_at: Date;
}

interface VariantRow extends RowDataPacket {
  id: number;
  product_id: number;
  sku: string;
  color: string;
  size: string;
  price: number;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
}

interface CountResult extends RowDataPacket {
  total: number;
}

@injectable()
export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Insert product
        const [productResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO products (name, description, category_id) 
           VALUES (?, ?, ?)`,
          [product.name, product.description, product.categoryId]
        );

        const productId = productResult.insertId;

        // Insert variants if any
        if (product.variants && product.variants.length > 0) {
          const variantValues = product.variants.map(variant => [
            productId,
            variant.sku,
            variant.color,
            variant.size,
            variant.price,
            variant.stockQuantity
          ]);

          await connection.query(
            `INSERT INTO product_variants (product_id, sku, color, size, price, stock_quantity) 
             VALUES ?`,
            [variantValues]
          );
        }

        await connection.commit();

        // Fetch the created product with its variants
        const createdProduct = await this.findById(productId.toString());
        if (!createdProduct) {
          throw new AppError('Error retrieving created product', 500);
        }
        return createdProduct;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw new AppError('Error creating product', 500);
    }
  }
  

  private mapProductFromRow(row: ProductRow, variants: ProductVariant[] = []): Product {
    return new Product({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      images: row.images,
      categoryId: row.category_id.toString(),
      variants: variants,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  private mapVariantFromRow(row: VariantRow): ProductVariant {
    return new ProductVariant({
      id: row.id.toString(),
      productId: row.product_id.toString(),
      sku: row.sku,
      color: row.color,
      size: row.size,
      price: row.price,
      stockQuantity: row.stock_quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  async findById(id: string): Promise<Product | null> {
    try {
      // Get product
      const [products] = await pool.query<ProductRow[]>(
        `SELECT p.*, c.name as category_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.id = ?`,
        [id]
      );

      if (products.length === 0) {
        return null;
      }

      // Get variants
      const [variants] = await pool.query<VariantRow[]>(
        'SELECT * FROM product_variants WHERE product_id = ?',
        [id]
      );
      const productVariants = variants.map(v => this.mapVariantFromRow(v));
      console.log(variants);
      console.log('hhhhhh',productVariants);
      console.log(this.mapProductFromRow(products[0], productVariants));
      return this.mapProductFromRow(products[0], productVariants);
    } catch (error) {
      console.error('Error finding product:', error);
      throw new AppError('Error finding product', 500);
    }
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    filters?: ProductFilters;
  }): Promise<{ products: Product[]; total: number }> {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      const offset = (page - 1) * limit;

      // Build query conditions
      const conditions: string[] = [];
      const params: any[] = [];

      if (filters.categoryId) {
        conditions.push('p.category_id = ?');
        params.push(filters.categoryId);
      }

      if (filters.search) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters.minPrice !== undefined) {
        conditions.push('pv.price >= ?');
        params.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        conditions.push('pv.price <= ?');
        params.push(filters.maxPrice);
      }

      if (filters.inStock !== undefined) {
        conditions.push('pv.stock_quantity ' + (filters.inStock ? '> 0' : '= 0'));
      }

      const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

      // Get total count
      const [countResult] = await pool.query<CountResult[]>(
        `SELECT COUNT(DISTINCT p.id) as total 
         FROM products p 
         LEFT JOIN product_variants pv ON p.id = pv.product_id 
         LEFT JOIN categories c ON p.category_id = c.id 
         ${whereClause}`,
        params
      );

      // Get products
      const [products] = await pool.query<ProductRow[]>(
        `SELECT p.*, c.name as category_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         ${whereClause} 
         GROUP BY p.id 
         ORDER BY p.created_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      // Get variants for all products
      const productIds = products.map((p: ProductRow) => p.id);
      const safeIds = productIds.length > 0 ? productIds : [-1];
      const placeholders = safeIds.map(() => '?').join(',');
      console.log("placeholders",placeholders);
      const [variants] = await pool.query<VariantRow[]>(
        `SELECT * FROM product_variants WHERE product_id IN (${placeholders})`,
        safeIds
      );

      // Map variants to products
      const variantsByProductId = variants.reduce<Record<number, ProductVariant[]>>((acc, variant: VariantRow) => {
        if (!acc[variant.product_id]) {
          acc[variant.product_id] = [];
        }
        acc[variant.product_id].push(this.mapVariantFromRow(variant));
        return acc;
      }, {});

      const mappedProducts = products.map((p: ProductRow) => 
        this.mapProductFromRow(p, variantsByProductId[p.id] || [])
      );
      console.log(mappedProducts);
      return {
        products: mappedProducts,
        total: countResult[0].total
      };
    } catch (error) {
      console.error('Error finding products:', error);
      throw new AppError('Error finding products', 500);
    }
  }


} 