"use client"

import { PurchaseOrder } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[]
  selectedPurchaseOrder: PurchaseOrder | null
  onPurchaseOrderSelect: (purchaseOrder: PurchaseOrder) => void
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  allPurchaseOrders: PurchaseOrder[]
  selectedPurchaseOrderIds: string[]
  onToggleAll: (ids: string[], checked: boolean) => void
  onTogglePurchaseOrderId: (id: string) => void
}

export default function PurchaseOrderTable({
  purchaseOrders,
  selectedPurchaseOrder,
  onPurchaseOrderSelect,
  currentPage,
  onPageChange,
  totalPages,
  allPurchaseOrders,
  selectedPurchaseOrderIds,
  onToggleAll,
  onTogglePurchaseOrderId
}: PurchaseOrderTableProps) {
  const itemsPerPage = 10
  const currentPurchaseOrders = purchaseOrders

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )
      case 'Received':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Received
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  checked={currentPurchaseOrders.every(po => selectedPurchaseOrderIds.includes(po.id))}
                  onChange={(e) =>
                    onToggleAll(currentPurchaseOrders.map(po => po.id), e.target.checked)
                  } 
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created</th>
            </tr>
          </thead>
          <tbody>
            {currentPurchaseOrders.map((purchaseOrder) => (
              <tr
                key={purchaseOrder.id}
                onClick={() => onPurchaseOrderSelect(purchaseOrder)}
                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedPurchaseOrder?.id === purchaseOrder.id ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={selectedPurchaseOrderIds.includes(purchaseOrder.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      onTogglePurchaseOrderId(purchaseOrder.id)
                    }} 
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">#{purchaseOrder.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{purchaseOrder.supplierName}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{formatCurrency(purchaseOrder.totalPrice)}</td>
                <td className="px-4 py-3">{getStatusBadge(purchaseOrder.status)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{purchaseOrder.details.length} items</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(purchaseOrder.createdAt.toString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4 border-t">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page ? "bg-orange-500 text-white" : "hover:bg-gray-100 text-gray-700"
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
      </div>
    </div>
  )
} 