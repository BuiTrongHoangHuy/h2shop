"use client"

import { useState, useEffect, useRef } from "react"
import { X, Plus, Trash, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePurchaseOrderData, CreatePurchaseOrderDetailData, Product, ProductVariant } from "@/types"
import { productApi } from "@/services/api/productApi"

interface AddPurchaseOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePurchaseOrderData) => void
}

export default function AddPurchaseOrderModal({
  isOpen,
  onClose,
  onSubmit
}: AddPurchaseOrderModalProps) {
  const [formData, setFormData] = useState<CreatePurchaseOrderData>({
    supplierName: "",
    totalPrice: 0,
    note: "",
    details: []
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showVariantSearch, setShowVariantSearch] = useState<number | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getProducts(1, 100)
      setProducts(response.data.products)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts()
    }
  }, [isOpen])

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowVariantSearch(null)
        setSearchQuery("")
      }
    }

    if (showVariantSearch !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showVariantSearch])

  const handleInputChange = (field: keyof CreatePurchaseOrderData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addDetail = () => {
    const newDetail: CreatePurchaseOrderDetailData = {
      variantId: "",
      quantity: 1,
      price: 0
    }
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, newDetail]
    }))
  }

  const updateDetail = (index: number, field: keyof CreatePurchaseOrderDetailData, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }))
  }

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }))
  }

  const calculateTotal = () => {
    return formData.details.reduce((total, detail) => total + (detail.price * detail.quantity), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.supplierName.trim()) {
      setError('Supplier name is required')
      return
    }

    if (formData.details.length === 0) {
      setError('At least one item is required')
      return
    }

    const totalPrice = calculateTotal()
    onSubmit({
      ...formData,
      totalPrice
    })
  }

  const getProductVariants = (productId: string): ProductVariant[] => {
    const product = products.find(p => p.id === productId)
    return product?.variants || []
  }

  const getAllVariants = (): Array<{ variant: ProductVariant; product: Product }> => {
    const allVariants: Array<{ variant: ProductVariant; product: Product }> = []
    products.forEach(product => {
      if (product.variants) {
        product.variants.forEach(variant => {
          allVariants.push({ variant, product })
        })
      }
    })
    return allVariants
  }

  const getFilteredVariants = () => {
    const allVariants = getAllVariants()
    if (!searchQuery.trim()) return allVariants

    const query = searchQuery.toLowerCase()
    return allVariants.filter(({ variant, product }) => {
      return (
        variant.sku.toLowerCase().includes(query) ||
        variant.color?.toLowerCase().includes(query) ||
        variant.size?.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query)
      )
    })
  }

  const selectVariant = (index: number, variantId: string) => {
    const allVariants = getAllVariants()
    const selectedVariant = allVariants.find(({ variant }) => variant.id === variantId)
    
    if (selectedVariant) {
      updateDetail(index, 'variantId', variantId)
      updateDetail(index, 'price', selectedVariant.variant.price)
    }
    
    setShowVariantSearch(null)
    setSearchQuery("")
  }

  const getVariantDisplayName = (variantId: string) => {
    const allVariants = getAllVariants()
    const selected = allVariants.find(({ variant }) => variant.id === variantId)
    if (!selected) return "Select a variant"
    
    const { variant, product } = selected
    return `${product.name} - ${variant.sku} (${variant.color} ${variant.size})`
  }

  const openVariantSearch = (index: number) => {
    setShowVariantSearch(index)
    setSearchQuery("")
    // Focus the search input after a short delay to ensure the dropdown is rendered
    setTimeout(() => {
      const searchInput = searchRef.current?.querySelector('input')
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Purchase Order</h2>
          <Button variant="ghost" className="cursor-pointer" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Input
                  id="supplierName"
                  value={formData.supplierName}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                  placeholder="Enter supplier name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              <Button type="button" onClick={addDetail} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.details.map((detail, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetail(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative" ref={showVariantSearch === index ? searchRef : null}>
                      <Label>Product Variant</Label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => openVariantSearch(index)}
                          className="w-full p-2 border rounded-md text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between"
                        >
                          <span className={detail.variantId ? "text-gray-900" : "text-gray-500"}>
                            {getVariantDisplayName(detail.variantId)}
                          </span>
                          <Search className="h-4 w-4 text-gray-400" />
                        </button>
                        
                        {showVariantSearch === index && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  type="text"
                                  placeholder="Search variants by SKU, color, size, or product name..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {getFilteredVariants().length === 0 ? (
                                <div className="p-3 text-center text-gray-500">
                                  {searchQuery ? "No variants found" : "Loading variants..."}
                                </div>
                              ) : (
                                getFilteredVariants().map(({ variant, product }) => (
                                  <button
                                    key={variant.id}
                                    type="button"
                                    onClick={() => selectVariant(index, variant.id)}
                                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-medium text-sm">
                                      {product.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {variant.sku} - {variant.color} {variant.size}
                                    </div>
                                    <div className="text-xs text-green-600 font-medium">
                                      {Number(variant.price).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                      })}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={detail.quantity}
                        onChange={(e) => updateDetail(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={Number(detail.price) }
                        onChange={(e) => updateDetail(index, 'price', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      Subtotal: {Number((detail.price * detail.quantity)).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {formData.details.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items added. Click "Add Item" to start.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-green-600">{Number(calculateTotal()).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button"  className="cursor-pointer bg-red-500 text-white hover:bg-red-600" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer " disabled={loading}>
              {loading ? 'Creating...' : 'Create Purchase Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 