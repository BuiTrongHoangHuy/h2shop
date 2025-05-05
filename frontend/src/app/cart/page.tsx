'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types/product';
import {CartItem} from "@/types/cartItem";
import ProductCard from '@/component/product/ProductCard';

const mockCartItems: CartItem[] = [
    {
        productId: '1',
        name: 'Sea Animal 90s Retro T-Shirt, Ocean Nature Shirt',
        price: 12312,
        quantity: 1,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        color: 'Natural',
        size: 'M',
    },
];

const mockRecommendedProducts: Product[] = [
    {
        id: '2',
        name: 'Sea Creatures Retro 90s T-Shirt',
        price: 123123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '3',
        name: 'Ocean Nature T-Shirt, Vintage 90s',
        price: 123123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '4',
        name: 'Comfort Colors® Vintage 90s Tattoo',
        price: 123123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '5',
        name: '90s Tattoo Sea Animal T-Shirt',
        price: 123123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '6',
        name: 'Marine Wildlife T-Shirt, Ocean Illustration',
        price: 1231,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '7',
        name: 'Vintage Fish Tattoo Style T-Shirt',
        price: 123123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '8',
        name: 'Three Orcas Vintage 90s Graphic Shirt',
        price: 123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '9',
        name: 'Three Sharks Vintage Graphic T-Shirt',
        price: 123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '10',
        name: 'Frog Musicians 90s Retro Shirt',
        price: 123,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
    {
        id: '11',
        name: 'Sea Animals Vintage Sweatshirt',
        price: 213,
        image: 'https://i.etsystatic.com/41371150/r/il/9a9409/6714688102/il_1588xN.6714688102_8825.jpg',
        description: '',
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(mockCartItems);

    const handleRemoveItem = (productId: string) => {
        setCartItems(cartItems.filter((item) => item.productId !== productId));
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems(
            cartItems.map((item) =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 123;
    const shipping = 123;
    const total = subtotal - discount + shipping;

    return (
        <>
            {/* Inject style để ghi đè CSS reset */}
            <style>{`
        div, p {
          margin: revert !important;
          padding: revert !important;
        }
      `}</style>

            <div className="mx-auto p-8 w-full">
                <h1 className="text-3xl font-bold mb-6">Your cart</h1>

                <div className="flex flex-wrap gap-8">
                    {/* Danh sách sản phẩm trong giỏ hàng */}
                    <div className="flex-1">
                        {cartItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex gap-4 p-4 border border-gray-200 rounded mb-4"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={150}
                                    height={150}
                                    className="object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">{item.name}</h3>
                                    <p className="text-gray-600">Color: {item.color} | Size: {item.size}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                            className="border rounded-full w-8 h-8 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                            className="border rounded-full w-8 h-8 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.productId)}
                                        className="text-red-500 mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-green-600">
                                        {item.price.toLocaleString()}đ
                                    </p>
                                    <p className="text-gray-500 line-through">
                                        {(item.price * 1.2).toLocaleString()}đ (33% OFF)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phần thanh toán */}
                    <div className="w-full md:w-80 p-4 border border-gray-200 rounded">
                        <h2 className="text-xl font-semibold mb-4">How you'll pay</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                            {/*<div className="flex gap-2">
                                <Image src="/visa.png" alt="Visa" width={30} height={20} />
                                <Image src="/mastercard.png" alt="Mastercard" width={30} height={20} />
                                <Image src="/paypal.png" alt="Paypal" width={30} height={20} />
                            </div>*/}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Item(s) total</span>
                                <span>{subtotal.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Shop discount</span>
                                <span>-{discount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{(subtotal - discount).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total (1 item)</span>
                                <span>{total.toLocaleString()}đ</span>
                            </div>
                        </div>
                        <Link href="/checkout">
                            <button className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800">
                                Proceed to checkout
                            </button>
                        </Link>
                        <button className="w-full flex items-center justify-center gap-2 border rounded py-2 mt-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-6-6m0 0l6-6m-6 6h12" />
                            </svg>
                            Apply coupon code
                        </button>
                    </div>
                </div>

                {/* Sản phẩm gợi ý */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-green-800">Related items you may like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {mockRecommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}