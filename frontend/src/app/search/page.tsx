"use client";
import { RelatedList } from '@/component/search/related_section/RelatedList';
import { ProductGrid } from '@/component/search/result_section/ProductGrid';
import { useSearchParams } from 'next/navigation';

export default function Search() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const products = [
        {
            id: "1",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
        {
            id: "2",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
        {
            id: "3",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
        {
            id: "4",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
        {
            id: "5",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
        {
            id: "6",
            name: "Funny Cowboy Frog Shirt Western Resist",
            images: ["/assets/images/product.png"],
            price: 371.088,
            originalPrice: 530.239,
            discount: 30,
            rating: {
                value: 4.9,
                count: 369,
            },
            saleEndsIn: "9 hours",
        },
    ]

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
    ]

    return (
        <div className='mx-14 my-5 flex flex-col gap-10'>
            <ProductGrid products={products} />

            <RelatedList searches={relatedSearches} />
        </div>
    );
}