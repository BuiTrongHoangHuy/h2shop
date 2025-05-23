'use client';

import {useState, useEffect, use} from 'react';
import { productApi, Product } from '@/services/api/productApi';
import Image from 'next/image';
import Link from 'next/link';
import ReviewCard from "@/component/product/ReviewCard";
import ProductCard from "@/component/product/ProductCard";

type Review = {
    rating: number;
    comment: string;
    user: string;
    date: string;
    purchasedItem: string;
};
interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}
const mockReviews: Review[] = [
    {
        rating: 5,
        comment: 'Amazing!',
        user: 'Huy',
        date: 'Apr 7, 2025',
        purchasedItem: 'Embroidered SUN T-shirt',
    },
    {
        rating: 5,
        comment:
            'Amazing',
        user: 'Chau',
        date: 'Apr 7, 2025',
        purchasedItem: 'Embroidered SUN T-shirt',
    },
    {
        rating: 5,
        comment: 'Amazing!',
        user: 'Hoang',
        date: 'Apr 6, 2025',
        purchasedItem: 'Embroidered SUN T-shirt',
    },
];

const mockRecommendedProducts: Product[] = [
    {
        id: '2',
        name: 'Comfort Colors Sun T-Shirt',
        price: 123,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '3',
        name: 'Embroidered crewneck wildflower',
        price: 123,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '4',
        name: 'Bohemian maxi floral cotton dress',
        price: 112,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '5',
        name: 'Cat gallery t-shirt',
        price: 1233,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
];



export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const { id } = use(params);
    const productId = id;
    const reviews = mockReviews;
    const recommendedProducts = mockRecommendedProducts;
    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productApi.getProduct(productId);
            setProduct(data);
            if (data.variants && data.variants.length > 0) {
                setSelectedVariant(data.variants[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="aspect-square bg-gray-200 rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p>{error || 'Product not found'}</p>
                        <button
                            onClick={fetchProduct}
                            className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const selectedVariantData = product.variants?.find(v => v.id === selectedVariant);
    const currentPrice = selectedVariantData?.price || product.price;
    const currentStock = selectedVariantData?.stockQuantity || product.stock;

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
                >
                    <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                                src={product.images && product.images[0].url || '/placeholder-product.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(1).map((image, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                        <Image
                                            src={image.url || '/placeholder-product.png'}
                                            alt={`${product.name} - Image ${index + 2}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-2xl font-semibold text-gray-900 mt-4">
                            {currentPrice} VND
                        </p>

                        {/* Stock Status */}
                        <p className={`mt-2 text-sm ${currentStock && currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {currentStock && currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
                        </p>

                        {/* Product Description */}
                        <div className="mt-6">
                            <h2 className="text-sm font-medium text-gray-900">Description</h2>
                            <p className="mt-2 text-gray-600">{product.description}</p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-sm font-medium text-gray-900">Variants</h2>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant.id)}
                                            className={`p-4 text-left border rounded-lg transition-colors cursor-pointer ${
                                                selectedVariant === variant.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-medium">
                                                {variant.color && `${variant.color} `}
                                                {variant.size && `- ${variant.size}`}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {variant.price} VND
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            disabled={currentStock === 0}
                            className="mt-8 w-full bg-orange-500 text-white py-3 px-6 cursor-pointer rounded-lg font-medium
                hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-semibold">Product has 10 reviews</h2>
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                    <div className="flex justify-center mt-4">
                        <button className="border rounded-full p-2 mx-1">1</button>
                        <button className="border rounded-full p-2 mx-1">2</button>
                        <button className="border rounded-full p-2 mx-1">3</button>
                        <button className="border rounded-full p-2 mx-1">4</button>
                        <button className="border rounded-full p-2 mx-1">5</button>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">You may also like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link href="/" className="text-gray-600 border px-4 py-2 rounded">
                            See more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}