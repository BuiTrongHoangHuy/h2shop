"use client";

import { Category, Product, ProductVariant } from "@/types";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  categories: Category[];
  variants: ProductVariant[];
  selectedProductIds: string[];
  onToggleProductId: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  totalProducts: number;
  loading: boolean;
}

export default function ProductTable({
  products,
  selectedProduct,
  onProductSelect,
  currentPage,
  onPageChange,
  categories,
  variants,
  selectedProductIds,
  onToggleAll,
  onToggleProductId,
  totalProducts,
  loading,
}: ProductTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const getCategoryName = (categoryId: string) => {
    console.log("categoryName",categoryId);
    const category = categories.find((cat) => cat.id.toString() === categoryId);
    return category ? category.name : "Unknown";
  };

  const getProductVariants = (productId: string) => {
    return variants.filter((variant) => variant.productId === productId);
  };

  const getTotalStock = (productId: string) => {
    const productVariants = getProductVariants(productId);
    return productVariants.reduce(
      (total, variant) => total + variant.stockQuantity,
      0
    );
  };

  const getVariantCount = (productId: string) => {
    return getProductVariants(productId).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={products.length > 0 && products.every((p) =>
                    selectedProductIds.includes(p.id)
                  )}
                  onChange={(e) =>
                    onToggleAll(
                      products.map((p) => p.id),
                      e.target.checked
                    )
                  }
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Variants
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Total Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => onProductSelect(product)}
                className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedProduct?.id === product.id
                    ? "bg-green-50 border-green-200"
                    : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleProductId(product.id);
                    }}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {product.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {product.category?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getVariantCount(product.id)} variants
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {getTotalStock(product.id)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDate(product.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4 border-t">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
