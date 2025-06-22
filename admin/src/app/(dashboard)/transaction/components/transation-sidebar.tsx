"use client";

import { Calendar } from "lucide-react";

interface TransactionSidebarProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (filter: string) => void;
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
}

const timeFilters = [
  { name: "All time", type: "radio" },
  { name: "Other options", type: "calendar" },
];

export default function TransactionSidebar({
  selectedTimeFilter,
  onTimeFilterChange,
  dateRange,
  onDateRangeChange,
  onApplyDateRange,
  onClearDateRange,
}: TransactionSidebarProps) {
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value,
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
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

              {/* Date Range Picker - Show when Other options is selected */}
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
