"use client"

import { Button } from "@/components/ui/button"
import { Category } from "@/types"
import { Folder, ImageIcon } from "lucide-react"

interface CategoryDetailProps {
    category: Category
    onUpdate: () => void
    onDelete: () => void
    allCategories: Category[]
}

export default function CategoryDetail({ category, onUpdate, onDelete, allCategories }: CategoryDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getParentCategoryName = (parentId: number | null) => {
        if (!parentId) return "Root Category"
        const parent = allCategories.find((cat) => cat.id === parentId)
        return parent ? parent.name : "Unknown"
    }

    const getSubCategories = () => {
        return allCategories.filter((cat) => cat.parent_id === category.id)
    }

    const subCategories = getSubCategories()

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-medium text-gray-900">Category Information</h3>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <h2 className="text-lg font-semibold text-blue-600">{category.name}</h2>

                {/* Category Image */}
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
                    <div className="text-center text-gray-400 h-full w-full">
                        {category.image ? (
                            <img
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                className="w-full h-full object-cover rounded"
                            />
                        ) : (
                            <>
                                <ImageIcon className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                                <span className="text-sm">No image</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Category Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600 mb-1">Category ID:</div>
                        <div className="font-medium">{category.id}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Status:</div>
                        <div className={`font-medium ${category.status === 1 ? "text-green-600" : "text-red-600"}`}>
                            {category.status === 1 ? "Active" : "Inactive"}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Category Name:</div>
                        <div className="font-medium">{category.name}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Description:</div>
                        <div className="font-medium text-sm leading-relaxed">{category.description}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Parent Category:</div>
                        <div className="font-medium flex items-center">
                            <Folder className="h-4 w-4 mr-1 text-gray-400" />
                            {getParentCategoryName(category.parent_id)}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Created Date:</div>
                        <div className="font-medium">{formatDate(category.created_at)}</div>
                    </div>
                    {/* <div>
                        <div className="text-gray-600 mb-1">Updated Date:</div>
                        <div className="font-medium">{formatDate(category.updated_at)}</div>
                    </div> */}
                </div>

                {/* Sub Categories */}
                {subCategories.length > 0 && (
                    <div>
                        <div className="text-gray-600 mb-2">Sub Categories ({subCategories.length}):</div>
                        <div className="space-y-1">
                            {subCategories.map((subCat) => (
                                <div key={subCat.id} className="flex items-center text-sm bg-gray-50 rounded px-2 py-1">
                                    <Folder className="h-3 w-3 mr-1 text-gray-400" />
                                    <span className="font-medium">{subCat.name}</span>
                                    <span className={`ml-auto text-xs ${subCat.status === 1 ? "text-green-600" : "text-red-600"}`}>
                                        {subCat.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t space-y-2">
                <Button onClick={onUpdate} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Update
                </Button>
                <Button onClick={onDelete} variant="destructive" className="w-full text-white bg-red-500 hover:bg-red-600">
                    Delete
                </Button>
            </div>
        </div>
    )
}
