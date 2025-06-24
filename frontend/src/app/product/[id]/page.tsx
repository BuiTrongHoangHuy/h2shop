'use client';

import {useState, useEffect, use} from 'react';
import { productApi, Product } from '@/services/api/productApi';
import cartApi from '@/services/api/cartApi';
import Image from 'next/image';
import Link from 'next/link';
import ReviewCard from "@/component/product/ReviewCard";
import ProductCard from "@/component/product/ProductCard";
import { toast } from 'react-toastify';
import reviewApi from "@/services/api/reviewApi";
import { Review } from "@/types/review";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const mockRecommendedProducts: Product[] = [
    {
        id: '2',
        name: 'Comfort Colors Sun T-Shirt',
        originalPrice: 123,
        variants:[],
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '3',
        name: 'Embroidered crewneck wildflower',
        originalPrice: 123,
        variants:[],
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '4',
        name: 'Bohemian maxi floral cotton dress',
        variants:[],
        originalPrice: 112,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
    {
        id: '5',
        name: 'Cat gallery t-shirt',
        variants:[],
        originalPrice: 1233,
        images: [{url:'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg'}],
        description: '',
    },
];

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

    const { id } = use(params);
    const productId = id;
    const recommendedProducts = mockRecommendedProducts;
    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productApi.getProductById(productId);
            setProduct(data);
            if (data.variants && data.variants.length > 0 && data.variants[0].id) {
                setSelectedVariant(data.variants[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            console.log('Fetching reviews for product ID:', productId);
            const fetchedReviews = await reviewApi.getReviewsByProductId(productId);
            setReviews(fetchedReviews);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
            toast.error('Failed to load reviews.');
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await reviewApi.addReview(productId, newReview.rating, newReview.comment);
            toast.success('Review submitted successfully!');
            setNewReview({ rating: 0, comment: '' });
            fetchReviews(); // Refresh reviews
        } catch (error) {
            toast.error('Failed to submit review.');
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error('Please select a variant');
            return;
        }

        try {
            setAddingToCart(true);
            await cartApi.addToCart(selectedVariant, quantity);
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCart(false);
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
    const currentPrice = selectedVariantData?.price || selectedVariantData?.price || 0;
    const currentStock = selectedVariantData?.stockQuantity ?? selectedVariantData?.stockQuantity ?? 0;

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
                            {Number(currentPrice).toLocaleString()} VND
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
                                            onClick={() =>{setSelectedVariant(variant.id); setQuantity(1);} }
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
                                                {Number(variant.price).toLocaleString()} VND
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mt-6">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                                Quantity
                            </label>
                            <div className="mt-2 flex items-center">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 border rounded-l-lg hover:bg-gray-100"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={currentStock}
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = Math.max(1, Math.min(currentStock, Number(e.target.value)));
                                        setQuantity(value);
                                    }}
                                    className="w-16 text-center border-t border-b focus:outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 border rounded-r-lg hover:bg-gray-100"
                                    disabled={quantity >= currentStock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            disabled={currentStock === 0 || addingToCart}
                            onClick={handleAddToCart}
                            className="mt-8 w-full bg-orange-500 text-white py-3 px-6 cursor-pointer rounded-lg font-medium
                            hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? 'Adding...' : currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-semibold">Product has {reviews.length} reviews</h2>
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={{...review, user: review.userName, date: review.createdAt, purchasedItem: "hardcode"}} />
                    ))}
                </div>

                {/* Add Review Form */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Add a review</h2>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value={0} disabled>Select a rating</option>
                                <option value={1}>1 - Poor</option>
                                <option value={2}>2 - Fair</option>
                                <option value={3}>3 - Good</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={5}>5 - Excellent</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                rows={4}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-orange-700"
                        >
                            Submit Review
                        </button>
                    </form>
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