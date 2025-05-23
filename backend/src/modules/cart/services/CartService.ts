import { injectable, inject } from 'inversify';
import { ICartRepository } from '../repositories/ICartRepository';
import Cart from '../entities/Cart';
import {TYPES} from "../../../types";
import {ICartService} from "./ICartService";

@injectable()
export class CartService implements ICartService{
    constructor(
        @inject(TYPES.ICartRepository) private cartRepository: ICartRepository
    ) {}

    getCartByUser(userId: string): Promise<Cart[]> {
        return this.cartRepository.getCartByUser(userId);
    }

    addToCart(userId: string, variantId: string, quantity: number): Promise<void> {
        return this.cartRepository.addToCart(userId, variantId, quantity);
    }

    updateCartItem(userId: string, variantId: string, quantity: number): Promise<void> {
        return this.cartRepository.updateCartItem(userId, variantId, quantity);
    }

    removeCartItem(userId: string, variantId: string): Promise<void> {
        return this.cartRepository.removeCartItem(userId, variantId);
    }

    clearCart(userId: string): Promise<void> {
        return this.cartRepository.clearCart(userId);
    }
}