"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Customer,
  Order,
  OrderDetail,
  Payment,
  Product,
  ProductVariant,
} from "@/types";
import TransactionSidebar from "./components/transation-sidebar";
import TransactionTable from "./components/transation-table";
import OrderDetailModal from "./components/order-detail-modal";

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: 1,
    full_name: "Nguyen Van An",
    phone: "0901234567",
    gender: "male",
    role: "user",
    avatar: null,
    address: "123 Le Loi Street, District 1, Ho Chi Minh City",
    status: 1,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: 2,
    full_name: "Tran Thi Binh",
    phone: "0912345678",
    gender: "female",
    role: "user",
    avatar: null,
    address: "456 Nguyen Hue Boulevard, District 1, Ho Chi Minh City",
    status: 1,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 3,
    full_name: "Le Van Cuong",
    phone: "0923456789",
    gender: "male",
    role: "user",
    avatar: null,
    address: "789 Dong Khoi Street, District 1, Ho Chi Minh City",
    status: 1,
    created_at: "2024-01-17T10:20:00Z",
    updated_at: "2024-01-17T10:20:00Z",
  },
];

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced features",
    images: null,
    category_id: 2,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone",
    images: null,
    category_id: 2,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  {
    id: 3,
    name: "Men's T-Shirt",
    description: "Comfortable cotton t-shirt",
    images: null,
    category_id: 4,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
];

const sampleVariants: ProductVariant[] = [
  {
    id: 1,
    productId: 1,
    sku: "IP15P-BLK-128",
    color: "Black",
    size: "128GB",
    price: 25000000,
    stockQuantity: 15,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    productId: 1,
    sku: "IP15P-BLU-256",
    color: "Blue",
    size: "256GB",
    price: 28000000,
    stockQuantity: 8,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 3,
    productId: 2,
    sku: "SGS24-WHT-128",
    color: "White",
    size: "128GB",
    price: 22000000,
    stockQuantity: 12,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  {
    id: 4,
    productId: 2,
    sku: "SGS24-BLK-256",
    color: "Black",
    size: "256GB",
    price: 25000000,
    stockQuantity: 5,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-21T11:00:00Z",
  },
  {
    id: 5,
    productId: 3,
    sku: "TSH-RED-M",
    color: "Red",
    size: "M",
    price: 250000,
    stockQuantity: 25,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
];

const sampleOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    total_price: 53000000,
    status: "delivered",
    created_at: "2024-11-27T13:16:00Z",
    updated_at: "2024-11-28T10:30:00Z",
  },
  {
    id: 2,
    user_id: 2,
    total_price: 22000000,
    status: "shipped",
    created_at: "2024-11-20T15:16:00Z",
    updated_at: "2024-11-25T09:20:00Z",
  },
  {
    id: 3,
    user_id: 1,
    total_price: 500000,
    status: "processing",
    created_at: "2024-11-20T14:51:00Z",
    updated_at: "2024-11-21T08:15:00Z",
  },
  {
    id: 4,
    user_id: 3,
    total_price: 25000000,
    status: "pending",
    created_at: "2024-11-19T15:15:00Z",
    updated_at: "2024-11-19T15:15:00Z",
  },
  {
    id: 5,
    user_id: 2,
    total_price: 750000,
    status: "cancelled",
    created_at: "2024-11-18T15:14:00Z",
    updated_at: "2024-11-19T10:30:00Z",
  },
];

const sampleOrderDetails: OrderDetail[] = [
  // Order 1 details
  {
    id: 1,
    order_id: 1,
    variant_id: 1,
    quantity: 1,
    price: 25000000,
    created_at: "2024-11-27T13:16:00Z",
    updated_at: "2024-11-27T13:16:00Z",
  },
  {
    id: 2,
    order_id: 1,
    variant_id: 2,
    quantity: 1,
    price: 28000000,
    created_at: "2024-11-27T13:16:00Z",
    updated_at: "2024-11-27T13:16:00Z",
  },
  // Order 2 details
  {
    id: 3,
    order_id: 2,
    variant_id: 3,
    quantity: 1,
    price: 22000000,
    created_at: "2024-11-20T15:16:00Z",
    updated_at: "2024-11-20T15:16:00Z",
  },
  // Order 3 details
  {
    id: 4,
    order_id: 3,
    variant_id: 5,
    quantity: 2,
    price: 250000,
    created_at: "2024-11-20T14:51:00Z",
    updated_at: "2024-11-20T14:51:00Z",
  },
  // Order 4 details
  {
    id: 5,
    order_id: 4,
    variant_id: 1,
    quantity: 1,
    price: 25000000,
    created_at: "2024-11-19T15:15:00Z",
    updated_at: "2024-11-19T15:15:00Z",
  },
  // Order 5 details
  {
    id: 6,
    order_id: 5,
    variant_id: 5,
    quantity: 3,
    price: 250000,
    created_at: "2024-11-18T15:14:00Z",
    updated_at: "2024-11-18T15:14:00Z",
  },
];

const samplePayments: Payment[] = [
  {
    id: 1,
    order_id: 1,
    amount: 53000000,
    payment_method: "credit card",
    status: "completed",
    created_at: "2024-11-27T13:20:00Z",
    updated_at: "2024-11-27T13:25:00Z",
  },
  {
    id: 2,
    order_id: 2,
    amount: 22000000,
    payment_method: "bank transfer",
    status: "completed",
    created_at: "2024-11-20T15:20:00Z",
    updated_at: "2024-11-20T16:00:00Z",
  },
  {
    id: 3,
    order_id: 3,
    amount: 500000,
    payment_method: "cash on delivery",
    status: "pending",
    created_at: "2024-11-20T14:55:00Z",
    updated_at: "2024-11-20T14:55:00Z",
  },
  {
    id: 4,
    order_id: 4,
    amount: 25000000,
    payment_method: "credit card",
    status: "pending",
    created_at: "2024-11-19T15:20:00Z",
    updated_at: "2024-11-19T15:20:00Z",
  },
  {
    id: 5,
    order_id: 5,
    amount: 750000,
    payment_method: "bank transfer",
    status: "failed",
    created_at: "2024-11-18T15:18:00Z",
    updated_at: "2024-11-19T10:30:00Z",
  },
];

export default function TransactionPage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("This month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [pendingDateRange, setPendingDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Get customer info by user_id
  const getCustomerInfo = (userId: number) => {
    return sampleCustomers.find((customer) => customer.id === userId);
  };

  // Get order details by order_id
  const getOrderDetails = (orderId: number) => {
    return sampleOrderDetails.filter((detail) => detail.order_id === orderId);
  };

  // Get payment info by order_id
  const getPaymentInfo = (orderId: number) => {
    return samplePayments.find((payment) => payment.order_id === orderId);
  };

  // Cập nhật function getVariantInfo để lấy thông tin product
  const getVariantInfo = (variantId: number) => {
    const variant = sampleVariants.find((v) => v.id === variantId);
    if (!variant) return undefined;

    const product = sampleProducts.find((p) => p.id === variant.productId);
    return {
      ...variant,
      product_name: product?.name || "Unknown Product",
    };
  };

  const filteredOrders = sampleOrders.filter((order) => {
    const customer = getCustomerInfo(order.user_id);
    const matchesSearch =
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      customer?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone.includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filtering logic
    let matchesDateFilter = true;
    if (
      selectedTimeFilter === "Other options" &&
      appliedDateRange.startDate &&
      appliedDateRange.endDate
    ) {
      const orderDate = new Date(order.created_at);
      const startDate = new Date(appliedDateRange.startDate);
      const endDate = new Date(appliedDateRange.endDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      matchesDateFilter = orderDate >= startDate && orderDate <= endDate;
    }

    return matchesSearch && matchesDateFilter;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

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
                  placeholder="Search by order ID, customer name, email or status"
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
              {/* <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button> */}
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
          getCustomerInfo={getCustomerInfo}
          getPaymentInfo={getPaymentInfo}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          order={selectedOrder}
          orderDetails={getOrderDetails(selectedOrder.id)}
          payment={getPaymentInfo(selectedOrder.id)}
          customer={getCustomerInfo(selectedOrder.user_id)}
          getVariantInfo={getVariantInfo}
        />
      )}
    </div>
  );
}
