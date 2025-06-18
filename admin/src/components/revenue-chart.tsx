"use client"

import { ChevronDown } from "lucide-react"

const chartData = [
  { label: "Q1", value: 15 },
  { label: "Q2", value: 12 },
  { label: "Q3", value: 13 },
  { label: "Q4", value: 11 },
  { label: "Q5", value: 10 },
  { label: "Q6", value: 18 },
  { label: "Q7", value: 8 },
  { label: "Q8", value: 12 },
  { label: "Q9", value: 14 },
]

export default function RevenueChart() {
  const maxValue = Math.max(...chartData.map((item) => item.value))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">NET REVENUE THIS MONTH</h2>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold text-blue-600">₫ 73,968,000</span>
          </div>
        </div>
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
          <span>This month</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Daily</span>
        </div>

        <div className="relative h-64">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
            <span>20 million</span>
            <span>18 million</span>
            <span>16 million</span>
            <span>14 million</span>
            <span>12 million</span>
            <span>10 million</span>
            <span>8 million</span>
            <span>6 million</span>
            <span>4 million</span>
            <span>2 million</span>
            <span>0</span>
          </div>

          <div className="ml-16 h-full flex items-end justify-between space-x-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-orange-500 rounded-t"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-xs text-gray-500 mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
