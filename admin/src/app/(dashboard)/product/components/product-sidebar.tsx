"use client"

import { Category } from "@/types"
import { Search } from "lucide-react"

interface ProductSidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: Category[]
}

export default function ProductSidebar({ selectedCategory, onCategoryChange, categories }: ProductSidebarProps) {
  const activeCategories = categories && categories.filter((cat) => cat.status === 1) || []
  const categoryOptions = [
    { name: "All", count: null },
    ...activeCategories.map((cat) => ({ name: cat.name, count: null })),
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Product Category</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for category"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1">
          {categoryOptions.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === category.name
                  ? "bg-orange-50 text-orange-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{category.name}</span>
              {category.count && <span className="text-xs text-gray-500">{category.count}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
