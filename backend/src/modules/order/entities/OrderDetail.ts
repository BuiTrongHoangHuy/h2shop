import {Image} from "../../../utils/image";

export interface OrderDetailProps {
  id?: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  image: Image;
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
  image: Image;
  sku?: string;
  color?: string;
  size?: string;
  variantPrice?: number;
  productId?: string;
  productName?: string;
  productDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, orderId, variantId, quantity, price, image,sku, color, size, variantPrice, productId, productName, productDescription, createdAt, updatedAt }: OrderDetailProps) {
    this.id = id;
    this.orderId = orderId;
    this.variantId = variantId;
    this.quantity = quantity;
    this.price = price;
    this.image = image;
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