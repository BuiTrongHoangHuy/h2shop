import { ProductVariant } from './productVariant'

export interface Product {
  id: string
  name: string
  description: string
  images: {url:string}[] | null
  category?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  variants?: ProductVariant[]
}