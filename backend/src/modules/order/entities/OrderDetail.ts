export interface OrderDetailProps {
  id?: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class OrderDetail {
  id?: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, orderId, variantId, quantity, price, createdAt, updatedAt }: OrderDetailProps) {
    this.id = id;
    this.orderId = orderId;
    this.variantId = variantId;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default OrderDetail;