'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import orderApi from '@/services/api/orderApi';
import { toast } from 'react-toastify';
import {TypeImage} from "@/types/typeImage";

interface Order {
    order: {
        id: string;
        totalPrice: number;
        status: string;
        createdAt: string;
    };
    details: Array<{
        id: string;
        variantId: string;
        quantity: number;
        price: number;
        sku: string;
        image: TypeImage;
        color: string;
        size: string;
        productId: string;
        productName: string;
        productDescription: string;
    }>;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrders();
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders found</h2>
                        <Link
                            href="/"
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.order.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Order #{order.order.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order.status)}`}>
                                                {order.order.status}
                                            </span>
                                            <span className="text-lg font-semibold">
                                                {Number(order.order.totalPrice).toLocaleString()} VND
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.details.map((detail) => (
                                            <div key={detail.id} className="flex items-center gap-4">
                                                <div className="relative w-20 h-20">
                                                    <Image
                                                        src={detail.image.url || "/placeholder-product.png"}
                                                        alt={detail.productName}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{detail.productName}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {detail.color && `Color: ${detail.color}`}
                                                        {detail.size && ` | Size: ${detail.size}`}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {detail.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {(detail.price * detail.quantity).toLocaleString()} VND
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Link
                                            href={`/orders/${order.order.id}`}
                                            className="text-orange-500 hover:text-orange-600 font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 