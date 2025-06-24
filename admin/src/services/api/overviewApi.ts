import axiosInstance from './axiosInstance';
export interface Order {
    id: string;
    userId: string;
    totalPrice: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderDetail {
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
}

export interface OrderResponse {
    order: Order;
    details: OrderDetail[];
}

export const fetchOrders = async (): Promise<OrderResponse[]> => {
    const response = await axiosInstance.get('/order/all');
    return response.data.data;
};