"use client"

import { useState } from "react"
import { Search, Plus, Upload, FileText, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductSidebar from "./components/product-sidebar"
import ProductTable from "./components/product-table"
import ProductDetail from "./components/product-detail"
import { Category, Product, ProductVariant } from "@/types"
import AddProductModal from "./components/add-product-modal"

const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    parent_id: null,
    status: 1,
    image: null,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Smartphones",
    description: "Mobile phones and smartphones",
    parent_id: 1,
    status: 1,
    image: null,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 3,
    name: "Clothing",
    description: "Fashion and apparel items",
    parent_id: null,
    status: 1,
    image: null,
    created_at: "2024-01-18T11:45:00Z",
    updated_at: "2024-01-18T11:45:00Z",
  },
  {
    id: 4,
    name: "Men's Clothing",
    description: "Clothing items for men",
    parent_id: 3,
    status: 1,
    image: null,
    created_at: "2024-01-19T14:30:00Z",
    updated_at: "2024-01-19T14:30:00Z",
  },
]

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced features",
    images: null,
    category_id: 2,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone",
    images: null,
    category_id: 2,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  {
    id: 3,
    name: "Men's T-Shirt",
    description: "Comfortable cotton t-shirt",
    images: null,
    category_id: 4,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
]

const sampleProductVariants: ProductVariant[] = [
  // iPhone 15 Pro variants
  {
    id: 1,
    productId: 1,
    sku: "IP15P-BLK-128",
    color: "Black",
    size: "128GB",
    price: 25000000,
    stockQuantity: 15,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    productId: 1,
    sku: "IP15P-BLU-256",
    color: "Blue",
    size: "256GB",
    price: 28000000,
    stockQuantity: 8,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  // Samsung Galaxy S24 variants
  {
    id: 3,
    productId: 2,
    sku: "SGS24-WHT-128",
    color: "White",
    size: "128GB",
    price: 22000000,
    stockQuantity: 12,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  {
    id: 4,
    productId: 2,
    sku: "SGS24-BLK-256",
    color: "Black",
    size: "256GB",
    price: 25000000,
    stockQuantity: 5,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  // Men's T-Shirt variants
  {
    id: 5,
    productId: 3,
    sku: "TSH-RED-M",
    color: "Red",
    size: "M",
    price: 250000,
    stockQuantity: 25,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
  {
    id: 6,
    productId: 3,
    sku: "TSH-BLU-L",
    color: "Blue",
    size: "L",
    price: 250000,
    stockQuantity: 18,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
]

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const getCategoryName = (categoryId: number) => {
    const category = sampleCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown"
  }

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || getCategoryName(product.category_id) === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toString().includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  const handleToggleProductId = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: number[], checked: boolean) => {
    if (checked) {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <ProductSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={sampleCategories}
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
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                    console.log("Delete these IDs:", selectedProductIds);
                    
                  }}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ProductTable
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onProductSelect={(product) => {
              setSelectedProduct((prev) => (prev?.id === product.id ? null : product));
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            categories={sampleCategories}
            variants={sampleProductVariants}
            onToggleAll={handleToggleAll}
            onToggleProductId={handleToggleProductId}
            selectedProductIds={selectedProductIds}
          />
        </div>

        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onUpdate={() => {}}
            onDelete={() => {}}
            categories={sampleCategories}
            variants={sampleProductVariants}
          />
        )}
      </div>
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(productData) => {
            // Handle product creation here
            console.log("New product:", productData)
            setIsAddModalOpen(false)
          }}
          categories={sampleCategories}
        />
      )}
    </div>
  )
}