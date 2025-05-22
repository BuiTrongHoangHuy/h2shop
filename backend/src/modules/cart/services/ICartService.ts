import Cart from "../entities/Cart";


export interface ICartService {

    getCartByUser(userId: string): Promise<Cart[]>

    addToCart(userId: string, variantId: string, quantity: number): Promise<void>


}
