import { injectable } from 'inversify';
import { pool } from '../../../config/database';
import { Recommendation } from '../entities/Recommendation';
import { IRecommendationRepository } from './IRecommendationRepository';

@injectable()
export class RecommendationRepository implements IRecommendationRepository {
  async getRecommendationsForUser(userId: string, limit: number = 10): Promise<Recommendation[]> {
    try {

      const [userCategoriesResult] = await pool.query<any[]>(`
        SELECT DISTINCT p.category_id
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN product_variants pv ON od.variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        WHERE o.user_id = ?
      `, [userId]);
      
      if (userCategoriesResult.length === 0) {
        return this.getPopularProducts(limit);
      }
      
      const categoryIds = userCategoriesResult.map(row => row.category_id);
      
      const [purchasedProductsResult] = await pool.query<any[]>(`
        SELECT DISTINCT pv.product_id
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN product_variants pv ON od.variant_id = pv.id
        WHERE o.user_id = ?
      `, [userId]);
      
      const purchasedProductIds = purchasedProductsResult.map(row => row.product_id);
      
      let query = `
        SELECT p.*, 
               AVG(r.rating) as avg_rating, 
               COUNT(DISTINCT o.id) as order_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN order_details od ON pv.id = od.variant_id
        LEFT JOIN orders o ON od.order_id = o.id
        WHERE p.category_id IN (${categoryIds.map(() => '?').join(',')})
      `;
      
      let params: any[] = [...categoryIds];
      
      if (purchasedProductIds.length > 0) {
        query += ` AND p.id NOT IN (${purchasedProductIds.map(() => '?').join(',')})`;
        params = [...params, ...purchasedProductIds];
      }
      
      query += `
        GROUP BY p.id
        ORDER BY avg_rating DESC, order_count DESC
        LIMIT ?
      `;
      
      params.push(limit);
      
      const [recommendedProductsResult] = await pool.query<any[]>(query, params);
      
      return recommendedProductsResult.map((row, index) => new Recommendation({
        id: (index + 1).toString(),
        userId,
        productId: row.id.toString(),
        score: row.avg_rating ? Math.round(row.avg_rating * 20) : 50,
        reason: 'Based on your purchase history',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting recommendations for user:', error);
      throw error;
    }
  }

  async getPopularProducts(limit: number = 10): Promise<Recommendation[]> {
    try {
      const [popularProductsResult] = await pool.query<any[]>(`
        SELECT p.*, 
               AVG(r.rating) as avg_rating, 
               COUNT(DISTINCT o.id) as order_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN order_details od ON pv.id = od.variant_id
        LEFT JOIN orders o ON od.order_id = o.id
        GROUP BY p.id
        ORDER BY order_count DESC, avg_rating DESC
        LIMIT ?
      `, [limit]);
      
      return popularProductsResult.map((row, index) => new Recommendation({
        id: (index + 1).toString(),
        userId: null,
        productId: row.id.toString(),
        score: row.avg_rating ? Math.round(row.avg_rating * 20) : 50,
        reason: 'Popular product',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting popular products:', error);
      throw error;
    }
  }

  async getSimilarProducts(productId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      const [productResult] = await pool.query<any[]>(
        'SELECT category_id FROM products WHERE id = ?',
        [productId]
      );
      
      if (productResult.length === 0) {
        throw new Error('Product not found');
      }
      
      const categoryId = productResult[0].category_id;
      
      const [similarProductsResult] = await pool.query<any[]>(`
        SELECT p.*, 
               AVG(r.rating) as avg_rating, 
               COUNT(DISTINCT o.id) as order_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN order_details od ON pv.id = od.variant_id
        LEFT JOIN orders o ON od.order_id = o.id
        WHERE p.category_id = ? AND p.id != ?
        GROUP BY p.id
        ORDER BY avg_rating DESC, order_count DESC
        LIMIT ?
      `, [categoryId, productId, limit]);
      
      return similarProductsResult.map((row, index) => new Recommendation({
        id: (index + 1).toString(),
        userId: null,
        productId: row.id.toString(),
        score: row.avg_rating ? Math.round(row.avg_rating * 20) : 50,
        reason: 'Similar product',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting similar products:', error);
      throw error;
    }
  }

  async getFrequentlyBoughtTogether(productId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      const [frequentlyBoughtTogetherResult] = await pool.query<any[]>(`
        SELECT p2.*, COUNT(*) as frequency
        FROM orders o
        JOIN order_details od1 ON o.id = od1.order_id
        JOIN product_variants pv1 ON od1.variant_id = pv1.id
        JOIN order_details od2 ON o.id = od2.order_id
        JOIN product_variants pv2 ON od2.variant_id = pv2.id
        JOIN products p2 ON pv2.product_id = p2.id
        WHERE pv1.product_id = ? AND pv2.product_id != ?
        GROUP BY p2.id
        ORDER BY frequency DESC
        LIMIT ?
      `, [productId, productId, limit]);
      
      return frequentlyBoughtTogetherResult.map((row, index) => new Recommendation({
        id: (index + 1).toString(),
        userId: null,
        productId: row.id.toString(),
        score: Math.min(100, row.frequency * 10), // Score based on frequency
        reason: 'Frequently bought together',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting frequently bought together products:', error);
      throw error;
    }
  }
} 