"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discountData: {
    name: string;
    description: string;
    discountType: 'Percentage' | 'Fixed Amount';
    value: number;
    startDate: string;
    endDate: string;
    status: number;
  }) => void;
}

export default function AddDiscountModal({ isOpen, onClose, onSubmit }: AddDiscountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountType: 'Percentage' as 'Percentage' | 'Fixed Amount',
    value: 0,
    startDate: "",
    endDate: "",
    status: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Discount name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.value || formData.value <= 0) newErrors.value = "Value must be greater than 0";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) newErrors.endDate = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Discount</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Discount Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter discount name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter discount description"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          {/* Discount Type */}
          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select
              id="discountType"
              value={formData.discountType}
              onChange={(e) => handleInputChange("discountType", e.target.value as 'Percentage' | 'Fixed Amount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
            </select>
          </div>
          {/* Value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
            <input
              type="number"
              id="value"
              value={formData.value}
              onChange={(e) => handleInputChange("value", Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.value ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter discount value"
              min={0}
            />
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
          </div>
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleInputChange("status", formData.status === 1 ? 0 : 1)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${formData.status === 1 ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status === 1 ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span className={`text-sm ${formData.status === 1 ? "text-green-600" : "text-gray-500"}`}>
                {formData.status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              Add Discount
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 