import {Image} from "@/types/image";

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
    }[];
    createdAt?: string;
    updatedAt?: string;
    originalPrice?: number;
    discount?: number;
    rating?: {
        value: number;
        count: number;
    };
    saleEndsIn?: string;
}