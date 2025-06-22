"use client";

import {
  X,
  User,
  CreditCard,
  Package,
  MapPin,
  Calendar,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer, Order, OrderDetail, Payment, ProductVariant } from "@/types";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  orderDetails: OrderDetail[];
  payment: Payment | undefined;
  customer: Customer | undefined;
  getVariantInfo: (
    variantId: number
  ) => (ProductVariant & { product_name: string }) | undefined;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  orderDetails,
  payment,
  customer,
  getVariantInfo,
}: OrderDetailModalProps) {
  if (!isOpen) return null;

  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Processing",
      },
      shipped: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Shipped",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Delivered",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (payment: Payment | undefined) => {
    if (!payment) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          No Payment
        </span>
      );
    }

    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    };

    const config = statusConfig[payment.status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: Payment["payment_method"]) => {
    const methodLabels = {
      "credit card": "Credit Card",
      "bank transfer": "Bank Transfer",
      "cash on delivery": "Cash on Delivery",
    };
    return methodLabels[method] || method;
  };

  const calculateSubtotal = () => {
    return orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return orderDetails.reduce((total, detail) => total + detail.quantity, 0);
  };

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
              #{order.id}
            </span>
            {getStatusBadge(order.status)}
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
          {/* Order Summary */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Order Info</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-blue-600">
                    {formatMoney(order.total_price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Payment</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">
                    {payment
                      ? getPaymentMethodLabel(payment.payment_method)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div>{getPaymentStatusBadge(payment)}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-purple-600">
                    {payment ? formatMoney(payment.amount) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Customer Information
              </h3>
            </div>

            {customer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {customer.full_name}
                      </div>
                      <div className="text-sm text-gray-500">Customer Name</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {customer.phone}
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
                        {customer.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivery Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Customer information not available
              </div>
            )}
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
                  {orderDetails.map((detail, index) => {
                    const variant = getVariantInfo(detail.variant_id);
                    return (
                      <tr
                        key={detail.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {variant?.product_name || "Unknown Product"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {variant?.sku || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {variant
                            ? `${variant.color} / ${variant.size}`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatMoney(detail.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {detail.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatMoney(detail.price * detail.quantity)}
                        </td>
                      </tr>
                    );
                  })}
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
                    {formatMoney(order.total_price)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Status
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-base">Status:</span>
                <div>{getPaymentStatusBadge(payment)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            OK
          </Button>
          {/* <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Print Invoice
          </Button> */}
        </div>
      </div>
    </div>
  );
}
