import Order, {OrderDetailsDataResponse} from '../entities/Order';
import OrderDetail from '../entities/OrderDetail';

export interface IOrderRepository {
  createOrder(order: Order, details: OrderDetail[]): Promise<Order>;


}