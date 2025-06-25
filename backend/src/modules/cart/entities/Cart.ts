import {DiscountProductResponse} from "../../discount/entities/Discount";

export interface CartProps {
    id?: string;
    userId: string;
    variantId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
    variant?: {
        id: string;
        color?: string;
        size?: string;
        price: number;
        discountedPrice?: number | null;
        stockQuantity: number;
        product: {
            id: string;
            name: string;
            description: string;
            images: { url: string }[];
            discount?: DiscountProductResponse | null;
        };
    };
}

class Cart {
    id?: string;
    userId: string;
    variantId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
    variant?: CartProps['variant'];

    constructor({ id, userId, variantId, quantity, createdAt, updatedAt, variant }: CartProps) {
        this.id = id;
        this.userId = userId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variant = variant;
    }
}

export default Cart;