'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import orderApi from '@/services/api/orderApi';
import paymentApi from '@/services/api/paymentApi';
import { toast } from 'react-toastify';
import {TypeImage} from "@/types/typeImage";

interface OrderDetail {
    id: string;
    variantId: string;
    quantity: number;
    price: number;
    image: TypeImage;
    sku: string;
    color: string;
    size: string;
    productId: string;
    productName: string;
    productDescription: string;
}

interface Payment {
    id: number;
    orderId: number;
    userId: number;
    amount: number;
    paymentMethod: string;
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: string;
    updatedAt: string;
}

interface Order {
    order: {
        id: string;
        totalPrice: number;
        status: string;
        createdAt: string;
    };
    details: OrderDetail[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrder();
        fetchPayment();
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrderById(params.id);
            setOrder(response.data);
        } catch (error) {
            toast.error('Failed to fetch order details');
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayment = async () => {
        try {
            const response = await paymentApi.getPaymentByOrderId(params.id);
            setPayment(response.data);
        } catch (error) {
            console.error('Error fetching payment:', error);
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

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
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
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
                    <Link
                        href="/orders"
                        className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Order Details</h1>
                    <Link
                        href="/orders"
                        className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Back to Orders
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Order #{order.order.id}
                                </h2>
                                <p className="text-gray-600">
                                    Placed on {new Date(order.order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.order.status)}`}>
                                    {order.order.status}
                                </span>
                                <span className="text-xl font-semibold">
                                    {order.order.totalPrice.toLocaleString()} VND
                                </span>
                            </div>
                        </div>

                        {payment && (
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-medium">{payment.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Amount Paid</p>
                                        <p className="font-medium">{payment.amount.toLocaleString()} VND</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Date</p>
                                        <p className="font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                            <div className="space-y-6">
                                {order.details.map((detail) => (
                                    <div key={detail.id} className="flex items-center gap-6">
                                        <div className="relative w-24 h-24">
                                            <Image
                                                src={detail.image.url || "/placeholder-product.png"}
                                                alt={detail.productName}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${detail.productId}`}
                                                className="font-medium hover:text-orange-500"
                                            >
                                                {detail.productName}
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {detail.color && `Color: ${detail.color}`}
                                                {detail.size && ` | Size: ${detail.size}`}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                SKU: {detail.sku}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                {detail.price.toLocaleString()} VND x {detail.quantity}
                                            </p>
                                            <p className="font-medium mt-1">
                                                {(detail.price * detail.quantity).toLocaleString()} VND
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Total Amount</h3>
                                <span className="text-2xl font-bold">
                                    {order.order.totalPrice.toLocaleString()} VND
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 