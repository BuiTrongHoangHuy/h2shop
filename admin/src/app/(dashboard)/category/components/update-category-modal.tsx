"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Loader2 } from "lucide-react"
import { Category } from "@/types"
import uploadApi from "@/services/api/uploadApi"

interface UpdateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (categoryData: {
    id: number
    name: string
    description: string
    parent_id: number | null
    status: number
    image: string | null
  }) => void
  categories: Category[]
  category: Category
}

export default function UpdateCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  category,
}: UpdateCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: null as number | null,
    status: 1,
    image: null as string | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form with category data
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        parent_id: category.parentId,
        status: category.status,
        image: category.image?.url || null,
      })
      if (category.image) {
        setImagePreview(category.image.url)
      }
    }
  }, [category])

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }))
        return
      }

      setIsUploading(true)
      setErrors((prev) => ({ ...prev, image: "" }))

      try {
        const imageUrl = await uploadApi.uploadImage(file)
        setFormData((prev) => ({ ...prev, image: imageUrl }))
        setImagePreview(imageUrl)
      } catch (error) {
        setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }))
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // Check if trying to set parent as itself or its child
    if (formData.parent_id === category.id) {
      newErrors.parent_id = "Category cannot be its own parent"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        id: category.id,
        ...formData,
      })
    }
  }

  // Get parent categories (exclude current category and its children)
  const getAvailableParentCategories = () => {
    return categories.filter((cat) => cat.status === 1 && cat.id !== category.id && cat.parentId !== category.id)
  }

  const parentCategories = getAvailableParentCategories()

  return (
    <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Category</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category name"
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
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category description"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Parent Category */}
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              id="parent_id"
              value={formData.parent_id || ""}
              onChange={(e) => handleInputChange("parent_id", e.target.value ? Number(e.target.value) : null)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.parent_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select parent category (optional)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.parent_id && <p className="text-red-500 text-xs mt-1">{errors.parent_id}</p>}
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleInputChange("status", formData.status === 1 ? 0 : 1)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  formData.status === 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status === 1 ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${formData.status === 1 ? "text-green-600" : "text-gray-500"}`}>
                {formData.status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label htmlFor="image-upload" className={`cursor-pointer ${isUploading ? "cursor-not-allowed" : ""}`}>
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
                      <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload new image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-replace"
                    disabled={isUploading}
                  />
                  <label htmlFor="image-replace" className={`text-sm text-blue-600 hover:text-blue-700 ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    {isUploading ? "Uploading..." : "Change image"}
                  </label>
                </div>
              </div>
            )}

            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              Update Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
