import { Request, Response } from 'express';
import {inject} from "inversify";
import {TYPES} from "../../../types";
import {ICartService} from "../services/ICartService";
import { AppError } from '../../../utils/AppError';

export class CartController {
    constructor(@inject(TYPES.ICartService) private readonly cartService: ICartService ) {}

    async getCart(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const cart = await this.cartService.getCartByUser(userId);
            res.json({ status: 'success', data: cart });
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ status: 'error', message: 'Failed to get cart' });
        }
    }

    async getCartWithDiscount(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const cart = await this.cartService.getCartByUserWithDiscount(userId);
            res.json({ status: 'success', data: cart });
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ status: 'error', message: 'Failed to get cart' });
        }
    }

    async addToCart(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { variantId, quantity } = req.body;
            await this.cartService.addToCart(userId, variantId, quantity);
            res.json({ status: 'success', message: 'Item added to cart successfully' });
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ status: 'error', message: error.message });
            } else {
                res.status(500).json({ status: 'error', message: 'Failed to add item to cart' });
            }
        }
    }

    async updateCartItem(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { variantId, quantity } = req.body;
            await this.cartService.updateCartItem(userId, variantId, quantity);
            res.json({ status: 'success', message: 'Cart item updated successfully' });
        } catch (error) {
            console.error('Error updating cart item:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ status: 'error', message: error.message });
            } else {
                res.status(500).json({ status: 'error', message: 'Failed to update cart item' });
            }
        }
    }

    async removeCartItem(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { variantId } = req.body;
            await this.cartService.removeCartItem(userId, variantId);
            res.json({ status: 'success', message: 'Item removed from cart successfully' });
        } catch (error) {
            console.error('Error removing cart item:', error);
            res.status(500).json({ status: 'error', message: 'Failed to remove item from cart' });
        }
    }

    async clearCart(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            await this.cartService.clearCart(userId);
            res.json({ status: 'success', message: 'Cart cleared successfully' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ status: 'error', message: 'Failed to clear cart' });
        }
    }
}