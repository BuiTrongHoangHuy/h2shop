export interface ProductVariant {
  id: number
  productId: number
  sku: string
  color: string
  size: string
  image?: string
  price: number
  stockQuantity: number
  created_at: string;
  updated_at: string;
}
