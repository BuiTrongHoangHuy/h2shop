export interface OrderProps {
  id?: string;
  userId: string;
  totalPrice: number;
  status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
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