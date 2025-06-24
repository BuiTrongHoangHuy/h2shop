"use client";

import { useState, useEffect } from "react";
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
import { categoryApi } from "@/services/api/categoryApi";
import {number} from "zod";

export default function CategoryPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [currentPage, selectedFilter, searchQuery]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const filterOptions:{
        search?: string;
        status?: number;
        parentId?: number | null;
      } = {
        search: searchQuery,
      };
      if (selectedFilter === "Active") filterOptions.status = 1;
      if (selectedFilter === "Inactive") filterOptions.status = 0;
      if (selectedFilter === "Parent Categories") filterOptions.parentId = null;
      if (selectedFilter === "Sub Categories") filterOptions.parentId = 0;

      const response = await categoryApi.getCategories(currentPage, 10, filterOptions);
      setCategories(response.categories);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: {
    name: string;
    description: string;
    parent_id: number | null;
    status: number;
    image: string | null;
  }) => {
    try {
      console.log("category data",categoryData);
      await categoryApi.createCategory({
        name: categoryData.name,
        description: categoryData.description,
        parentId: categoryData.parent_id || undefined,
        image: categoryData.image || undefined,
      });
      setIsAddModalOpen(false);
      loadCategories(); // Reload categories after creation
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryData: {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
    status: number;
    image: string | null;
  }) => {
    if (!selectedCategory) return;
    
    try {
      await categoryApi.updateCategory(selectedCategory.id.toString(), {
        name: categoryData.name,
        description: categoryData.description,
        parentId: categoryData.parent_id || undefined,
        image: categoryData.image || undefined,
      });
      setIsUpdateModalOpen(false);
      loadCategories(); // Reload categories after update
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await categoryApi.deleteCategory(selectedCategory.id.toString());
      setSelectedCategory(null);
      loadCategories(); // Reload categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCategoryIds.length === 0) return;
    
    try {
      await Promise.all(selectedCategoryIds.map(id => categoryApi.deleteCategory(id.toString())));
      setSelectedCategoryIds([]);
      loadCategories(); // Reload categories after deletion
    } catch (error) {
      console.error('Error deleting categories:', error);
      setError('Failed to delete categories');
    }
  };

  const filteredCategories = categories.filter((category) => {
    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Active" && category.status === 1) ||
      (selectedFilter === "Inactive" && category.status === 0) ||
      (selectedFilter === "Parent Categories" && !category.parentId) ||
      (selectedFilter === "Sub Categories" && !!category.parentId);

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

  if (loading && categories.length === 0) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); loadCategories(); }} className="bg-orange-500 hover:bg-orange-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white" 
                  onClick={handleDeleteSelected}
                  disabled={selectedCategoryIds.length === 0}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete ({selectedCategoryIds.length})
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
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            allCategories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onToggleAll={handleToggleAll}
            onToggleCategoryId={handleToggleCategoryId}
          />
        </div>

        {selectedCategory && (
          <CategoryDetail
            category={selectedCategory}
            onUpdate={() => setIsUpdateModalOpen(true)}
            onDelete={handleDeleteCategory}
            allCategories={categories}
          />
        )}
      </div>
      
      {isAddModalOpen && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateCategory}
          categories={categories}
        />
      )}

      {isUpdateModalOpen && selectedCategory && (
        <UpdateCategoryModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateCategory}
          categories={categories}
          category={selectedCategory}
        />
      )}
    </div>
  );
}
