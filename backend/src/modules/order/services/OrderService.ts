import { injectable, inject } from 'inversify';
import { IOrderRepository } from '../repositories/IOrderRepository';
import Order, {OrderDetailsDataResponse} from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';
import {IOrderService} from "./IOrderService";
import {TYPES} from "../../../types";

@injectable()
export class OrderService implements IOrderService{
    constructor(
        @inject(TYPES.IOrderRepository) private orderRepository: IOrderRepository
    ) {}

    createOrder(order: Order, details: OrderDetail[]): Promise<Order> {
        return this.orderRepository.createOrder(order, details);
    }

    getOrdersByUser(userId: string): Promise<OrderDetailsDataResponse[]> {
        return this.orderRepository.getOrdersByUser(userId);
    }

    getOrderById(orderId: string): Promise<OrderDetailsDataResponse | null> {
        return this.orderRepository.getOrderById(orderId);
    }

    updateOrderStatus(orderId: string, status: string): Promise<void> {
        return this.orderRepository.updateOrderStatus(orderId, status);
    }
}