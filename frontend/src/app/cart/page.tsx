'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import cartApi, { CartItem } from '@/services/api/cartApi';
import orderApi from '@/services/api/orderApi';
import paymentApi from '@/services/api/paymentApi';
import { toast } from 'react-toastify';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartApi.getCart();
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (variantId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            setUpdating(variantId);
            await cartApi.updateCartItem(variantId, newQuantity);
            await fetchCart(); // Refresh cart after update
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (variantId: string) => {
        try {
            await cartApi.removeCartItem(variantId);
            await fetchCart(); // Refresh cart after removal
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
            console.error('Error removing item:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await cartApi.clearCart();
            setCartItems([]);
            toast.success('Cart cleared successfully');
        } catch (error) {
            toast.error('Failed to clear cart');
            console.error('Error clearing cart:', error);
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            setCheckingOut(true);
            const totalPrice = calculateTotal();
            const orderDetails = cartItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.variant?.price || 0
            }));

            // Create order
            const orderResponse = await orderApi.createOrder(totalPrice, orderDetails);
            const orderId = orderResponse.data.id;

            // Create payment URL
            const paymentResponse = await paymentApi.createPaymentUrl(orderId, totalPrice);
            const paymentUrl = paymentResponse.data.paymentUrl;

            // Clear cart after successful order
            await cartApi.clearCart();
            setCartItems([]);
            
            // Redirect to payment page
            window.location.href = paymentUrl;
        } catch (error) {
            toast.error('Failed to process checkout');
            console.error('Error processing checkout:', error);
        } finally {
            setCheckingOut(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.variant?.price || 0) * item.quantity;
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                        <Link
                            href="/"
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 py-4 border-b last:border-b-0"
                                    >
                                        <div className="relative w-24 h-24">
                                            <Image
                                                src={item.variant?.product.images[0]?.url || '/placeholder-product.png'}
                                                alt={item.variant?.product.name || 'Product'}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link 
                                                href={`/product/${item.variant?.product.id}`}
                                                className="font-medium hover:text-orange-500"
                                            >
                                                {item.variant?.product.name}
                                            </Link>
                                            <p className="text-sm text-gray-600">
                                                {item.variant?.color && `Color: ${item.variant.color}`}
                                                {item.variant?.size && ` | Size: ${item.variant.size}`}
                                            </p>
                                            <p className="text-gray-600">
                                                {item.variant?.price.toLocaleString()} VND
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                                                    disabled={updating === item.variantId}
                                                    className="p-1 border rounded hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                                                    disabled={updating === item.variantId || item.quantity >= (item.variant?.stockQuantity || 0)}
                                                    className="p-1 border rounded hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.variantId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{calculateTotal().toLocaleString()} VND</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>{calculateTotal().toLocaleString()} VND</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={checkingOut}
                                            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium
                                            hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {checkingOut ? 'Processing...' : 'Place Order'}
                                        </button>
                                        <button
                                            onClick={handleClearCart}
                                            className="w-full text-gray-600 py-3 px-6 rounded-lg font-medium
                                            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Clear Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}