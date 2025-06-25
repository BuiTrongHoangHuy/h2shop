import {TypeImage} from "@/types/typeImage";

/*
export interface Product {
    id: string;
    name: string;
    description: string;
    category?: {
        id: string;
        name: string;
    };
    price?: number;
    stock?: number;
    images?: Image[];
    variants?: ProductVariant[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}*/
export interface Product {
    id: string;
    name: string;
    description?: string;
    images?: { url: string }[];
    categoryId?: string;
    variants?: {
        id: string;
        color?: string;
        size?: string;
        price: number;
        stockQuantity: number;
        discountedPrice?: number;
    }[];
    createdAt?: string;
    updatedAt?: string;
    originalPrice?: number;
    rating?: {
        value: number;
        count: number;
    };
    saleEndsIn?: string;
    discount?: {
        id: string;
        name: string;
        value: number;
        discountType: 'Percentage' | 'Fixed Amount';
        startDate: string;
        endDate: string;
        status: number;
    };
}