"use client";

import { Calendar, BarChart3, TrendingUp, Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingDown, Star } from "lucide-react";
import { DashboardStats } from "@/services/api/reportApi";

interface ReportSidebarProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  selectedTypeFilter: string;
  onTypeFilterChange: (filter: string) => void;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange: (dateRange: {
    startDate: string;
    endDate: string;
  }) => void;
  onApplyDateRange: () => void;
  onClearDateRange: () => void;
  dashboardStats: DashboardStats | null;
}

const timeFilters = [
  { name: "All time", type: "radio" },
  { name: "Other options", type: "calendar" },
];

const typeFilters = [
  { name: "All types", value: "All types" },
  { name: "Sales", value: "Sales", icon: TrendingUp },
  { name: "Products", value: "Products", icon: Package },
  { name: "Financial", value: "Financial", icon: TrendingDown },
  { name: "Reviews", value: "Reviews", icon: Star },
];

export default function ReportSidebar({
  selectedTimeFilter,
  onTimeFilterChange,
  selectedTypeFilter,
  onTypeFilterChange,
  dateRange,
  onDateRangeChange,
  onApplyDateRange,
  onClearDateRange,
  dashboardStats,
}: ReportSidebarProps) {
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value,
    });
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'Sales':
        return <TrendingUp className="h-4 w-4" />;
      case 'Products':
        return <Package className="h-4 w-4" />;
      case 'Financial':
        return <TrendingDown className="h-4 w-4" />;
      case 'Reviews':
        return <Star className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'Sales':
        return 'text-green-600';
      case 'Products':
        return 'text-purple-600';
      case 'Financial':
        return 'text-indigo-600';
      case 'Reviews':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">


        {/* Time Filter */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Time</h2>
          <div className="space-y-3">
            {timeFilters.map((filter) => (
              <div key={filter.name}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="radio"
                      id={filter.name}
                      name="timeFilter"
                      checked={selectedTimeFilter === filter.name}
                      onChange={() => onTimeFilterChange(filter.name)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                        selectedTimeFilter === filter.name
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={() => onTimeFilterChange(filter.name)}
                    >
                      {selectedTimeFilter === filter.name && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-1">
                    <label
                      htmlFor={filter.name}
                      className="text-sm text-gray-700 cursor-pointer"
                      onClick={() => onTimeFilterChange(filter.name)}
                    >
                      {filter.name}
                    </label>
                    {filter.type === "calendar" && (
                      <Calendar className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {filter.name === "Other options" &&
                  selectedTimeFilter === "Other options" && (
                    <div className="mt-3 ml-7 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          From date
                        </label>
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) =>
                            handleDateChange("startDate", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          To date
                        </label>
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) =>
                            handleDateChange("endDate", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      {/* Quick date range buttons */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            const today = new Date();
                            const lastWeek = new Date(
                              today.getTime() - 7 * 24 * 60 * 60 * 1000
                            );
                            onDateRangeChange({
                              startDate: lastWeek.toISOString().split("T")[0],
                              endDate: today.toISOString().split("T")[0],
                            });
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Last 7 days
                        </button>
                        <button
                          onClick={() => {
                            const today = new Date();
                            const lastMonth = new Date(
                              today.getFullYear(),
                              today.getMonth() - 1,
                              today.getDate()
                            );
                            onDateRangeChange({
                              startDate: lastMonth.toISOString().split("T")[0],
                              endDate: today.toISOString().split("T")[0],
                            });
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Last 30 days
                        </button>
                        <button
                          onClick={() => {
                            const today = new Date();
                            const lastQuarter = new Date(
                              today.getFullYear(),
                              today.getMonth() - 3,
                              today.getDate()
                            );
                            onDateRangeChange({
                              startDate: lastQuarter.toISOString().split("T")[0],
                              endDate: today.toISOString().split("T")[0],
                            });
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Last 3 months
                        </button>
                      </div>

                      {/* Apply button */}
                      {dateRange.startDate && dateRange.endDate && (
                        <div className="space-y-2">
                          <button
                            onClick={onApplyDateRange}
                            className="w-full mt-2 px-3 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            Apply Date Range
                          </button>
                          <button
                            onClick={onClearDateRange}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          >
                            Clear Filter
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Report Type</h2>
          <div className="space-y-3">
            {typeFilters.map((filter) => (
                <button
                    key={filter.name}
                    onClick={() => onTypeFilterChange(filter.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${selectedTypeFilter === filter.value
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{filter.name}</span>
                </button>
            ))}
          </div>
        </div>

        {/* Display selected date range */}
        {selectedTimeFilter === "Other options" &&
          dateRange.startDate &&
          dateRange.endDate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-600 mb-1">Selected period:</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(dateRange.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(dateRange.endDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          )}
      </div>
    </div>
  );
} 