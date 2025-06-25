'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import recommendationApi, { Recommendation } from '@/services/api/recommendationApi';
import { productApi } from '@/services/api/productApi';
import { Product } from '@/types/product';

interface RecommendationSectionProps {
  type: 'user' | 'popular' | 'similar' | 'frequently-bought';
  productId?: string;
  title: string;
  limit?: number;
  className?: string;
}

export default function RecommendationSection({ 
  type, 
  productId, 
  title, 
  limit = 6,
  className = '' 
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [type, productId, limit]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (type) {
        case 'user':
          response = await recommendationApi.getRecommendationsForUser(limit);
          break;
        case 'popular':
          response = await recommendationApi.getPopularProducts(limit);
          break;
        case 'similar':
          if (!productId) {
            setError('Product ID is required for similar products');
            return;
          }
          response = await recommendationApi.getSimilarProducts(productId, limit);
          break;
        case 'frequently-bought':
          if (!productId) {
            setError('Product ID is required for frequently bought together');
            return;
          }
          response = await recommendationApi.getFrequentlyBoughtTogether(productId, limit);
          break;
        default:
          setError('Invalid recommendation type');
          return;
      }

      setRecommendations(response.data);

      // Fetch product details for the recommendations
      if (response.data.length > 0) {
        const productIds = response.data
          .map(rec => rec.productId)
          .filter(Boolean) as string[];
        
        const productPromises = productIds.map(id => 
          productApi.findByIdWithDiscount(id).catch(() => null)
        );
        
        const productResults = await Promise.all(productPromises);
        const validProducts = productResults.filter(Boolean) as Product[];
        setProducts(validProducts);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number) => {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  const getLowestPrice = (variants: Product['variants']) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  };

  const getLowestDiscountedPrice = (variants: Product['variants']) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.discountedPrice || v.price));
  };


  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No recommendations available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {products.map((product) => {
          const recommendation = recommendations.find(rec => rec.productId === product.id);
          const originalPrice = getLowestPrice(product.variants);
          const discountedPrice = getLowestDiscountedPrice(product.variants);
          const discountPercentage = calculateDiscountPercentage(originalPrice, discountedPrice);
          return (
            <Link 
              key={product.id} 
              href={`/product/${product.id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative h-48">
                  <Image
                    src={product.images?.[0]?.url || '/placeholder-product.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/*{recommendation && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {recommendation.score}% match
                      </span>
                    </div>
                  )}*/}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {product.description}
                  </p>
                  {/*{recommendation && (
                    <p className="text-xs text-gray-400 mt-2">
                      {recommendation.reason}
                    </p>
                  )}*/}
                </div>
                <div className="mt-2 flex items-center gap-1 py-4">
                        <span className="text-lg font-bold text-green-700">
                            {discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                        {originalPrice && originalPrice != discountedPrice && (
                        <span className="text-sm text-gray-500 line-through">
                                {originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                        )}
                        {discountPercentage != 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm text-green-800">{discountPercentage}% off</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 