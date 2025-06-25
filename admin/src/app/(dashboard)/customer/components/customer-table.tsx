"use client"

import { Customer } from "@/services/api/customerApi"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface CustomerTableProps {
    customers: Customer[]
    selectedCustomer: Customer | null
    onCustomerSelect: (customer: Customer) => void
    currentPage: number
    onPageChange: (page: number) => void
    selectedCustomerIds: number[]
    onToggleCustomerId: (id: number) => void
    onToggleAll: (ids: number[], checked: boolean) => void
}

export default function CustomerTable({
    customers,
    selectedCustomer,
    onCustomerSelect,
    currentPage,
    onPageChange,
    selectedCustomerIds,
    onToggleAll,
    onToggleCustomerId
}: CustomerTableProps) {
    const itemsPerPage = 10
    const totalPages = Math.ceil(customers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCustomers = customers.slice(startIndex, endIndex)

    const getStatusBadge = (status: number) => {
        return status === 1 ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactive
            </span>
        )
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Full Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Address</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map((customer) => (
                            <tr
                                key={customer.id}
                                onClick={() => onCustomerSelect(customer)}
                                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-green-50 border-green-200" : ""
                                    }`}
                            >
                                <td className="px-4 py-3 text-sm text-gray-900">{customer.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{customer.fullName}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={customer.address}>
                                    {customer.address}
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(customer.status)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{customer.phone}</td>
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
                            className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? "bg-orange-500 text-white" : "hover:bg-gray-100 text-gray-700"
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
