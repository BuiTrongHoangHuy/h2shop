export interface CartProps {
    id?: string;
    userId: string;
    variantId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Cart {
    id?: string;
    userId: string;
    variantId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor({ id, userId, variantId, quantity, createdAt, updatedAt }: CartProps) {
        this.id = id;
        this.userId = userId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Cart;