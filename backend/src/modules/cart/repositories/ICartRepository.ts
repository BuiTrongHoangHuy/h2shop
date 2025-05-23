import Cart from '../entities/Cart';

export interface ICartRepository {
    getCartByUser(userId: string): Promise<Cart[]>;
    addToCart(userId: string, variantId: string, quantity: number): Promise<void>;
    updateCartItem(userId: string, variantId: string, quantity: number): Promise<void>;

}