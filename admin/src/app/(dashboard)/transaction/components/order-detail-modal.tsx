"use client";

import { X, User, MapPin, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { updateOrderStatus } from "@/services/api/transactionApi";
import { toast } from "react-toastify";

interface ApiOrder {
  order: {
    id: string;
    userId: string;
    totalPrice: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  details: {
    id: string;
    orderId: string;
    variantId: string;
    quantity: number;
    price: string;
    image: { url: string };
    sku: string;
    color: string;
    size: string;
    variantPrice: string;
    productId: string;
    productName: string;
    productDescription: string;
    createdAt: string;
    updatedAt: string;
  }[];
  customer: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentStatus: string;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: ApiOrder;
  onStatusUpdated?: () => void;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  orderData,
  onStatusUpdated
}: OrderDetailModalProps) {
  if (!isOpen) return null;

  const [orderStatus, setOrderStatus] = useState(orderData.order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderData.order.id, orderStatus);
      if (onStatusUpdated) onStatusUpdated();
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status!");
    } finally {
      setIsUpdating(false);
      setShowDropdown(false);
    }
  };

  const formatMoney = (amount: string) => {
    return parseFloat(amount).toLocaleString("en-US") + " ₫";
  };

  type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const key = status.toLowerCase() as OrderStatus;
    const config = statusConfig[key] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} cursor-pointer hover:opacity-80`}
        >
          {config.label}
        </button>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10"
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setOrderStatus(option.value);
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  type PaymentStatus = "pending" | "completed" | "failed";

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    };

    const key = paymentStatus.toLowerCase() as PaymentStatus;
    const config = statusConfig[key] || { bg: "bg-gray-100", text: "text-gray-800", label: paymentStatus };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getTotalItems = () => {
    return orderData.details.reduce((total, detail) => total + detail.quantity, 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Order Details
            </h2>
            <span className="text-lg font-medium text-gray-600">
              #{orderData.order.id}
            </span>
            {getStatusBadge(orderStatus)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Customer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.fullName}
                    </div>
                    <div className="text-sm text-gray-500">Customer Name</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.phone}
                    </div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {orderData.customer.address || "No address provided"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Delivery Address
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Variant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.details.map((detail, index) => (
                    <tr
                      key={detail.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {detail.productName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {detail.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {detail.color} / {detail.size}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatMoney(detail.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {detail.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatMoney((parseFloat(detail.price) * detail.quantity).toString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Total */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-base text-gray-600">
                    Total Items: {getTotalItems()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatMoney(orderData.order.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payment Status
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-base">Status:</span>
              <div>{getPaymentStatusBadge(orderData.paymentStatus)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="default"
            onClick={handleUpdateStatus}
            disabled={isUpdating || orderStatus === orderData.order.status}
            className={
              isUpdating || orderStatus === orderData.order.status
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}