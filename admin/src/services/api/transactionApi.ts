import axiosInstance from './axiosInstance';
export interface ApiOrderResponse {
    status: string;
    data: {
        order: {
            id: string;
            userId: string;
            totalPrice: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        };
        details: {
            id: string;
            orderId: string;
            variantId: string;
            quantity: number;
            price: string;
            image: { url: string };
            sku: string;
            color: string;
            size: string;
            variantPrice: string;
            productId: string;
            productName: string;
            productDescription: string;
            createdAt: string;
            updatedAt: string;
        }[];
        customer: {
            fullName: string;
            phone: string;
            address: string;
        };
        paymentStatus: string;
    }[];
}

export const fetchOrdersWithPayment = async (): Promise<ApiOrderResponse> => {
    const response = await axiosInstance.get('/order/all-with-user-and-payment');
    console.log('Response from fetchOrders:', response.data);
    return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/status`, { status });
    return response.data;
};