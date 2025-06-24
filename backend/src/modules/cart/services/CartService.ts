import { injectable, inject } from 'inversify';
import { ICartRepository } from '../repositories/ICartRepository';
import Cart from '../entities/Cart';
import {TYPES} from "../../../types";
import {ICartService} from "./ICartService";
import { AppError } from '../../../utils/AppError';

@injectable()
export class CartService implements ICartService{
    constructor(
        @inject(TYPES.ICartRepository) private cartRepository: ICartRepository
    ) {}

    getCartByUser(userId: string): Promise<Cart[]> {
        return this.cartRepository.getCartByUser(userId);
    }

    async addToCart(userId: string, variantId: string, quantity: number): Promise<void> {
        // Get current cart items to check existing quantity
        const cartItems = await this.cartRepository.getCartByUser(userId);
        const existingItem = cartItems.find(item => item.variantId === variantId);
        
        if (!existingItem?.variant) {
            return this.cartRepository.addToCart(userId, variantId, quantity);
        }
        
        const totalQuantity = (existingItem?.quantity || 0) + quantity;
        
        if (totalQuantity > existingItem.variant.stockQuantity) {
            throw new AppError(`Only ${existingItem.variant.stockQuantity} items available in stock`, 400);
        }

    }

    async updateCartItem(userId: string, variantId: string, quantity: number): Promise<void> {
        // Get current cart items to check stock
        const cartItems = await this.cartRepository.getCartByUser(userId);
        const item = cartItems.find(item => item.variantId === variantId);
        
        if (!item) {
            throw new AppError('Item not found in cart', 404);
        }

        if (!item.variant) {
            throw new AppError('Product variant not found', 404);
        }

        // Check if requested quantity exceeds stock
        if (quantity > item.variant.stockQuantity) {
            throw new AppError(`Only ${item.variant.stockQuantity} items available in stock`, 400);
        }

        return this.cartRepository.updateCartItem(userId, variantId, quantity);
    }

    removeCartItem(userId: string, variantId: string): Promise<void> {
        return this.cartRepository.removeCartItem(userId, variantId);
    }

    clearCart(userId: string): Promise<void> {
        return this.cartRepository.clearCart(userId);
    }
}