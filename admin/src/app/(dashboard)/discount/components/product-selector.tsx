"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Search } from "lucide-react";
import { productApi, Product } from "@/services/api/productApi";

interface ProductSelectorProps {
  selectedProductIds: number[];
  onProductIdsChange: (productIds: number[]) => void;
  disabled?: boolean;
}

export default function ProductSelector({ selectedProductIds, onProductIdsChange, disabled = false }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Load selected products when selectedProductIds changes
    if (selectedProductIds.length > 0) {
      loadSelectedProducts();
    } else {
      setSelectedProducts([]);
    }
  }, [selectedProductIds]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts(1, 100, { search: searchQuery });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedProducts = async () => {
    try {
      const selectedProductsData: Product[] = [];
      for (const productId of selectedProductIds) {
        try {
          const response = await productApi.getProductById(productId.toString());
          selectedProductsData.push(response.data);
        } catch (error) {
          console.error(`Error loading product ${productId}:`, error);
        }
      }
      setSelectedProducts(selectedProductsData);
    } catch (error) {
      console.error('Error loading selected products:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce search
    setTimeout(() => {
      loadProducts();
    }, 300);
  };

  const handleAddProduct = (product: Product) => {
    if (!selectedProductIds.includes(parseInt(product.id))) {
      const newProductIds = [...selectedProductIds, parseInt(product.id)];
      onProductIdsChange(newProductIds);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleRemoveProduct = (productId: number) => {
    const newProductIds = selectedProductIds.filter(id => id !== productId);
    onProductIdsChange(newProductIds);
  };

  const filteredProducts = products.filter(product => 
    !selectedProductIds.includes(parseInt(product.id))
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Associated Products
      </label>
      
      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Selected Products:</h4>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  {product.images && product.images.length > 0 && (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProduct(parseInt(product.id))}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Products
      </Button>

      {/* Product Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Select Products</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
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
            <div className="flex-1 overflow-y-auto max-h-96">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="p-4 space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                    >
                      {product.images && product.images.length > 0 && (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
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
                  {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
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