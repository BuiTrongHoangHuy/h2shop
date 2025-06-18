"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import TransactionSidebar from "./components/transation-sidebar"
import TransactionTable from "./components/transation-table"

export interface Transaction {
  id: string
  invoiceCode: string
  time: string
  returnCode?: string
  customer: string
  totalMoney: number
  discount: number
  guestPaid: number
}

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    invoiceCode: "HD000048",
    time: "11/27/2024 13:16",
    customer: "Hoang Huy",
    totalMoney: 20000,
    discount: 0,
    guestPaid: 20000,
  },
  {
    id: "2",
    invoiceCode: "HD000046",
    time: "11/20/2024 15:16",
    customer: "Chau Hoang",
    totalMoney: 10000,
    discount: 0,
    guestPaid: 10000,
  },
  {
    id: "3",
    invoiceCode: "HD000047",
    time: "11/20 2024 14:51",
    customer: "Hoang Huy",
    totalMoney: 0,
    discount: 0,
    guestPaid: 0,
  },
  {
    id: "4",
    invoiceCode: "HD000045",
    time: "11/19/2024 15:15",
    customer: "Hoang Huy",
    totalMoney: 10000,
    discount: 0,
    guestPaid: 10000,
  },
  {
    id: "5",
    invoiceCode: "HD000044",
    time: "11/18/2024 15:14",
    customer: "Chau Hoang",
    totalMoney: 0,
    discount: 0,
    guestPaid: 0,
  },
  {
    id: "6",
    invoiceCode: "HD000043",
    time: "11/17/2024 15:13",
    customer: "Chau Hoang",
    totalMoney: 0,
    discount: 0,
    guestPaid: 0,
  },
  {
    id: "7",
    invoiceCode: "HD000042",
    time: "11/16/2024 15:12",
    customer: "Chau Hoang",
    totalMoney: 0,
    discount: 0,
    guestPaid: 0,
  },
  {
    id: "8",
    invoiceCode: "HD000041",
    time: "11/15/2024 15:10",
    customer: "Chau Hoang",
    totalMoney: 0,
    discount: 0,
    guestPaid: 0,
  },
]

export default function TransactionPage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("This month")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingDateRange, setPendingDateRange] = useState({ startDate: "", endDate: "" })
  const [appliedDateRange, setAppliedDateRange] = useState({ startDate: "", endDate: "" })

  // Update the filteredTransactions logic to include date filtering
  const filteredTransactions = sampleTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesDateFilter = true
    if (selectedTimeFilter === "Other options" && appliedDateRange.startDate && appliedDateRange.endDate) {
      const datePart = transaction.time.split(" ")[0]
      const [month, day, year] = datePart.split("/")
      const transactionDate = new Date(Number(year), Number(month) - 1, Number(day))
      const startDate = new Date(appliedDateRange.startDate)
      const endDate = new Date(appliedDateRange.endDate)

      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      matchesDateFilter = transactionDate >= startDate && transactionDate <= endDate
    }

    return matchesSearch && matchesDateFilter
  })

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <TransactionSidebar
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
        dateRange={pendingDateRange}
        onDateRangeChange={setPendingDateRange}
        onApplyDateRange={() => setAppliedDateRange(pendingDateRange)}
      />

      <div className="flex-1 bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-4">Invoice</h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="According to the invoice"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TransactionTable transactions={filteredTransactions} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}