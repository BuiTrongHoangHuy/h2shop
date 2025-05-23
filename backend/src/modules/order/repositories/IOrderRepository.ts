import Order, {OrderDetailsDataResponse} from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';

export interface IOrderRepository {
  createOrder(order: Order, details: OrderDetail[]): Promise<Order>;

  getOrdersByUser(userId: string): Promise<OrderDetailsDataResponse[]>;

  getOrderById(orderId: string): Promise<OrderDetailsDataResponse | null>;

  updateOrderStatus(orderId: string, status: string): Promise<void>;

  getOrderDetails(orderId: string): Promise<OrderDetail[]>
}