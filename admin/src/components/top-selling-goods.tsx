"use client"

import { ChevronDown } from "lucide-react"

const topProducts = [
  { name: "Logitech M331 wireless mouse", value: 85 },
  { name: "Logitech M331 wireless mouse", value: 45 },
]

export default function TopSellingGoods() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">TOP 10 BEST-SELLING GOODS THIS MONTH</h2>
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
          <span>This month</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
          <span>ACCORDING TO NET REVENUE</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{product.name}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${product.value}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {product.value === 85 ? "50 million" : "25 million"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>0</span>
          <span>5 million</span>
          <span>10 million</span>
          <span>15 million</span>
          <span>20 million</span>
          <span>25 million</span>
          <span>30 million</span>
          <span>35 million</span>
          <span>40 million</span>
          <span>45 million</span>
          <span>50 million</span>
        </div>
      </div>
    </div>
  )
}
