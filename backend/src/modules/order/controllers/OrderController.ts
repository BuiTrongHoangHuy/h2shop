import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import Order from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';
import { inject } from "inversify";
import { TYPES } from "../../../types";
import { IOrderService } from "../services/IOrderService";

export class OrderController {
    constructor(@inject(TYPES.IOrderService) private orderService: IOrderService) { }

    async createOrder(req: Request, res: Response) {
        const userId = req.user?.userId;
        const { totalPrice, details } = req.body;
        const order = new Order({ userId, totalPrice });
        const orderDetails = details.map((d: any) => new OrderDetail({ ...d }));
        const createdOrder = await this.orderService.createOrder(order, orderDetails);
        res.status(201).json({ status: 'success', data: createdOrder });
    }

    async getOrders(req: Request, res: Response) {
        const userId = req.user?.userId;
        const orders = await this.orderService.getOrdersByUser(userId);
        res.json({ status: 'success', data: orders });
    }

    async getAllOrders(req: Request, res: Response) {
        const orders = await this.orderService.getAllOrders();
        res.json({ status: 'success', data: orders });
    }

    async getOrder(req: Request, res: Response) {
        const { id } = req.params;
        const order = await this.orderService.getOrderById(id);
        if (!order) return res.status(404).json({ status: 'error', message: 'Order not found' });
        res.json({ status: 'success', data: order });
    }

    async getAllOrdersWithUserAndPayment(req: Request, res: Response) {
        const orders = await this.orderService.getAllOrdersWithUserAndPayment();
        res.json({ status: 'success', data: orders });
    }

    async updateOrderStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        await this.orderService.updateOrderStatus(id, status);
        res.json({ status: 'success' });
    }

    async hasUserPurchasedProduct(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { productId } = req.params;
            
            if (!userId) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'User not authenticated',
                    hasPurchased: false 
                });
            }

            const hasPurchased = await this.orderService.hasUserPurchasedProduct(userId, productId);
            res.json({ 
                status: 'success', 
                hasPurchased 
            });
        } catch (error) {
            console.error('Error checking purchase status:', error);
            res.status(500).json({ 
                status: 'error', 
                message: 'Failed to check purchase status',
                hasPurchased: false 
            });
        }
    }
}