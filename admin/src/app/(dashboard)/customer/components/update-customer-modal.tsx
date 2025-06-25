"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, User, Phone, MapPin, Calendar, UserCheck } from "lucide-react"
import { Customer } from "@/services/api/customerApi"

interface UpdateCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customerData: { id: number; status: number }) => void
  customer: Customer
}

export default function UpdateCustomerModal({ isOpen, onClose, onSubmit, customer }: UpdateCustomerModalProps) {
  const [status, setStatus] = useState(1)

  // Pre-populate form with customer data
  useEffect(() => {
    if (customer) {
      setStatus(customer.status)
    }
  }, [customer])

  if (!isOpen) return null

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: customer.id,
      status: status,
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
            <span className="text-sm text-gray-500">ID: #{customer.id}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              {customer.avatar ? (
                <img
                  src={customer.avatar || "/placeholder.svg"}
                  alt={customer.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>

          {/* Customer Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Customer ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Customer ID</label>
                </div>
                <div className="text-lg font-semibold text-gray-900">#{customer.id}</div>
              </div>

              {/* Full Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                </div>
                <div className="text-lg font-semibold text-gray-900">{customer.fullName}</div>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                </div>
                <div className="text-lg font-semibold text-gray-900">{customer.phone}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Gender */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                </div>
                <div className="text-lg font-semibold text-gray-900">{getGenderLabel(customer.gender)}</div>
              </div>

              {/* Created Date */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Created Date</label>
                </div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(customer.createdAt)}</div>
              </div>

              {/* Status Toggle - Only Editable Field */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${status === 1 ? "bg-green-500" : "bg-red-500"}`} />
                  <label className="text-sm font-medium text-gray-700">Account Status</label>
                  <span className="text-xs text-orange-600 font-medium">(Editable)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setStatus(status === 1 ? 0 : 1)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${status === 1 ? "bg-green-500" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === 1 ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${status === 1 ? "text-green-600" : "text-red-600"}`}>
                      {status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {status !== customer.status && (
                    <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded">
                      Modified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Address</label>
            </div>
            <div className="text-lg font-semibold text-gray-900 leading-relaxed">{customer.address}</div>
          </div>

          {/* Status Change Notice */}
          {status !== customer.status && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium text-yellow-800">
                  Status will be changed from{" "}
                  <span className={customer.status === 1 ? "text-green-600" : "text-red-600"}>
                    {customer.status === 1 ? "Active" : "Inactive"}
                  </span>{" "}
                  to{" "}
                  <span className={status === 1 ? "text-green-600" : "text-red-600"}>
                    {status === 1 ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={status === customer.status}
              className={`flex-1 ${status === customer.status ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                } text-white`}
            >
              {status === customer.status ? "No Changes" : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
