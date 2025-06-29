import { Plus, Edit2, Trash2, Package, Tag } from "lucide-react";
import type { Product, Promo } from "@/types/product";
import { formatPrice, getPromoDescription } from "@/utils/formatters";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ProductManagementProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onAddPromo: (product: Product) => void;
  onEditPromo: (product: Product, promo: Promo) => void;
  onDeletePromo: (productId: number, promoId: number) => void;
  loading: boolean;
}

const ProductManagement = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddPromo,
  onEditPromo,
  onDeletePromo,
  loading,
}: ProductManagementProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button
          onClick={onAddProduct}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 flex items-center transition-all duration-200"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promos
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {product.promos && product.promos.length > 0 ? (
                        product.promos.map((promo) => (
                          <div
                            key={promo.id}
                            className="flex items-center justify-between"
                          >
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                promo.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {getPromoDescription(promo)}
                            </span>
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={() => onEditPromo(product, promo)}
                                className="p-1 text-brand-600 hover:text-brand-700 transition-colors"
                                disabled={loading}
                                aria-label="Edit promo"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  onDeletePromo(product.id, promo.id)
                                }
                                className="p-1 text-red-600 hover:text-red-700 transition-colors"
                                disabled={loading}
                                aria-label="Delete promo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No promos</span>
                      )}
                      <button
                        onClick={() => onAddPromo(product)}
                        className="text-xs text-brand-600 hover:text-brand-700 flex items-center transition-colors"
                        disabled={loading}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Promo
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all duration-200"
                        disabled={loading}
                        aria-label="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        disabled={loading}
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first product to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
