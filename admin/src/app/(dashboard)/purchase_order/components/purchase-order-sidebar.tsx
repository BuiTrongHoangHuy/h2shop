"use client"

import { Search, Filter, Calendar } from "lucide-react"

interface PurchaseOrderSidebarProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { name: "All", count: null },
  { name: "Pending", count: null },
  { name: "Received", count: null },
  { name: "Cancelled", count: null },
]

export default function PurchaseOrderSidebar({ selectedFilter, onFilterChange }: PurchaseOrderSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Purchase Order Filter</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for purchase order filter"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => onFilterChange(filter.name)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedFilter === filter.name
                  ? "bg-orange-50 text-orange-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{filter.name}</span>
              {filter.count && <span className="text-xs text-gray-500">{filter.count}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 