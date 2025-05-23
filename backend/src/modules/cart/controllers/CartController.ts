import { Request, Response } from 'express';
import {inject} from "inversify";
import {TYPES} from "../../../types";
import {ICartService} from "../services/ICartService";

export class CartController {
    constructor(@inject(TYPES.ICartService) private readonly cartService: ICartService ) {}

    async getCart(req: Request, res: Response) {
        const userId = req.user?.userId ;
        const cart = await this.cartService.getCartByUser(userId);
        res.json({ status: 'success', data: cart });
    }

    async addToCart(req: Request, res: Response) {
        const userId = req.user?.userId ;
        console.log("userID",req.user?.userId);
        const { variantId, quantity } = req.body;
        await this.cartService.addToCart(userId, variantId, quantity);
        res.json({ status: 'success' });
    }

    async updateCartItem(req: Request, res: Response) {
        const userId = req.user?.userId ;
        const { variantId, quantity } = req.body;
        await this.cartService.updateCartItem(userId, variantId, quantity);
        res.json({ status: 'success' });
    }

    async removeCartItem(req: Request, res: Response) {
        const userId = req.user?.userId ;
        const { variantId } = req.body;
        await this.cartService.removeCartItem(userId, variantId);
        res.json({ status: 'success' });
    }

    async clearCart(req: Request, res: Response) {
        const userId = req.user?.userId ;
        await this.cartService.clearCart(userId);
        res.json({ status: 'success' });
    }
}