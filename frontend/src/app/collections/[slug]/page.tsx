"use client"

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {Product} from '@/types/product';
import {Category} from '@/types/category';
import categoryApi from "@/services/api/categoryApi";
import {Product as ApiProduct, productApi} from "@/services/api/productApi";
import { ProductGrid } from '@/component/search/result_section/ProductGrid';
interface DisplayProduct {
    id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice: number;
    discount: number;
    rating?: {
        value: number;
        count: number;
    };
    saleEndsIn?: string;
}

export default function CollectionPage() {
    const { slug } = useParams();
    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const categoryId = slug ? slug.toString().split('-')[slug.toString().split('-').length-1] : ""
    const [totalProducts, setTotalProducts] = useState(0);
    const transformProduct = (apiProduct: ApiProduct): DisplayProduct => {
        const firstVariant = apiProduct.variants[0] ? apiProduct.variants[0] : null;
        const price = firstVariant?.price || 0;
        const originalPrice = price * 1.2;
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        return {
            id: apiProduct.id,
            name: apiProduct.name,
            images: apiProduct.images.map(img => img.url) || [],
            price,
            originalPrice,
            discount,
            rating: apiProduct.rating,
            saleEndsIn: apiProduct.saleEndsIn
        };
    };
    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                setLoading(true);
                const categoryData = await categoryApi.getCategoryById(categoryId);
                setCategory(categoryData);

                const productsResponse = await productApi.getProducts(1, 10, {
                    categoryId: categoryId
                });
                const transformedProducts = productsResponse.data.products.map(transformProduct);

                setProducts(transformedProducts);
                setTotalProducts(productsResponse.data.total);
            } catch (err) {
                setError('Failed to load collection');
                console.error('Error loading collection:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCategoryAndProducts();
        }
    }, [slug]);


    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='mx-14 my-5 flex flex-col gap-10 h-screen'>
            {loading ? (
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold">
                            Collections for "{category && category.name}"
                        </h1>
                        <p className="text-gray-600">
                            Found {totalProducts} products
                        </p>
                    </div>
                    <ProductGrid products={products} />
                </>
            )}
        </div>
    );
}