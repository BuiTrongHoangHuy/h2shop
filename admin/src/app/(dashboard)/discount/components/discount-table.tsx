"use client";

import { Discount } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DiscountTableProps {
  discounts: Discount[];
  selectedDiscount: Discount | null;
  onDiscountSelect: (discount: Discount) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  allDiscounts: Discount[];
  selectedDiscountIds: number[];
  onToggleAll: (ids: number[], checked: boolean) => void;
  onToggleDiscountId: (id: number) => void;
}

export default function DiscountTable({
  discounts,
  selectedDiscount,
  onDiscountSelect,
  currentPage,
  onPageChange,
  totalPages,
  allDiscounts,
  selectedDiscountIds,
  onToggleAll,
  onToggleDiscountId
}: DiscountTableProps) {
  const itemsPerPage = 10;
  const currentDiscounts = discounts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (discount: Discount) => {
    return discount.status === 1 && new Date(discount.startDate)  <= new Date() && new Date( discount.endDate )>= new Date() ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input type="checkbox" className="rounded" checked={currentDiscounts.every(d => selectedDiscountIds.includes(d.id))}
                  onChange={(e) =>
                    onToggleAll(currentDiscounts.map(d => d.id), e.target.checked)
                  } />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Start</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">End</th>
            </tr>
          </thead>
          <tbody>
            {currentDiscounts.map((discount) => (
              <tr
                key={discount.id}
                onClick={() => onDiscountSelect(discount)}
                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedDiscount?.id === discount.id ? "bg-green-50 border-green-200" : ""}`}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" checked={selectedDiscountIds.includes(discount.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleDiscountId(discount.id);
                    }} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{discount.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{discount.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{discount.discountType}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{discount.discountType === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}</td>
                <td className="px-4 py-3">{getStatusBadge(discount)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(discount.startDate)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(discount.endDate)}</td>
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
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? "bg-orange-500 text-white" : "hover:bg-gray-100 text-gray-700"}`}
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
      </div>
    </div>
  );
} 