"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionSidebar from "./components/transation-sidebar";
import TransactionTable from "./components/transation-table";
import OrderDetailModal from "./components/order-detail-modal";
import { fetchOrdersWithPayment } from "@/services/api/transactionApi";

// Define API response type
interface ApiOrderResponse {
  status: string;
  data: {
    order: {
      id: string;
      userId: string;
      totalPrice: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    details: {
      id: string;
      orderId: string;
      variantId: string;
      quantity: number;
      price: string;
      image: { url: string };
      sku: string;
      color: string;
      size: string;
      variantPrice: string;
      productId: string;
      productName: string;
      productDescription: string;
      createdAt: string;
      updatedAt: string;
    }[];
    customer: {
      fullName: string;
      phone: string;
      address: string;
    };
    paymentStatus: string;
  }[];
}

export default function TransactionPage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("This month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrderResponse["data"][number] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orders, setOrders] = useState<ApiOrderResponse["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingDateRange, setPendingDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch data from API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetchOrdersWithPayment() // Replace with your API endpoint
        const result: ApiOrderResponse = await response;

        console.log("Fetched orders:", result);

        if (result.status !== "success") {
          throw new Error("API request failed");
        }

        setOrders(result.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Filter orders based on search and date range
  const filteredOrders = orders.filter((item) => {
    const matchesSearch =
      item.order.id.includes(searchQuery.toLowerCase()) ||
      item.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.phone.includes(searchQuery.toLowerCase()) ||
      item.order.status.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDateFilter = true;
    if (
      selectedTimeFilter === "Other options" &&
      appliedDateRange.startDate &&
      appliedDateRange.endDate
    ) {
      const orderDate = new Date(item.order.createdAt);
      const startDate = new Date(appliedDateRange.startDate);
      const endDate = new Date(appliedDateRange.endDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      matchesDateFilter = orderDate >= startDate && orderDate <= endDate;
    }

    return matchesSearch && matchesDateFilter;
  });

  const handleViewDetails = (order: ApiOrderResponse["data"][number]) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const reloadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetchOrdersWithPayment();
      const result: ApiOrderResponse = await response;
      setOrders(result.data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading transactions...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <TransactionSidebar
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
        dateRange={pendingDateRange}
        onDateRangeChange={setPendingDateRange}
        onApplyDateRange={() => setAppliedDateRange(pendingDateRange)}
        onClearDateRange={() => {
          setPendingDateRange({ startDate: "", endDate: "" });
          setAppliedDateRange({ startDate: "", endDate: "" });
        }}
      />

      <div className="flex-1 bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-4">Orders & Transactions</h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, phone or status"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TransactionTable
          orders={filteredOrders}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          orderData={selectedOrder}
          onStatusUpdated={() => {
            setIsDetailModalOpen(false);
            reloadOrders();
          }}
        />
      )}
    </div>
  );
}