"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PurchaseOrderSidebar from "./components/purchase-order-sidebar"
import PurchaseOrderTable from "./components/purchase-order-table"
import AddPurchaseOrderModal from "./components/add-purchase-order-modal"
import { PurchaseOrder } from "@/types"
import { purchaseOrderApi } from "@/services/api/purchaseOrderApi"
import { Search } from "lucide-react"

export default function PurchaseOrderPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPurchaseOrderIds, setSelectedPurchaseOrderIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadPurchaseOrders()
  }, [currentPage, selectedFilter, searchQuery])

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true)
      const response = await purchaseOrderApi.getPurchaseOrders(currentPage, 10)
      setPurchaseOrders(response.data.purchaseOrders)
      setTotalPages(response.data.totalPages)
    } catch (error: any) {
      setError(error.message || 'Failed to load purchase orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePurchaseOrder = async (purchaseOrderData: any) => {
    try {
      await purchaseOrderApi.createPurchaseOrder(purchaseOrderData)
      setIsAddModalOpen(false)
      loadPurchaseOrders()
    } catch (error) {
      setError('Failed to create purchase order')
    }
  }

  const handleDeletePurchaseOrder = async () => {
    if (!selectedPurchaseOrder) return
    try {
      await purchaseOrderApi.deletePurchaseOrder(selectedPurchaseOrder.id)
      setSelectedPurchaseOrder(null)
      loadPurchaseOrders()
    } catch (error) {
      setError('Failed to delete purchase order')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedPurchaseOrderIds.length === 0) return
    try {
      await Promise.all(selectedPurchaseOrderIds.map(id => purchaseOrderApi.deletePurchaseOrder(id)))
      setSelectedPurchaseOrderIds([])
      loadPurchaseOrders()
    } catch (error) {
      setError('Failed to delete purchase orders')
    }
  }

  const handleTogglePurchaseOrderId = (id: string) => {
    setSelectedPurchaseOrderIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const handleToggleAll = (ids: string[], checked: boolean) => {
    if (checked) {
      setSelectedPurchaseOrderIds((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      setSelectedPurchaseOrderIds((prev) => prev.filter((id) => !ids.includes(id)))
    }
  }

  const handleUpdateStatus = async (id: string, status: 'Pending' | 'Received' | 'Cancelled') => {
    try {
      await purchaseOrderApi.updatePurchaseOrderStatus(id, status)
      loadPurchaseOrders()
    } catch (error) {
      setError('Failed to update purchase order status')
    }
  }

  const filteredPurchaseOrders = purchaseOrders.filter((purchaseOrder) => {
    switch (selectedFilter) {
      case "Pending":
        return purchaseOrder.status === 'Pending'
      case "Received":
        return purchaseOrder.status === 'Received'
      case "Cancelled":
        return purchaseOrder.status === 'Cancelled'
      default:
        return true
    }
  })

  if (loading && purchaseOrders.length === 0) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); loadPurchaseOrders(); }} className="bg-orange-500 hover:bg-orange-600">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="flex">
      <PurchaseOrderSidebar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Purchase Orders</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by supplier name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddModalOpen(true)}>
                  Add
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteSelected}
                  disabled={selectedPurchaseOrderIds.length === 0}
                >
                  Delete ({selectedPurchaseOrderIds.length})
                </Button>
              </div>
            </div>
          </div>
          <PurchaseOrderTable
            purchaseOrders={filteredPurchaseOrders}
            selectedPurchaseOrder={selectedPurchaseOrder}
            onPurchaseOrderSelect={(purchaseOrder) => {
              setSelectedPurchaseOrder((prev) =>
                prev?.id === purchaseOrder.id ? null : purchaseOrder
              )
            }}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            allPurchaseOrders={purchaseOrders}
            selectedPurchaseOrderIds={selectedPurchaseOrderIds}
            onToggleAll={handleToggleAll}
            onTogglePurchaseOrderId={handleTogglePurchaseOrderId}
          />
        </div>
        {selectedPurchaseOrder && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">Purchase Order Information</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <h2 className="text-lg font-semibold text-blue-600">{selectedPurchaseOrder.supplierName}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Order ID:</div>
                  <div className="font-medium">#{selectedPurchaseOrder.id}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Status:</div>
                  <div className={`font-medium ${
                    selectedPurchaseOrder.status === 'Pending' ? "text-yellow-600" :
                    selectedPurchaseOrder.status === 'Received' ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedPurchaseOrder.status}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Supplier:</div>
                  <div className="font-medium">{selectedPurchaseOrder.supplierName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Total Price:</div>
                  <div className="font-medium text-green-600">{formatCurrency(selectedPurchaseOrder.totalPrice)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Items:</div>
                  <div className="font-medium">{selectedPurchaseOrder.details.length} items</div>
                </div>
                {selectedPurchaseOrder.note && (
                  <div className="col-span-2">
                    <div className="text-gray-600 mb-1">Note:</div>
                    <div className="font-medium text-sm leading-relaxed">{selectedPurchaseOrder.note}</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-600 mb-1">Created:</div>
                  <div className="font-medium">{formatDate(selectedPurchaseOrder.createdAt)}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Updated:</div>
                  <div className="font-medium">{formatDate(selectedPurchaseOrder.updatedAt)}</div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedPurchaseOrder.details.map((detail) => (
                    <div key={detail.id} className="border rounded p-2 text-sm">
                      <div className="font-medium">
                        {detail.variant?.product?.name || 'Unknown Product'}
                      </div>
                      <div className="text-gray-600">
                        {detail.variant?.sku} - {detail.variant?.color} {detail.variant?.size}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Qty: {detail.quantity}</span>
                        <span>{formatCurrency(detail.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t space-y-2">
              {selectedPurchaseOrder.status === 'Pending' && (
                <>
                  <Button 
                    onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Received')} 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mark as Received
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Cancelled')} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {/*{selectedPurchaseOrder.status === 'Received' && (
                <Button 
                  onClick={() => handleUpdateStatus(selectedPurchaseOrder.id, 'Cancelled')} 
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel Order
                </Button>
              )}*/}
              {selectedPurchaseOrder.status === 'Pending' && (
                <Button onClick={handleDeletePurchaseOrder} variant="destructive" className="w-full text-white bg-red-500 hover:bg-red-600">
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {isAddModalOpen && (
        <AddPurchaseOrderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreatePurchaseOrder}
        />
      )}
    </div>
  )
}
