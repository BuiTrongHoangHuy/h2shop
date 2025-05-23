import {Image, ProductVariant} from "@/services/api/productApi";

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
}