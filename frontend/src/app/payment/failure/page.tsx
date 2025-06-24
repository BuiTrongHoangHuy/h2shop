'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('vnp_TxnRef');
    const errorCode = searchParams.get('vnp_ResponseCode');
    const errorMessage = searchParams.get('vnp_Message');

    const getErrorMessage = () => {
        if (errorCode === '24') {
            return 'Customer cancelled the transaction.';
        } else if (errorCode === '51') {
            return 'Insufficient balance in your account.';
        } else if (errorMessage) {
            return errorMessage;
        }
        return 'An error occurred while processing your payment.';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <XCircle className="h-16 w-16 text-red-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Payment Failed
                </h1>
                
                <p className="text-gray-600 mb-6">
                    {getErrorMessage()}
                    {/*{orderId && (
                        <span className="block mt-2">
                            Order ID: <span className="font-medium">{orderId}</span>
                        </span>
                    )}*/}
                </p>

                <div className="space-y-4">
                    <Link
                        href="/cart"
                        className="block w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium
                        hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Return to Cart
                    </Link>
                    
                    <Link
                        href="/"
                        className="block w-full text-gray-600 py-3 px-6 rounded-lg font-medium
                        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
} 