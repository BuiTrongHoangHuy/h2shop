export interface OrderDetailProps {
  id?: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  // Variant info
  sku?: string;
  color?: string;
  size?: string;
  variantPrice?: number;
  // Product info
  productId?: string;
  productName?: string;
  productDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class OrderDetail {
  id?: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  sku?: string;
  color?: string;
  size?: string;
  variantPrice?: number;
  productId?: string;
  productName?: string;
  productDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, orderId, variantId, quantity, price, sku, color, size, variantPrice, productId, productName, productDescription, createdAt, updatedAt }: OrderDetailProps) {
    this.id = id;
    this.orderId = orderId;
    this.variantId = variantId;
    this.quantity = quantity;
    this.price = price;
    this.sku = sku;
    this.color = color;
    this.size = size;
    this.variantPrice = variantPrice;
    this.productId = productId;
    this.productName = productName;
    this.productDescription = productDescription;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default OrderDetail;