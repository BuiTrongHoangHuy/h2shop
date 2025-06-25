"use client";

import React, { useEffect, useState } from 'react';
import { BigDealCard } from './BigDealCard';
import { Clock } from 'lucide-react';
import { Product, productApi } from '@/services/api/productApi';

const BigDealSection = () => {
    const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDiscountedProducts();
    }, []);
    function shuffle(array:any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const loadDiscountedProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.findDiscountedProducts(1, 10);
            const randomProducts = shuffle([...response.data.products])// Get more products to ensure we have enough
            setDiscountedProducts(randomProducts.slice(0, 5)); // Take only first 5
        } catch (error) {
            console.error('Error loading discounted products:', error);
            setError('Failed to load discounted products');
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

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0].url;
        }
        return '/placeholder-product.png';
    };

    if (loading) {
        return (
            <div>
                <div className="mb-4 mt-4 flex gap-4 items-center">
                    <div className='text-2xl font-medium'>Today's big deals</div>
                    <div className="flex items-center text-base text-gray-500 leading-none">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Loading...</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-3xl aspect-square mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mb-4 mt-4 flex gap-4 items-center">
                    <div className='text-2xl font-medium'>Today's big deals</div>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <p>{error}</p>
                    <button 
                        onClick={loadDiscountedProducts}
                        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (discountedProducts.length === 0) {
        return (
            <div>
                <div className="mb-4 mt-4 flex gap-4 items-center">
                    <div className='text-2xl font-medium'>Today's big deals</div>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <p>No discounted products available at the moment.</p>
                    <p className="text-sm mt-1">Check back later for amazing deals!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 mt-4 flex gap-4 items-center">
                <div className='text-2xl font-medium'>Today's big deals</div>
                {/*<div className="flex items-center text-base text-gray-500 leading-none">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Limited time offers</span>
                </div>*/}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {discountedProducts.map((product) => {
                    const originalPrice = getLowestPrice(product.variants);
                    const discountedPrice = getLowestDiscountedPrice(product.variants);
                    const discountPercentage = calculateDiscountPercentage(originalPrice, discountedPrice);

                    return (
                        <BigDealCard
                            key={product.id}
                            id={product.id}
                            title={product.name}
                            imageSrc={getProductImage(product)}
                            rating={product.rating?.value || 4.5}
                            currentPrice={discountedPrice}
                            originalPrice={originalPrice}
                            discount={discountPercentage}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default BigDealSection;