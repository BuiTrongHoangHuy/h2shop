"use client"

import { Category } from "@/types"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface CategoryTableProps {
    categories: Category[]
    selectedCategory: Category | null
    onCategorySelect: (category: Category) => void
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    allCategories: Category[]
    selectedCategoryIds: number[]
    onToggleCategoryId: (id: number) => void
    onToggleAll: (ids: number[], checked: boolean) => void
}

export default function CategoryTable({
    categories,
    selectedCategory,
    onCategorySelect,
    currentPage,
    onPageChange,
    totalPages,
    allCategories,
    selectedCategoryIds,
    onToggleAll,
    onToggleCategoryId
}: CategoryTableProps) {
    const itemsPerPage = 10
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCategories = categories

    const getParentCategoryName = (parentId: number | null) => {
        if (!parentId) return "-"
        const parent = allCategories.find((cat) => cat.id === parentId)
        return parent ? parent.name : "-"
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

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
                            <th className="w-12 px-4 py-3 text-left">
                                <input type="checkbox" className="rounded" checked={currentCategories.every(c => selectedCategoryIds.includes(c.id))}
                                    onChange={(e) =>
                                    onToggleAll(currentCategories.map(c => c.id), e.target.checked)
                                } />
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Parent Category</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category) => (
                            <tr
                                key={category.id}
                                onClick={() => onCategorySelect(category)}
                                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedCategory?.id === category.id ? "bg-green-50 border-green-200" : ""
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="rounded" checked={selectedCategoryIds.includes(category.id)}
                                        onChange={(e) => {
                                            e.stopPropagation()
                                            onToggleCategoryId(category.id)
                                    }} />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{category.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{category.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={category.description}>
                                    {category.description}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{getParentCategoryName(category.parentId)}</td>
                                <td className="px-4 py-3">{getStatusBadge(category.status)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(category.createdAt)}</td>
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
