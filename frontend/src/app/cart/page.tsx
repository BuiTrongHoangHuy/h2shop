'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import cartApi, { CartItem } from '@/services/api/cartApi';
import orderApi from '@/services/api/orderApi';
import paymentApi from '@/services/api/paymentApi';
import userApi, { User } from '@/services/api/userApi';
import { toast } from 'react-toastify';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadCart();
        loadUserProfile();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await cartApi.getCartWithDiscount();
            setCartItems(response.data);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserProfile = async () => {
        try {
            const response = await userApi.getProfile();
            if (response.success && response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const handleUpdateQuantity = async (variantId: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            setUpdating(variantId);
            await cartApi.updateCartItem(variantId, quantity);
            loadCart(); // Reload cart to get updated data
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (variantId: string) => {
        try {
            await cartApi.removeCartItem(variantId);
            loadCart(); // Reload cart to get updated data
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
            //toast.success('Cart cleared successfully');
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
        // Check user phone and address
        if (!user || !user.phone || !user.address) {
            toast.error('Please update your phone number and address in your profile before placing an order.');
            return;
        }
        try {
            setCheckingOut(true);
            const totalPrice = calculateTotalPrice();
            const orderDetails = cartItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.variant?.discountedPrice || item.variant?.price|| 0
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

    const calculateItemPrice = (item: CartItem) => {
        if (!item.variant) return 0;
        const price = item.variant.discountedPrice || item.variant.price;
        return price * item.quantity;
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + calculateItemPrice(item), 0);
    };

    const calculateTotalSavings = () => {
        return cartItems.reduce((total, item) => {
            if (!item.variant) return total;
            const originalPrice = item.variant.price * item.quantity;
            const discountedPrice = calculateItemPrice(item);
            return total + (originalPrice - discountedPrice);
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-140px)] items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex h-[calc(100vh-140px)] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started!</p>
                    <a
                        href="/"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors"
                    >
                        Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items ({cartItems.length})</h2>
                            
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-6">
                                        {item.variant?.product.images && item.variant.product.images.length > 0 && (
                                            <img
                                                src={item.variant.product.images[0].url}
                                                alt={item.variant.product.name}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        )}
                                        
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{item.variant?.product.name}</h3>
                                            <p className="text-sm text-gray-600">{item.variant?.product.description}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                {item.variant?.color && (
                                                    <span className="text-sm text-gray-500">Color: {item.variant.color}</span>
                                                )}
                                                {item.variant?.size && (
                                                    <span className="text-sm text-gray-500">Size: {item.variant.size}</span>
                                                )}
                                            </div>
                                            
                                            {/* Discount Badge */}
                                            {item.variant?.product.discount && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {item.variant.product.discount.discountType === 'Percentage' 
                                                            ? `${item.variant.product.discount.value}% OFF`
                                                            : `$${item.variant.product.discount.value} OFF`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-right">
                                            {/* Price Display */}
                                            <div className="space-y-1">
                                                {item.variant?.discountedPrice && item.variant.discountedPrice < item.variant.price ? (
                                                    <div>
                                                        <span className="text-lg font-semibold text-green-600">
                                                            {item.variant.discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            {item.variant.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {item.variant?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                                                    disabled={updating === item.variantId}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                                                    disabled={updating === item.variantId}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            {/* Item Total */}
                                            <div className="mt-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    Total: {calculateItemPrice(item).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </span>
                                            </div>
                                            
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.variantId)}
                                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-900">{calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </div>
                            
                            {calculateTotalSavings() > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-green-600">Total Savings:</span>
                                    <span className="text-green-600 font-semibold">-{calculateTotalSavings().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            )}
                            
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-semibold text-gray-900">{calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                            >
                                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                            
                            <button
                                onClick={handleClearCart}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors"
                            >
                                Clear Cart
                            </button>
                            
                            <a
                                href="/"
                                className="block w-full text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}