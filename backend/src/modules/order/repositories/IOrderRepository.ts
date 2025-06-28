import Order, { OrderDetailsDataResponse, OrderWithUserAndPayment } from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';

export interface IOrderRepository {
  createOrder(order: Order, details: OrderDetail[]): Promise<Order>;

  getOrdersByUser(userId: string): Promise<OrderDetailsDataResponse[]>;

  getAllOrders(): Promise<OrderDetailsDataResponse[]>;

  getAllOrdersWithUserAndPayment(): Promise<OrderWithUserAndPayment[]>;

  getOrderById(orderId: string): Promise<OrderDetailsDataResponse | null>;

  updateOrderStatus(orderId: string, status: string): Promise<void>;

  getOrderDetails(orderId: string): Promise<OrderDetail[]>

  hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean>;
}