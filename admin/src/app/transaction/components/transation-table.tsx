"use client"

import { Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { Transaction } from "@/app/transaction/page"

interface TransactionTableProps {
  transactions: Transaction[]
  currentPage: number
  onPageChange: (page: number) => void
}

export default function TransactionTable({ transactions, currentPage, onPageChange }: TransactionTableProps) {
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN")
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="w-12 px-4 py-3 text-left">
                <Star className="h-4 w-4 text-gray-400" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Invoice code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Return code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total money</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Discount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Guest paid</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <Star className="h-4 w-4 text-gray-400" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.invoiceCode}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.time}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.returnCode || ""}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatMoney(transaction.totalMoney)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.discount}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatMoney(transaction.guestPaid)}</td>
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
