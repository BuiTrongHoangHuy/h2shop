"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Plus, Trash2, Package, Loader2 } from "lucide-react"
import { Category, Product, ProductVariant } from "@/types"
import uploadApi from "@/services/api/uploadApi"

interface ProductVariantForm {
  id: string
  sku: string
  color: string
  size: string
  price: number
  stockQuantity: number
  image?: { url: string } | null
  isNew?: boolean
}

interface UpdateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (productData: {
    id: string
    name: string
    description: string
    images: string[]
    categoryId: string
    variants: ProductVariantForm[]
  }) => void
  categories: Category[]
  product: Product
  variants: ProductVariant[]
}

export default function UpdateProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
  variants,
}: UpdateProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    categoryId: "0",
  })

  const [productVariants, setProductVariants] = useState<ProductVariantForm[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        images: product.images?.map(img => img.url) || [],
        categoryId: product.category?.id.toString() || "0",
      })

      // Pre-populate variants
      const existingVariants = variants
        .filter((v) => v.productId === product.id)
        .map((v) => ({
          id: v.id.toString(),
          originalId: v.id,
          sku: v.sku,
          color: v.color,
          size: v.size,
          price: Math.round(v.price),
          stockQuantity: v.stockQuantity,
          image: null,
          isNew: false,
        }))

      setProductVariants(existingVariants.length > 0 ? existingVariants : [createNewVariant()])
    }
  }, [product, variants])

  if (!isOpen) return null

  const createNewVariant = (): ProductVariantForm => ({
    id: Date.now().toString(),
    sku: "",
    color: "",
    size: "",
    price: 0,
    stockQuantity: 0,
    image: null,
    isNew: true,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = files.filter(file => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)

    if (validFiles.length > 0) {
      setIsUploading(true)
      setErrors((prev) => ({ ...prev, images: "" }))

      try {
        const uploadPromises = validFiles.map(uploadApi.uploadImage)
        const newImageUrls = await Promise.all(uploadPromises)
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }))
      } catch (error) {
        setErrors(prev => ({ ...prev, images: "Image upload failed." }))
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    setProductVariants((prev) =>
      prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant)),
    )
  }

  const addVariant = () => {
    setProductVariants((prev) => [...prev, createNewVariant()])
  }

  const removeVariant = (variantId: string) => {
    if (productVariants.length > 1) {
      setProductVariants((prev) => prev.filter((variant) => variant.id !== variantId))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.categoryId === "0") {
      newErrors.categoryId = "Please select a category"
    }

    // Validate variants
    productVariants.forEach((variant, index) => {
      if (!variant.sku.trim()) {
        newErrors[`variant_${index}_sku`] = "SKU is required"
      }
      if (!variant.color.trim()) {
        newErrors[`variant_${index}_color`] = "Color is required"
      }
      if (!variant.size.trim()) {
        newErrors[`variant_${index}_size`] = "Size is required"
      }
      if (variant.price <= 0) {
        newErrors[`variant_${index}_price`] = "Price must be greater than 0"
      }
      if (variant.stockQuantity < 0) {
        newErrors[`variant_${index}_stock`] = "Stock quantity cannot be negative"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        id: product.id,
        ...formData,
        variants: productVariants,
      })
    }
  }

  const activeCategories = categories.filter((cat) => cat.status === 1)

  return (
    <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Product Information</h3>

              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange("categoryId", Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value={0}>Select a category</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="images-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="images-upload" className={`cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}>
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                        <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Click to add more images</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          disabled={isUploading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>
            </div>

            {/* Right Column - Product Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                <Button type="button" onClick={addVariant} size="sm" className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variant
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {productVariants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-sm">
                          Variant {index + 1} {variant.isNew && <span className="text-green-600">(New)</span>}
                        </span>
                      </div>
                      {productVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* SKU */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">SKU *</label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(variant.id, "sku", e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors[`variant_${index}_sku`] ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Enter SKU"
                        />
                        {errors[`variant_${index}_sku`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_sku`]}</p>
                        )}
                      </div>

                      {/* Color */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Color *</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(variant.id, "color", e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors[`variant_${index}_color`] ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Enter color"
                        />
                        {errors[`variant_${index}_color`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_color`]}</p>
                        )}
                      </div>

                      {/* Size */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Size *</label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(variant.id, "size", e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors[`variant_${index}_size`] ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Enter size"
                        />
                        {errors[`variant_${index}_size`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_size`]}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Price *</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(variant.id, "price", Number(e.target.value))}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors[`variant_${index}_price`] ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Enter price"
                          min="0"
                        />
                        {errors[`variant_${index}_price`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_price`]}</p>
                        )}
                      </div>

                      {/* Stock Quantity */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(variant.id, "stockQuantity", Number(e.target.value))}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors[`variant_${index}_stock`] ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Enter stock quantity"
                          min="0"
                        />
                        {errors[`variant_${index}_stock`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_stock`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
