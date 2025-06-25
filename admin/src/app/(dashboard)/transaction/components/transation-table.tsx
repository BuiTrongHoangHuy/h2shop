"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiOrder {
  order: {
    id: string;
    userId: string;
    totalPrice: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  customer: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentStatus: string;
}

interface TransactionTableProps {
  orders: ApiOrder[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (order: ApiOrder) => void;
}

export default function TransactionTable({
  orders,
  currentPage,
  onPageChange,
  onViewDetails,
}: TransactionTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const formatMoney = (amount: string) => {
    return parseFloat(amount).toLocaleString("vi-VN") + " ₫";
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

  type StatusKey = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<StatusKey, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const key = typeof status === "string" ? status.toLowerCase() as StatusKey : "pending";
    const config = statusConfig[key] || { bg: "bg-gray-100", text: "text-gray-800", label: status ?? "Unknown" };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    type PaymentStatusKey = "pending" | "completed" | "failed";
    const statusConfig: Record<PaymentStatusKey, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    };

    const key = typeof paymentStatus === "string" ? paymentStatus.toLowerCase() as PaymentStatusKey : "pending";
    const config = statusConfig[key] || { bg: "bg-gray-100", text: "text-gray-800", label: paymentStatus ?? "Unknown" };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Payment Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((item) => (
              <tr key={item.order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.order.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{item.customer.fullName}</div>
                    <div className="text-gray-500">{item.customer.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(item.order.createdAt)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatMoney(item.order.totalPrice)}</td>
                <td className="px-4 py-3">{getStatusBadge(item.order.status)}</td>
                <td className="px-4 py-3">{getPaymentStatusBadge(item.paymentStatus)}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(item)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </td>
              </tr>
            ))}
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
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm min-w-[32px] ${currentPage === page ? "bg-orange-500 text-white"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {page}
            </button>
          );
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
  );
}