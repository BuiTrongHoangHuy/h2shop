"use client"

import { Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Customer, Order, Payment } from "@/types"

interface TransactionTableProps {
  orders: Order[]
  currentPage: number
  onPageChange: (page: number) => void
  getCustomerInfo: (userId: number) => Customer | undefined
  getPaymentInfo: (orderId: number) => Payment | undefined
  onViewDetails: (order: Order) => void
}

export default function TransactionTable({
  orders,
  currentPage,
  onPageChange,
  getCustomerInfo,
  getPaymentInfo,
  onViewDetails,
}: TransactionTableProps) {
  const itemsPerPage = 10
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = orders.slice(startIndex, endIndex)

  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫"
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    }

    const config = statusConfig[status]
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (payment: Payment | undefined) => {
    if (!payment) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Payment
        </span>
      )
    }

    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    }

    const config = statusConfig[payment.status]
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const getPaymentMethodLabel = (method: Payment["payment_method"]) => {
    const methodLabels = {
      "credit card": "Credit Card",
      "bank transfer": "Bank Transfer",
      "cash on delivery": "Cash on Delivery",
    }
    return methodLabels[method] || method
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {/* <th className="w-12 px-4 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Payment Method</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Payment Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const customer = getCustomerInfo(order.user_id)
              const payment = getPaymentInfo(order.id)

              return (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {/* <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td> */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{customer?.full_name || "Unknown Customer"}</div>
                      <div className="text-gray-500">{customer?.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatMoney(order.total_price)}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {payment ? getPaymentMethodLabel(payment.payment_method) : "-"}
                  </td>
                  <td className="px-4 py-3">{getPaymentStatusBadge(payment)}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-1 py-4 border-t">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[...Array(Math.min(3, totalPages))].map((_, index) => {
          const page = index + 1
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm min-w-[32px] ${
                currentPage === page ? "bg-green-500 text-white" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
