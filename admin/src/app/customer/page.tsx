"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Upload,
  FileText,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerSidebar from "./components/customer-sidebar";
import CustomerTable from "./components/customer-table";
import CustomerDetail from "./components/customer-detail";
import { Customer } from "@/types";
import UpdateCustomerModal from "./components/update-customer-modal";

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
    created_at: "2023-01-01T10:00:00Z",
    updated_at: "2023-01-01T10:00:00Z",
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
    created_at: "2023-02-10T08:30:00Z",
    updated_at: "2023-02-10T08:30:00Z",
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
    created_at: "2024-01-05T09:00:00Z",
    updated_at: "2024-01-05T09:00:00Z",
  },
  {
    id: 4,
    full_name: "Pham Thi Dung",
    phone: "0934567890",
    gender: "female",
    role: "user",
    avatar: null,
    address: "321 Ham Nghi Street, District 1, Ho Chi Minh City",
    status: 1,
    created_at: "2022-11-20T07:45:00Z",
    updated_at: "2022-11-20T07:45:00Z",
  },
  {
    id: 5,
    full_name: "Hoang Van Em",
    phone: "0945678901",
    gender: "male",
    role: "user",
    avatar: null,
    address: "654 Pasteur Street, District 3, Ho Chi Minh City",
    status: 0,
    created_at: "2023-06-12T11:20:00Z",
    updated_at: "2023-06-12T11:20:00Z",
  },
  {
    id: 6,
    full_name: "Vu Thi Giang",
    phone: "0956789012",
    gender: "female",
    role: "user",
    avatar: null,
    address: "987 Cach Mang Thang Tam Street, District 3, Ho Chi Minh City",
    status: 1,
    created_at: "2023-09-30T14:00:00Z",
    updated_at: "2023-09-30T14:00:00Z",
  },
];

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const filteredCustomers = sampleCustomers.filter((customer) => {
    const matchesSearch =
      customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);

    const matchesFilter =
      selectedCategory === "All" ||
      (selectedCategory === "Active" && customer.status === 1) ||
      (selectedCategory === "Inactive" && customer.status === 0);
    return matchesSearch && matchesFilter;
  });

  const handleToggleCustomerId = (id: number) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: number[], checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedCustomerIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <div className="flex">
      <CustomerSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Customer</h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="According to the code, name or phone number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    console.log("Delete these IDs:", selectedCustomerIds);
                    
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <CustomerTable
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onCustomerSelect={(customer) => {
              setSelectedCustomer((prev) =>
                prev?.id === customer.id ? null : customer
              );
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            selectedCustomerIds={selectedCustomerIds}
            onToggleCustomerId={handleToggleCustomerId}
            onToggleAll={handleToggleAll}
          />
        </div>

        {selectedCustomer && (
          <CustomerDetail
            customer={selectedCustomer}
            onUpdate={() => setIsUpdateModalOpen(true)}
            onDelete={() => {}}
          />
        )}

        {isUpdateModalOpen && selectedCustomer && (
          <UpdateCustomerModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onSubmit={(customerData) => {
              // Handle customer status update here
              console.log("Updated customer status:", customerData)
              setIsUpdateModalOpen(false)
            }}
            customer={selectedCustomer}
          />
        )}
      </div>
    </div>
  );
}
