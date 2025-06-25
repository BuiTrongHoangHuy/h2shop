"use client"

import { Button } from "@/components/ui/button"
import { Customer } from "@/services/api/customerApi"
import { User } from "lucide-react"

interface CustomerDetailProps {
    customer: Customer
    onUpdate: () => void
    onDelete: () => void
}

export default function CustomerDetail({ customer, onUpdate, onDelete }: CustomerDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getGenderLabel = (gender: string) => {
        const genderLabels = {
            male: "Male",
            female: "Female",
            other: "Other",
        }
        return genderLabels[gender as keyof typeof genderLabels] || gender
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-medium text-gray-900">Customer Information</h3>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <h2 className="text-lg font-semibold text-blue-600">{customer.fullName}</h2>

                {/* Avatar */}
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
                    <div className="text-center text-gray-400">
                        {customer.avatar ? (
                            <img
                                src={customer.avatar || "/placeholder.svg"}
                                alt={customer.fullName}
                                className="w-32 h-32 rounded-full mx-auto object-cover"
                            />
                        ) : (
                            <>
                                <User className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                                <span className="text-sm">No avatar</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600 mb-1">ID:</div>
                        <div className="font-medium">{customer.id}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Status:</div>
                        <div className={`font-medium ${customer.status === 1 ? "text-green-600" : "text-red-600"}`}>
                            {customer.status == 1 ? "Active" : "Inactive"}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Full Name:</div>
                        <div className="font-medium">{customer.fullName}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Gender:</div>
                        <div className="font-medium">{getGenderLabel(customer.gender) || "-"}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Phone:</div>
                        <div className="font-medium">{customer.phone}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-gray-600 mb-1">Address:</div>
                        <div className="font-medium leading-relaxed">{customer.address}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Created Date:</div>
                        <div className="font-medium">{formatDate(customer.createdAt)}</div>
                    </div>
                    {/* <div>
                        <div className="text-gray-600 mb-1">Updated Date:</div>
                        <div className="font-medium">{formatDate(customer.updated_at)}</div>
                    </div> */}
                </div>
            </div>

            <div className="p-4 border-t space-y-2">
                <Button onClick={onUpdate} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Update
                </Button>
            </div>
        </div>
    )
}
