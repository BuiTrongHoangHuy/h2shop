"use client"

import { Button } from "@/components/ui/button"
import { Category, Product, ProductVariant } from "@/types"
import { Package, Palette, Ruler } from "lucide-react"

interface ProductDetailProps {
  product: Product
  onUpdate: () => void
  onDelete: () => void
  categories: Category[]
  variants: ProductVariant[]
}

export default function ProductDetail({ product, onUpdate, onDelete, categories, variants }: ProductDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " ₫"
  }

  const getCategoryInfo = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category || { name: "Unknown", description: "" }
  }

  const getProductVariants = () => {
    return variants.filter((variant) => variant.productId === product.id)
  }

  const getTotalStock = () => {
    const productVariants = getProductVariants()
    return productVariants.reduce((total, variant) => total + variant.stockQuantity, 0)
  }

  const getMinMaxPrice = () => {
    const productVariants = getProductVariants()
    if (productVariants.length === 0) return { min: 0, max: 0 }

    const prices = productVariants.map((v) => v.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }

  const categoryInfo = getCategoryInfo(product.category_id)
  const productVariants = getProductVariants()
  const priceRange = getMinMaxPrice()

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">Product Information</h3>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-blue-600">{product.name}</h2>

        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
          <div className="text-center text-gray-400">
            {product.images ? (
              <img
                src={product.images || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <>
                <Package className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                <span className="text-sm">No image</span>
              </>
            )}
          </div>
        </div>

        {/* Product Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Product ID:</div>
            <div className="font-medium">{product.id}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Total Variants:</div>
            <div className="font-medium text-blue-600">{productVariants.length}</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-600 mb-1">Product Name:</div>
            <div className="font-medium">{product.name}</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-600 mb-1">Description:</div>
            <div className="font-medium text-sm leading-relaxed">{product.description}</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-600 mb-1">Category:</div>
            <div className="font-medium">{categoryInfo.name}</div>
            <div className="text-xs text-gray-500">{categoryInfo.description}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Total Stock:</div>
            <div className="font-medium text-green-600">{getTotalStock()}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Price Range:</div>
            <div className="font-medium text-orange-600">
              {priceRange.min === priceRange.max
                ? formatPrice(priceRange.min)
                : `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`}
            </div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Created:</div>
            <div className="font-medium text-xs">{formatDate(product.created_at)}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Updated:</div>
            <div className="font-medium text-xs">{formatDate(product.updated_at)}</div>
          </div>
        </div>

        {/* Product Variants */}
        <div>
          <div className="text-gray-600 mb-3 font-medium">Product Variants ({productVariants.length}):</div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {productVariants.map((variant) => (
              <div key={variant.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{variant.sku}</div>
                  <div className="text-sm font-medium text-orange-600">{formatPrice(variant.price)}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <Palette className="h-3 w-3 mr-1 text-gray-400" />
                    <span>{variant.color}</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-3 w-3 mr-1 text-gray-400" />
                    <span>{variant.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-3 w-3 mr-1 text-gray-400" />
                    <span className={variant.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
                      {variant.stockQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(variant.created_at)}</span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      variant.stockQuantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {variant.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2">
        <Button onClick={onUpdate} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Update
        </Button>
        <Button onClick={onDelete} variant="destructive" className="w-full text-white bg-red-500 hover:bg-red-600">
          Delete
        </Button>
      </div>
    </div>
  )
}
