"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerSidebar from "./components/customer-sidebar";
import CustomerTable from "./components/customer-table";
import CustomerDetail from "./components/customer-detail";
import UpdateCustomerModal from "./components/update-customer-modal";
import { Customer, fetchCustomers, updateUserStatus } from "@/services/api/customerApi"; // import API

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchCustomers();
        setCustomers(res.data);
      } catch (error) {
        // handle error if needed
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    if (customer.role !== "user") return false;

    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer...</p>
        </div>
      </div>
    )
  }

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
            onDelete={() => { }}
          />
        )}

        {isUpdateModalOpen && selectedCustomer && (
          <UpdateCustomerModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onSubmit={async (customerData) => {
              try {
                await updateUserStatus(customerData.id, customerData.status);
                // Sau khi cập nhật, reload lại danh sách
                const res = await fetchCustomers();
                setCustomers(res.data);
              } catch (error) {
                // Có thể hiển thị toast lỗi ở đây nếu muốn
              } finally {
                setIsUpdateModalOpen(false);
              }
            }}
            customer={selectedCustomer}
          />
        )}
      </div>
    </div>
  );
}