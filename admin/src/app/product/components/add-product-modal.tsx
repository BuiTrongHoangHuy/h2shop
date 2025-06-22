"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Plus, Trash2, Package } from "lucide-react"
import { Category } from "@/types"

interface ProductVariantForm {
  id: string
  sku: string
  color: string
  size: string
  price: number
  stockQuantity: number
  image?: File | null
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (productData: {
    name: string
    description: string
    images: File[]
    category_id: number
    variants: ProductVariantForm[]
  }) => void
  categories: Category[]
}

export default function AddProductModal({ isOpen, onClose, onSubmit, categories }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as File[],
    category_id: 0,
  })

  const [variants, setVariants] = useState<ProductVariantForm[]>([
    {
      id: "1",
      sku: "",
      color: "",
      size: "",
      price: 0,
      stockQuantity: 0,
      image: null,
    },
  ])

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          images: "Please select valid image files",
        }))
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Each image should be less than 5MB",
        }))
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }))

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })

      setErrors((prev) => ({
        ...prev,
        images: "",
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    setVariants((prev) => prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant)))
  }

  const addVariant = () => {
    const newVariant: ProductVariantForm = {
      id: Date.now().toString(),
      sku: "",
      color: "",
      size: "",
      price: 0,
      stockQuantity: 0,
      image: null,
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const removeVariant = (variantId: string) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((variant) => variant.id !== variantId))
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

    if (formData.category_id === 0) {
      newErrors.category_id = "Please select a category"
    }

    // Validate variants
    variants.forEach((variant, index) => {
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
        ...formData,
        variants,
      })
    }
  }

  const activeCategories = categories.filter((cat) => cat.status === 1)

  return (
    <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange("category_id", Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.category_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value={0}>Select a category</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
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
                  />
                  <label htmlFor="images-upload" className="cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                {variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-sm">Variant {index + 1}</span>
                      </div>
                      {variants.length > 1 && (
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
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            errors[`variant_${index}_sku`] ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            errors[`variant_${index}_color`] ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            errors[`variant_${index}_size`] ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            errors[`variant_${index}_price`] ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            errors[`variant_${index}_stock`] ? "border-red-500" : "border-gray-300"
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
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
