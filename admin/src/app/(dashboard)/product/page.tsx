"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Upload, FileText, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductSidebar from "./components/product-sidebar"
import ProductTable from "./components/product-table"
import ProductDetail from "./components/product-detail"
import { Category, Product, ProductVariant } from "@/types"
import AddProductModal from "./components/add-product-modal"
import UpdateProductModal from "./components/update-product-modal"
import { productApi, ProductFilters } from "@/services/api/productApi"
import { categoryApi } from "@/services/api/categoryApi"

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load products when filters change
  useEffect(() => {
    loadProducts()
  }, [currentPage, selectedCategory, searchQuery])

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getCategories()
      console.log("heheh",response)
      setCategories(response.categories)
    } catch (error) {
      console.error('Error loading categories:', error)
      setError('Failed to load categories')
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const filters: ProductFilters = {}
      
      if (selectedCategory !== "All") {
        const category = categories.find(cat => cat.name === selectedCategory)
        if (category) {
          filters.categoryId = category.id.toString()
        }
      }
      
      if (searchQuery) {
        filters.search = searchQuery
      }

      const response = await productApi.getProducts(currentPage, 10, filters)
      setProducts(response.data.products)
      setTotalProducts(response.data.total)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (productData: {
    name: string
    description: string
    images: string[]
    categoryId: string
    variants: {
      sku: string
      color: string
      size: string
      price: number
      stockQuantity: number
    }[]
  }) => {
    try {

      console.log("he2",{...productData})
      await productApi.createProduct({
        ...productData,
        categoryId: productData.categoryId.toString()
      })
      setIsAddModalOpen(false)
      loadProducts() // Reload products after creation
    } catch (error) {
      console.error('Error creating product:', error)
      setError('Failed to create product')
    }
  }

  const handleUpdateProduct = async (productData: {
    id:string
    name: string
    description: string
    images: string[]
    categoryId: string
    variants: {
      sku: string
      color: string
      size: string
      price: number
      stockQuantity: number
    }[]
  }) => {
    if (!selectedProduct) return
    
    try {
      await productApi.updateProduct(selectedProduct.id, {
        ...productData,
        categoryId: productData.categoryId.toString()
      })
      setIsUpdateModalOpen(false)
      loadProducts() // Reload products after update
    } catch (error) {
      console.error('Error updating product:', error)
      setError('Failed to update product')
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    try {
      await productApi.deleteProduct(selectedProduct.id)
      setSelectedProduct(null)
      loadProducts() // Reload products after deletion
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return
    
    try {
      await productApi.deleteProducts(selectedProductIds)
      setSelectedProductIds([])
      loadProducts() // Reload products after deletion
    } catch (error) {
      console.error('Error deleting products:', error)
      setError('Failed to delete products')
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id.toString() === categoryId)
    return category ? category.name : "Unknown"
  }

  const handleToggleProductId = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: string[], checked: boolean) => {
    if (checked) {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); loadProducts(); }} className="bg-orange-500 hover:bg-orange-600">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <ProductSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Product</h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="According to the code, the name of the goods"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white" 
                  onClick={handleDeleteSelected}
                  disabled={selectedProductIds.length === 0}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete ({selectedProductIds.length})
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ProductTable
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={(product) => {
              setSelectedProduct((prev) => (prev?.id === product.id ? null : product));
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            categories={categories}
            variants={products.flatMap(p => p.variants || [])}
            onToggleAll={handleToggleAll}
            onToggleProductId={handleToggleProductId}
            selectedProductIds={selectedProductIds}
            totalProducts={totalProducts}
            loading={loading}
          />
        </div>

        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onUpdate={() => setIsUpdateModalOpen(true)}
            onDelete={handleDeleteProduct}
            categories={categories}
            variants={selectedProduct.variants || []}
          />
        )}
      </div>
      
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateProduct}
          categories={categories}
        />
      )}

      {isUpdateModalOpen && selectedProduct && (
        <UpdateProductModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateProduct}
          categories={categories}
          product={selectedProduct}
          variants={selectedProduct.variants || []}
        />
      )}
    </div>
  )
}