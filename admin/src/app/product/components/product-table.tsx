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
  selectedProductIds: number[];
  onToggleProductId: (id: number) => void;
  onToggleAll: (ids: number[], checked: boolean) => void;
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
}: ProductTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getProductVariants = (productId: number) => {
    return variants.filter((variant) => variant.productId === productId);
  };

  const getTotalStock = (productId: number) => {
    const productVariants = getProductVariants(productId);
    return productVariants.reduce(
      (total, variant) => total + variant.stockQuantity,
      0
    );
  };

  const getVariantCount = (productId: number) => {
    return getProductVariants(productId).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

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
                  checked={currentProducts.every((c) =>
                    selectedProductIds.includes(c.id)
                  )}
                  onChange={(e) =>
                    onToggleAll(
                      currentProducts.map((c) => c.id),
                      e.target.checked
                    )
                  }
                />
              </th>
              <th className="w-12 px-4 py-3 text-left">
                <Star className="h-4 w-4 text-gray-400" />
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
            {currentProducts.map((product) => (
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
                <td className="px-4 py-3">
                  <Star className="h-4 w-4 text-gray-400" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {product.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {getCategoryName(product.category_id)}
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
                  {formatDate(product.created_at)}
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
