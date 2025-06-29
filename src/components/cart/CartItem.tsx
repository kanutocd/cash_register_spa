import { Plus, Minus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice, formatQuantity } from "@/utils/formatters";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleDecrease = (): void => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = (): void => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = (): void => {
    onRemove(item.id);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
        <p className="text-sm text-gray-600">
          {formatPrice(item.product.price)} each
        </p>
        {item.discount_price > 0 && (
          <p className="text-sm text-green-600 font-medium">
            Discount: -{formatPrice(item.discount_price)}
          </p>
        )}
        {item.free_quantity > 0 && (
          <p className="text-sm text-green-600 font-medium">
            Free Item: +{formatQuantity(item.free_quantity)}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={handleDecrease}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          aria-label="Remove item"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-right ml-4">
        <div className="font-semibold text-gray-900">
          {formatPrice(item.total_price)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
