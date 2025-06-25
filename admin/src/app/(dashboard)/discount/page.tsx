"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DiscountTable from "./components/discount-table";
import DiscountSidebar from "./components/discount-sidebar";
import DiscountProductManager from "./components/discount-product-manager";
import AddDiscountModal from "./components/add-discount-modal";
import UpdateDiscountModal from "./components/update-discount-modal";
import { Discount } from "@/types";
import { discountApi } from "@/services/api/discountApi";

export default function DiscountPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiscounts();
  }, [currentPage, selectedFilter]);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountApi.getDiscounts(currentPage, 10);
      setDiscounts(response.discounts);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      setError(error.message || 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async (discountData: any) => {
    try {
      await discountApi.createDiscount(discountData);
      setIsAddModalOpen(false);
      loadDiscounts();
    } catch (error) {
      setError('Failed to create discount');
    }
  };

  const handleUpdateDiscount = async (discountData: any) => {
    if (!selectedDiscount) return;
    try {
      await discountApi.updateDiscount(selectedDiscount.id, discountData);
      setIsUpdateModalOpen(false);
      loadDiscounts();
    } catch (error) {
      setError('Failed to update discount');
    }
  };

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return;
    try {
      await discountApi.deleteDiscount(selectedDiscount.id);
      setSelectedDiscount(null);
      loadDiscounts();
    } catch (error) {
      setError('Failed to delete discount');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDiscountIds.length === 0) return;
    try {
      await Promise.all(selectedDiscountIds.map(id => discountApi.deleteDiscount(id)));
      setSelectedDiscountIds([]);
      loadDiscounts();
    } catch (error) {
      setError('Failed to delete discounts');
    }
  };

  const handleToggleDiscountId = (id: number) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: number[], checked: boolean) => {
    if (checked) {
      setSelectedDiscountIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedDiscountIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  const filteredDiscounts = discounts.filter((discount) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    switch (selectedFilter) {
      case "Active":
        return discount.status === 1 && new Date(discount.startDate)  <= new Date() && new Date( discount.endDate )>= new Date();
      case "Inactive":
        return discount.status === 1 && (new Date(discount.startDate)  > new Date() || new Date( discount.endDate ) < new Date()) ;
      case "Percentage":
        return discount.discountType === 'Percentage';
      case "Fixed Amount":
        return discount.discountType === 'Fixed Amount';
      case "Expired":
        return endDate < now;
      case "Upcoming":
        return startDate > now;
      case "Current":
        return startDate <= now && endDate >= now;
      default:
        return true;
    }
  });

  if (loading && discounts.length === 0) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading discounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); loadDiscounts(); }} className="bg-orange-500 hover:bg-orange-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <DiscountSidebar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Discounts</h1>
            <div className="flex items-center justify-between mb-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddModalOpen(true)}>
                Add
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white" 
                onClick={handleDeleteSelected}
                disabled={selectedDiscountIds.length === 0}
              >
                Delete ({selectedDiscountIds.length})
              </Button>
            </div>
          </div>
          <DiscountTable
            discounts={filteredDiscounts}
            selectedDiscount={selectedDiscount}
            onDiscountSelect={(discount) => {
              setSelectedDiscount((prev) =>
                prev?.id === discount.id ? null : discount
              );
            }}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            allDiscounts={discounts}
            selectedDiscountIds={selectedDiscountIds}
            onToggleAll={handleToggleAll}
            onToggleDiscountId={handleToggleDiscountId}
          />
        </div>
        {selectedDiscount && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">Discount Information</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <h2 className="text-lg font-semibold text-blue-600">{selectedDiscount.name}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Discount ID:</div>
                  <div className="font-medium">{selectedDiscount.id}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Status:</div>
                  <div className={`font-medium ${selectedDiscount.status === 1 ? "text-green-600" : "text-red-600"}`}>
                    {selectedDiscount.status === 1 ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Discount Name:</div>
                  <div className="font-medium">{selectedDiscount.name}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Description:</div>
                  <div className="font-medium text-sm leading-relaxed">{selectedDiscount.description}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Type:</div>
                  <div className="font-medium">{selectedDiscount.discountType}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Value:</div>
                  <div className="font-medium">{selectedDiscount.discountType === 'Percentage' ? `${selectedDiscount.value}%` : `$${selectedDiscount.value}`}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Start Date:</div>
                  <div className="font-medium">{new Date(selectedDiscount.startDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">End Date:</div>
                  <div className="font-medium">{new Date(selectedDiscount.endDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Created Date:</div>
                  <div className="font-medium">{new Date(selectedDiscount.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Updated Date:</div>
                  <div className="font-medium">{new Date(selectedDiscount.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Product Manager */}
              <div className="border-t pt-4 max-h-[200px] overflow-y-auto">
                <DiscountProductManager
                  discount={selectedDiscount}
                  onProductAdded={loadDiscounts}
                  onProductRemoved={loadDiscounts}
                />
              </div>
            </div>
            <div className="p-4 border-t space-y-2">
              <Button onClick={() => setIsUpdateModalOpen(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Update
              </Button>
              <Button onClick={handleDeleteDiscount} variant="destructive" className="w-full text-white bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
      {isAddModalOpen && (
        <AddDiscountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateDiscount}
        />
      )}
      {isUpdateModalOpen && selectedDiscount && (
        <UpdateDiscountModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateDiscount}
          discount={selectedDiscount}
        />
      )}
    </div>
  );
}

