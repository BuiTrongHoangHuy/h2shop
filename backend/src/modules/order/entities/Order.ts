import User from "../../user/entities/User";
import OrderDetail from "./OrderDetail";

export interface OrderProps {
  id?: string;
  userId: string;
  totalPrice: number;
  status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDetailsDataResponse {
  order: Order,
  details: OrderDetail[]
}

export interface OrderWithUserAndPayment extends OrderDetailsDataResponse {
  customer: User;
  paymentStatus: string;
}

class Order {
  id?: string;
  userId: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, userId, totalPrice, status = 'Pending', createdAt, updatedAt }: OrderProps) {
    this.id = id;
    this.userId = userId;
    this.totalPrice = totalPrice;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Order;