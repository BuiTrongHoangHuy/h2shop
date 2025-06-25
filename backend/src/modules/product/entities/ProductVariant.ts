// Base product variant properties
interface ProductVariantProps {
  id?: string | null;
  productId?: string | null;
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  stockQuantity?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  discountedPrice?: number | null;
}

// Interface for creating a new product variant
export interface CreateVariantData {
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
}

// Interface for product variant response
export interface ProductVariantResponse {
  id: string;
  productId: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  isInStock: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductVariant {
  id: string | null;
  productId: string | null;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  discountedPrice?: number | null;

  constructor({
    id = null,
    productId = null,
    sku = '',
    color = '',
    size = '',
    price = 0,
    stockQuantity = 0,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
    discountedPrice = null
  }: ProductVariantProps = {}) {
    this.id = id;
    this.productId = productId;
    this.sku = sku;
    this.color = color;
    this.size = size;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.discountedPrice = discountedPrice;
  }

  validate(): boolean {
    if (!this.productId) {
      throw new Error('Product ID is required');
    }
    
    if (!this.sku || this.sku.trim().length === 0) {
      throw new Error('SKU is required');
    }
    
    if (this.price <= 0) {
      throw new Error('Price must be greater than zero');
    }
    
    if (this.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    
    return true;
  }

  isInStock(): boolean {
    return this.stockQuantity > 0;
  }

  reduceStock(quantity: number): number {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    
    if (this.stockQuantity < quantity) {
      throw new Error('Not enough stock available');
    }
    
    this.stockQuantity -= quantity;
    this.updatedAt = new Date();
    return this.stockQuantity;
  }

  increaseStock(quantity: number): number {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    
    this.stockQuantity += quantity;
    this.updatedAt = new Date();
    return this.stockQuantity;
  }

  toResponse(): ProductVariantResponse {
    return {
      id: this.id!,
      productId: this.productId!,
      sku: this.sku,
      color: this.color,
      size: this.size,
      price: this.price,
      stockQuantity: this.stockQuantity,
      isInStock: this.isInStock(),
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default ProductVariant; 