import { Plus, Tag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, getPromoDescription } from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const activePromos = product.promos?.filter((p) => p.active) || [];

  const handleAddToCart = (): void => {
    onAddToCart(product.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
          {product.code} - {product.name}
        </h3>
        <span className="text-xl font-bold text-brand-600">
          {formatPrice(product.price)}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {product.description}
      </p>

      {/* Promo Badges */}
      {activePromos.length > 0 && (
        <div className="mb-4">
          {activePromos.map((promo) => (
            <div
              key={promo.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2"
            >
              <Tag className="w-3 h-3 mr-1" />
              {getPromoDescription(promo)}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group-hover:scale-105"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
