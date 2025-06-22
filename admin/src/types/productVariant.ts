export interface ProductVariant {
  id: string
  productId: string
  sku: string
  color: string
  size: string
  image?: { url:string }
  price: number
  stockQuantity: number
  createdAt: string;
  updatedAt: string;
}
