import { FileText, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react"

const salesData = [
  {
    label: "Invoices",
    value: "0",
    icon: FileText,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Orders",
    value: "0",
    icon: ShoppingCart,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Compared to last month",
    value: "-7.42%",
    icon: TrendingDown,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    label: "Compared to last month",
    value: "0",
    icon: TrendingUp,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
]

export default function SalesResults() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">SALES RESULTS TODAY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesData.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
