import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { IProductRepository } from './IProductRepository';
import Product, { ProductFilters } from '../entities/Product';
import { AppError } from '../../../utils/AppError';
import ProductVariant from '../entities/ProductVariant';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {Image} from "../../../utils/image";
import { DiscountResponse } from '../../discount/entities/Discount';

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

        const [productResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO products (name, description, category_id, images)
             VALUES (?, ?, ?, ?)`,
            [
              product.name,
              product.description,
              product.categoryId,
              product.images && product.images.length > 0 ? JSON.stringify(product.images) : null
            ]
        );

        const productId = productResult.insertId;

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

  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (data.name !== undefined) {
          updateFields.push('name = ?');
          updateValues.push(data.name);
        }
        if (data.description !== undefined) {
          updateFields.push('description = ?');
          updateValues.push(data.description);
        }
        if (data.categoryId !== undefined) {
          updateFields.push('category_id = ?');
          updateValues.push(data.categoryId);
        }
        if (data.images !== undefined) {
          updateFields.push('images = ?');
          updateValues.push(JSON.stringify(data.images));
        }

        if (updateFields.length > 0) {
          await connection.query(
              `UPDATE products
               SET ${updateFields.join(', ')}
               WHERE id = ?`,
              [...updateValues, id]
          );
        }

        if (data.variants) {
          const [existingVariants]: any = await connection.query(
              'SELECT id FROM product_variants WHERE product_id = ?',
              [id]
          );
          const existingIds = new Set(existingVariants.map((v: any) => Number(v.id)));
          const incomingIds = new Set<number>();
          for (const variant of data.variants) {
            const variantId = variant.id ? Number(variant.id) : null;
            if (variantId && variantId < 100000) {
              await connection.query(
                  `UPDATE product_variants
                   SET sku = ?,
                       color = ?,
                       size = ?,
                       price = ?,
                       stock_quantity = ?
                   WHERE id = ?
                     AND product_id = ?`,
                  [
                    variant.sku,
                    variant.color,
                    variant.size,
                    variant.price,
                    variant.stockQuantity,
                    variantId,
                    id,
                  ]
              );
              incomingIds.add(variantId);
            } else {
              await connection.query(
                  `INSERT INTO product_variants
                     (product_id, sku, color, size, price, stock_quantity)
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    id,
                    variant.sku,
                    variant.color,
                    variant.size,
                    variant.price,
                    variant.stockQuantity
                  ]
              );
            }
          }

          // @ts-ignore
          const toDelete = [...existingIds].filter(oldId => !incomingIds.has(oldId));
          if (toDelete.length > 0) {
            await connection.query(
                `DELETE
                 FROM product_variants
                 WHERE id IN (?)
                   AND product_id = ?`,
                [toDelete, id]
            );
          }
        }

        await connection.commit();

        // Trả về product đã cập nhật
        const updatedProduct = await this.findById(id);
        if (!updatedProduct) {
          throw new AppError('Product not found', 404);
        }

        return updatedProduct;

      } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        await connection.query(
            'DELETE FROM product_variants WHERE product_id = ?',
            [id]
        );

        const [result]: any = await connection.query(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
          throw new AppError('Product not found', 404);
        }

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting product', 500);
    }
  }

  private mapProductFromRow(row: ProductRow, variants: ProductVariant[] = []): Product {
    return new Product({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      images: row.images,
      categoryId: row.category_id.toString(),
      category: {
        id: row.category_id.toString(),
        name: row.category_name
      },
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
      return this.mapProductFromRow(products[0], productVariants);
    } catch (error) {
      console.error('Error finding product:', error);
      throw new AppError('Error finding product', 500);
    }
  }

  async findAll(filters: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    try {
      const {page = 1, limit = 10} = filters;
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
             LIMIT ?
           OFFSET ?`,
          [...params, limit, offset]
      );

      // Get variants for all products
      const productIds = products.map((p: ProductRow) => p.id);
      const safeIds = productIds.length > 0 ? productIds : [-1];
      const placeholders = safeIds.map(() => '?').join(',');
      const [variants] = await pool.query<VariantRow[]>(
          `SELECT *
           FROM product_variants
           WHERE product_id IN (${placeholders})
             AND status = 1`,
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
      //console.log(mappedProducts);
      return {
        products: mappedProducts,
        total: countResult[0].total
      };
    } catch (error) {
      console.error('Error finding products:', error);
      throw new AppError('Error finding products', 500);
    }
  }

  async findByCategory(categoryId: string): Promise<{ products: Product[]; total: number }> {
    try {
      const [products] = await pool.query<ProductRow[]>(
          `SELECT p.*, c.name as category_name
           FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
           WHERE p.category_id = ?`,
          [categoryId]
      );

      const productIds = products.map((p: ProductRow) => p.id);
      const safeIds = productIds.length > 0 ? productIds : [-1];
      const placeholders = safeIds.map(() => '?').join(',');
      const [variants] = await pool.query<VariantRow[]>(
          `SELECT *
           FROM product_variants
           WHERE product_id IN (${placeholders})`,
          safeIds
      );

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
      return {
        products: mappedProducts,
        total: products.length
      };
    } catch (error) {
      console.error('Error finding products by category:', error);
      throw new AppError('Error finding products by category', 500);
    }
  }

  async findBySku(sku: string): Promise<Product | null> {
    try {
      const [products] = await pool.query<ProductRow[]>(
          `SELECT p.*, c.name as category_name
           FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  INNER JOIN product_variants pv ON p.id = pv.product_id
           WHERE pv.sku = ?`,
          [sku]
      );

      if (products.length === 0) {
        return null;
      }

      const [variants] = await pool.query<VariantRow[]>(
          'SELECT * FROM product_variants WHERE product_id = ?',
          [products[0].id]
      );

      const productVariants = variants.map((v: VariantRow) => this.mapVariantFromRow(v));
      return this.mapProductFromRow(products[0], productVariants);
    } catch (error) {
      console.error('Error finding product by SKU:', error);
      throw new AppError('Error finding product by SKU', 500);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [variants] = await pool.query<VariantRow[]>(
            'SELECT * FROM product_variants WHERE product_id = ?',
            [id]
        );

        if (variants.length === 0) {
          throw new AppError('Product variants not found', 404);
        }

        // Update stock for all variants
        await connection.query(
            `UPDATE product_variants
             SET stock_quantity = stock_quantity + ?
             WHERE product_id = ?`,
            [quantity, id]
        );

        await connection.commit();

        const updatedProduct = await this.findById(id);
        if (!updatedProduct) {
          throw new AppError('Product not found after stock update', 500);
        }
        return updatedProduct;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product stock', 500);
    }
  }

  async findDiscountedProducts(page = 1, limit = 10): Promise<{ products: Product[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      const [productRows] = await pool.query<ProductRow[]>(
          `SELECT p.*,
                  c.name   as category_name,
                  d.id     as discount_id,
                  d.name   as discount_name,
                  d.value,
                  d.discount_type,
                  d.start_date,
                  d.end_date,
                  d.status as discount_status
           FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  INNER JOIN discount_products dp ON dp.product_id = p.id
                  INNER JOIN discounts d ON dp.discount_id = d.id
           WHERE d.status = 1
             AND d.start_date <= NOW()
             AND d.end_date >= NOW()
           ORDER BY p.created_at DESC LIMIT ?
           OFFSET ?`,
          [limit, offset]
      );

      if (productRows.length === 0) {
        return {products: [], total: 0};
      }

      const productIds = productRows.map(p => p.id);
      const placeholders = productIds.map(() => '?').join(',');

      const [variantRows] = await pool.query<VariantRow[]>(
          `SELECT *
           FROM product_variants
           WHERE product_id IN (${placeholders})`,
          productIds
      );

      const variantsByProductId: Record<number, ProductVariant[]> = {};

      for (const variant of variantRows) {
        const discount = productRows.find(p => p.id === variant.product_id);
        let discountedPrice = variant.price;

        if (discount) {
          if (discount.discount_type == "Percentage") {
            discountedPrice = Math.round(variant.price * (1 - discount.value / 100));
          } else if (discount.discount_type == "Fixed Amount") {
            discountedPrice = Math.max(0, variant.price - discount.value);
          }
        }

        const mappedVariant = new ProductVariant({
          id: variant.id.toString(),
          productId: variant.product_id.toString(),
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          stockQuantity: variant.stock_quantity,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
          discountedPrice: discountedPrice
        });

        if (!variantsByProductId[variant.product_id]) {
          variantsByProductId[variant.product_id] = [];
        }
        variantsByProductId[variant.product_id].push(mappedVariant);
      }

      const products: Product[] = productRows.map(row => {
        return new Product({
          id: row.id.toString(),
          name: row.name,
          description: row.description,
          images: row.images,
          categoryId: row.category_id.toString(),
          category: {
            id: row.category_id.toString(),
            name: row.category_name
          },
          variants: variantsByProductId[row.id] || [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          discount: {
            id: row.discount_id?.toString(),
            name: row.discount_name,
            value: row.value,
            discountType: row.discount_type,
            startDate: row.start_date,
            endDate: row.end_date,
            status: row.discount_status,
          }
        });
      });

      const [countResult] = await pool.query<CountResult[]>(
          `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       INNER JOIN discount_products dd ON dd.product_id = p.id
       INNER JOIN discounts d ON dd.discount_id = d.id
       WHERE d.status = 1
         AND d.start_date <= NOW()
         AND d.end_date >= NOW()`
      );

      return {
        products,
        total: countResult[0].total
      };
    } catch (error) {
      console.error('Error finding discounted products:', error);
      throw new AppError('Error finding discounted products', 500);
    }
  }

  async findByIdWithDiscount(id: string): Promise<Product | null> {
    try {
      const [products] = await pool.query<ProductRow[]>(
          `SELECT
             p.*,
             c.name AS category_name,
             d.id AS discount_id,
             d.name AS discount_name,
             d.discount_type,
             d.value,
             d.start_date,
             d.end_date,
             d.status AS discount_status
           FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  LEFT JOIN discount_products dp ON dp.product_id = p.id
                  LEFT JOIN discounts d ON dp.discount_id = d.id
           WHERE p.id = ?
             AND (d.id IS NULL OR (d.status = 1 AND d.start_date <= NOW() AND d.end_date >= NOW()))`,
          [id]
      );

      if (products.length === 0) return null;

      const productRow = products[0];

      const [variants] = await pool.query<VariantRow[]>(
          'SELECT * FROM product_variants WHERE product_id = ?',
          [id]
      );

      const productVariants = variants.map(v => {
        let discountedPrice = v.price;
        if (productRow.discount_type === 'Percentage') {
          discountedPrice = Math.round((v.price * (1 - productRow.value / 100)) * 100) / 100;
        } else if (productRow.discount_type === 'Fixed Amount') {
          discountedPrice = Math.max(0, v.price - productRow.value);
        }

        return {
          ...this.mapVariantFromRow(v),
          discountedPrice,
        };
      });

      // @ts-ignore
      const product = this.mapProductFromRow(productRow, productVariants);

      if (productRow.discount_id) {
        product.discount = {
          id: productRow.discount_id.toString(),
          name: productRow.discount_name,
          discountType: productRow.discount_type,
          value: productRow.value,
          startDate: productRow.start_date,
          endDate: productRow.end_date,
          status: productRow.discount_status
        };
      }

      return product;
    } catch (error) {
      console.error('Error finding product with discount:', error);
      throw new AppError('Error finding product with discount', 500);
    }
  }

} 