import Cart from "../entities/Cart";


export interface ICartService {

    getCartByUser(userId: string): Promise<Cart[]>

    addToCart(userId: string, variantId: string, quantity: number): Promise<void>

    updateCartItem(userId: string, variantId: string, quantity: number): Promise<void>

    removeCartItem(userId: string, variantId: string): Promise<void>

    clearCart(userId: string): Promise<void>

}
