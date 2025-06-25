"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Search } from "lucide-react";
import { Discount } from "@/types";
import { discountApi } from "@/services/api/discountApi";
import { productApi, Product } from "@/services/api/productApi";

interface DiscountProductManagerProps {
  discount: Discount;
  onProductAdded?: () => void;
  onProductRemoved?: () => void;
}

export default function DiscountProductManager({ discount, onProductAdded, onProductRemoved }: DiscountProductManagerProps) {
  const [associatedProducts, setAssociatedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssociatedProducts();
  }, [discount.id]);

  const loadAssociatedProducts = async () => {
    try {
      setLoading(true);
      const productIds = await discountApi.getProductsForDiscount(discount.id);
      const products: Product[] = [];
      
      for (const productId of productIds) {
        try {
          const response = await productApi.getProductById(productId.toString());
          products.push(response.data);
        } catch (error) {
          console.error(`Error loading product ${productId}:`, error);
        }
      }
      
      setAssociatedProducts(products);
    } catch (error) {
      console.error('Error loading associated products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableProducts = async () => {
    try {
      const response = await productApi.getProducts(1, 100, { search: searchQuery });
      const availableProducts = response.data.products.filter(
        product => !associatedProducts.some(ap => ap.id === product.id)
      );
      setAvailableProducts(availableProducts);
    } catch (error) {
      console.error('Error loading available products:', error);
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await discountApi.addProductToDiscount(discount.id, parseInt(product.id));
      await loadAssociatedProducts();
      onProductAdded?.();
      setIsAddModalOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error('Error adding product to discount:', error);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      await discountApi.removeProductFromDiscount(discount.id, productId);
      await loadAssociatedProducts();
      onProductRemoved?.();
    } catch (error) {
      console.error('Error removing product from discount:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setTimeout(() => {
      loadAvailableProducts();
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Associated Products</h3>
        {/*<Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>*/}
      </div>

      {/* Associated Products List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-xs text-gray-600 mt-2">Loading products...</p>
        </div>
      ) : associatedProducts.length > 0 ? (
        <div className="space-y-2">
          {associatedProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                {product.images && product.images.length > 0 && (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name}
                    className="w-6 h-6 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-xs font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">ID: {product.id}</p>
                </div>
              </div>
              {/*<Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveProduct(parseInt(product.id))}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
              >
                <X className="h-3 w-3" />
              </Button>*/}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p className="text-xs">No products associated with this discount</p>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add Products to Discount</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto max-h-64">
              {availableProducts.length > 0 ? (
                <div className="p-4 space-y-2">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                    >
                      {product.images && product.images.length > 0 && (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.description}</p>
                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? 'No products found matching your search.' : 'No products available to add.'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <Button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 