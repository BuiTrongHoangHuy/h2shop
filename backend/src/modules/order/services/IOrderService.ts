import Order, {OrderDetailsDataResponse} from "../entities/Order";
import OrderDetail from "../entities/OrderDetail";

export interface IOrderService {

    createOrder(order: Order, details: OrderDetail[]): Promise<Order>

    getOrdersByUser(userId: string): Promise<OrderDetailsDataResponse[]>


}