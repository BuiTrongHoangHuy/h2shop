"use client";
import { useState, useEffect } from 'react';
import { RelatedList } from '@/component/search/related_section/RelatedList';
import { ProductGrid } from '@/component/search/result_section/ProductGrid';
import { useSearchParams } from 'next/navigation';
import { productApi, Product as ApiProduct } from '@/services/api/productApi';
import { toast } from 'react-toastify';

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

export default function Search() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [searchQuery]);

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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getProducts(1, 10, {
                search: searchQuery
            });
            console.log(response);

            const transformedProducts = response.data.products.map(transformProduct);
            setProducts(transformedProducts);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const relatedSearches = [
        {
            id: "1",
            label: "shirt bombshell",
            image: "/assets/images/related.png",
            url: "#shirt-bombshell",
        },
        {
            id: "2",
            label: "shirt for women",
            image: "/assets/images/related.png",
            url: "#shirt-for-women",
        },
        {
            id: "3",
            label: "shirt cloud 9",
            image: "/assets/images/related.png",
            url: "#shirt-cloud-9",
        },
        {
            id: "4",
            label: "shirt png",
            image: "/assets/images/related.png",
            url: "#shirt-png",
        },
        {
            id: "5",
            label: "shirt mockup",
            image: "/assets/images/related.png",
            url: "#shirt-mockup",
        },
        {
            id: "6",
            label: "shirt men",
            image: "/assets/images/related.png",
            url: "#shirt-men",
        },
        {
            id: "7",
            label: "shirt hiki t-shirt",
            image: "/assets/images/related.png",
            url: "#shirt-hiki-t-shirt",
        },
    ];

    return (
        <div className='mx-14 my-5 flex flex-col gap-10'>
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
                            Search Results for "{searchQuery}"
                        </h1>
                        <p className="text-gray-600">
                            Found {totalProducts} products
                        </p>
                    </div>
                    <ProductGrid products={products} />
                </>
            )}

            <RelatedList searches={relatedSearches} />
        </div>
    );
}