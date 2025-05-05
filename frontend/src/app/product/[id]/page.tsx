import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import ProductCard from '@/component/product/ProductCard';
import ReviewCard from '@/component/product/ReviewCard';

type Review = {
    rating: number;
    comment: string;
    user: string;
    date: string;
    purchasedItem: string;
};

// Dữ liệu mẫu
const mockProduct: Product = {
    id: '1',
    name: 'Embroidered Sun T-Shirt, Embroidered Sunshine Tee, Embroidered Boho Trendy T-Shirts for Men Women SUN-C-97 Comfort Color T-shirt',
    price: 544687,
    image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
    description:
        'It is all about the right color thread and you have the perfect minimalist Comfort Colors T-shirt. The wave t-shirt comes in a variety of colors.',
    images: [
        'https://i.etsystatic.com/41371150/c/2136/2136/176/20/il/ca3b6e/6536047923/il_75x75.6536047923_j8xe.jpg',
        'https://i.etsystatic.com/41371150/c/2136/2136/176/20/il/ca3b6e/6536047923/il_75x75.6536047923_j8xe.jpg',
        'https://i.etsystatic.com/41371150/r/il/4a6aa8/6412560403/il_75x75.6412560403_m81b.jpg',
        'https://i.etsystatic.com/41371150/r/il/8cd1e6/6307718530/il_75x75.6307718530_pfss.jpg',
    ],
    sizes: ['Small', 'Medium', 'Large'],
};

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
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '3',
        name: 'Embroidered crewneck wildflower',
        price: 123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '4',
        name: 'Bohemian maxi floral cotton dress',
        price: 112,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '5',
        name: 'Cat gallery t-shirt',
        price: 1233,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = mockProduct;
    const reviews = mockReviews;
    const recommendedProducts = mockRecommendedProducts;

    return (
        <div className=" mx-auto p-20 w-full h-full">
            <div className="grid grid-cols-2 gap-6 p-20">
                <div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            {product.images?.map((src, index) => (
                                <Image
                                    key={index}
                                    src={src}
                                    alt={`${product.name} thumbnail ${index}`}
                                    width={80}
                                    height={80}
                                    className="object-cover rounded"
                                />
                            ))}
                        </div>
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="object-cover rounded w-full"
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-2xl text-red-500">{product.price.toLocaleString()}đ</p>
                        <p className="text-gray-500 line-through">{(product.price * 1.2).toLocaleString()}đ</p>
                        <span className="bg-red-100 text-red-500 text-sm px-2 py-1 rounded">60% OFF</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Sale ends in 15:23:50</p>

                    <p className="text-gray-700 mt-4">{product.description}</p>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">T-SHIRT SIZE</label>
                        <select className="mt-1 block w-full p-2 border rounded">
                            <option>Select an option</option>
                            {product.sizes?.map((size) => (
                                <option key={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                        Add to cart
                    </button>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Item details</h3>
                        <p className="text-gray-600 mt-2">Materials: Cotton, polyester</p>
                        <p className="text-gray-600 mt-2">Embroidered BOHO SUNSHINE T-SHIRT</p>
                        <p className="text-gray-600 mt-2">{product.description}</p>
                        <a href="#" className="text-blue-500 mt-2 inline-block">Learn more about this item</a>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Shipping and return policies</h3>
                        <p className="text-gray-600 mt-2">Ships out within 3-4 business days</p>
                        <p className="text-gray-600 mt-2">Returns & exchanges not accepted</p>
                        <p className="text-gray-600 mt-2">Cost to ship: 100,000đ</p>
                    </div>
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
    );
}