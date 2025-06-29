import { useState, useEffect } from "react";
import { ShoppingCart, Package } from "lucide-react";
import type { Product, Promo } from "@/types/product";
import { useApi } from "@/hooks/useApi";
import ProductCard from "@/components/products/ProductCard";
import Cart from "@/components/cart/Cart";
import ProductForm from "@/components/forms/ProductForm";
import PromoForm from "@/components/forms/PromoForm";
import ProductManagement from "./ProductManagement";
import TabNavigation, { type TabType } from "@/components/layout/TabNavigation";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const CashRegister = () => {
  const {
    loading,
    error,
    products,
    cartItems,
    cartTotal,
    setError,
    clearError,
    loadProducts,
    loadCart,
    loadCartTotal,
    addToCart,
    updateCartItem,
    clearCart,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useApi();

  const [activeTab, setActiveTab] = useState<TabType>("register");
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [showPromoForm, setShowPromoForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, [loadProducts, loadCart]);

  useEffect(() => {
    if (cartItems.length > 0) {
      loadCartTotal();
    }
  }, [cartItems, loadCartTotal]);

  const handleAddToCart = async (
    productId: number,
    quantity: number = 1
  ): Promise<void> => {
    await addToCart(productId, quantity);
  };

  const handleUpdateCartItem = async (
    id: number,
    quantity: number
  ): Promise<void> => {
    await updateCartItem(id, quantity);
  };

  const handleClearCart = async (): Promise<void> => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      await clearCart();
    }
  };

  const handleSaveProduct = async (productData: any): Promise<void> => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
    }
  };

  const handleSavePromo = async (): Promise<void> => {
    try {
      // Implementation would use promo API service
      // For now, we'll just close the form
      setShowPromoForm(false);
      setEditingPromo(null);
      setSelectedProduct(null);
      await loadProducts(); // Reload to get updated promos
    } catch (error) {
      throw error;
    }
  };

  // const handleDeletePromo = async (
  //   productId: number,
  //   promoId: number
  // ): Promise<void> => {

  const handleDeletePromo = async (): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this promo?")) {
      try {
        // Implementation would use promo API service
        await loadProducts(); // Reload to get updated promos
      } catch (error) {
        setError(
          `Failed to delete promo: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-xl text-gray-600">Loading Cash Register...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-brand-600" />
              Cash Register
            </h1>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ErrorMessage message={error} onDismiss={clearError} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "register" ? (
          /* Register Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Products
                </h2>
                {loading && products.length > 0 && (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-600">
                      Updating...
                    </span>
                  </div>
                )}
              </div>

              {products.length === 0 && !loading ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No products available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add products in the Products tab
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Cart
              cartItems={cartItems}
              cartTotal={cartTotal}
              onUpdateQuantity={handleUpdateCartItem}
              onRemove={(id) => handleUpdateCartItem(id, 0)}
              onClearCart={handleClearCart}
            />
          </div>
        ) : (
          /* Products Management Tab */
          <ProductManagement
            products={products}
            onAddProduct={() => setShowProductForm(true)}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setShowProductForm(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onAddPromo={(product) => {
              setSelectedProduct(product);
              setShowPromoForm(true);
            }}
            onEditPromo={(product, promo) => {
              setSelectedProduct(product);
              setEditingPromo(promo);
              setShowPromoForm(true);
            }}
            onDeletePromo={handleDeletePromo}
            loading={loading}
          />
        )}
      </div>

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showPromoForm && selectedProduct && (
        <PromoForm
          product={selectedProduct}
          promo={editingPromo}
          onSave={handleSavePromo}
          onCancel={() => {
            setShowPromoForm(false);
            setEditingPromo(null);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default CashRegister;
