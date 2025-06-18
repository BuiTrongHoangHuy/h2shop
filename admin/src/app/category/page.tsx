"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CategorySidebar from "./components/category-sidebar";
import CategoryTable from "./components/category-table";
import CategoryDetail from "./components/category-detail";
import { Category } from "@/types";
import AddCategoryModal from "./components/add-category-modal";
import UpdateCategoryModal from "./components/update-category-modal";

const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    parent_id: null,
    status: 1,
    image: null,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Smartphones",
    description: "Mobile phones and smartphones",
    parent_id: 1,
    status: 1,
    image: null,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 3,
    name: "Laptops",
    description: "Portable computers and laptops",
    parent_id: 1,
    status: 1,
    image: null,
    created_at: "2024-01-17T10:20:00Z",
    updated_at: "2024-01-17T10:20:00Z",
  },
  {
    id: 4,
    name: "Clothing",
    description: "Fashion and apparel items",
    parent_id: null,
    status: 1,
    image: null,
    created_at: "2024-01-18T11:45:00Z",
    updated_at: "2024-01-18T11:45:00Z",
  },
  {
    id: 5,
    name: "Men's Clothing",
    description: "Clothing items for men",
    parent_id: 4,
    status: 1,
    image: null,
    created_at: "2024-01-19T14:30:00Z",
    updated_at: "2024-01-19T14:30:00Z",
  },
  {
    id: 6,
    name: "Women's Clothing",
    description: "Clothing items for women",
    parent_id: 4,
    status: 1,
    image: null,
    created_at: "2024-01-20T15:15:00Z",
    updated_at: "2024-01-20T15:15:00Z",
  },
  {
    id: 7,
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    parent_id: null,
    status: 0,
    image: null,
    created_at: "2024-01-21T16:00:00Z",
    updated_at: "2024-01-21T16:00:00Z",
  },
  {
    id: 8,
    name: "Furniture",
    description: "Home and office furniture",
    parent_id: 7,
    status: 1,
    image: null,
    created_at: "2024-01-22T17:30:00Z",
    updated_at: "2024-01-22T17:30:00Z",
  },
  {
    id: 9,
    name: "Kitchen Appliances",
    description: "Appliances for kitchen use",
    parent_id: 7,
    status: 1,
    image: null,
    created_at: "2024-01-23T18:45:00Z",
    updated_at: "2024-01-23T18:45:00Z",
  },
  {
    id: 10,
    name: "Sports & Outdoors",
    description: "Sports equipment and outdoor gear",
    parent_id: null,
    status: 0,
    image: null,
    created_at: "2024-01-24T19:20:00Z",
    updated_at: "2024-01-24T19:20:00Z",
  },
];

export default function CategoryPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const filteredCategories = sampleCategories.filter((category) => {
    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Active" && category.status === 1) ||
      (selectedFilter === "Inactive" && category.status === 0) ||
      (selectedFilter === "Parent Categories" && category.parent_id === null) ||
      (selectedFilter === "Sub Categories" && category.parent_id !== null);

    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.id.toString().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const handleToggleCategoryId = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (ids: number[], checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedCategoryIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <div className="flex">
      <CategorySidebar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <div className="flex-1 flex">
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Category</h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="According to the ID, name or description"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                    console.log("Delete these IDs:", selectedCategoryIds);
                    
                  }}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <CategoryTable
            categories={filteredCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={(category) => {
              setSelectedCategory((prev) =>
                prev?.id === category.id ? null : category
              );
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            allCategories={sampleCategories}
            selectedCategoryIds={selectedCategoryIds}
            onToggleAll={handleToggleAll}
            onToggleCategoryId={handleToggleCategoryId}
          />
        </div>

        {selectedCategory && (
          <CategoryDetail
            category={selectedCategory}
            onUpdate={() => setIsUpdateModalOpen(true)}
            onDelete={() => {}}
            allCategories={sampleCategories}
          />
        )}
      </div>
      {isAddModalOpen && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(categoryData) => {
            // Handle category creation here
            console.log("New category:", categoryData)
            setIsAddModalOpen(false)
          }}
          categories={sampleCategories}
        />
      )}

      {isUpdateModalOpen && selectedCategory && (
        <UpdateCategoryModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={(categoryData) => {
            // Handle category update here
            console.log("Updated category:", categoryData)
            setIsUpdateModalOpen(false)
          }}
          categories={sampleCategories}
          category={selectedCategory}
        />
      )}
    </div>
  );
}
