import type { CartItem as CartItemType, CartTotal } from "@/types/cart";
import { formatPrice, formatQuantity } from "@/utils/formatters";
import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";

interface CartProps {
  cartItems: CartItemType[];
  cartTotal: CartTotal | null;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onClearCart: () => void;
}

const Cart = ({
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onClearCart,
}: CartProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <ShoppingCart className="w-6 h-6 mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
        </div>
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Add some products to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
        </div>
        <button
          onClick={onClearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Cart Total */}
      {cartTotal && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>{formatPrice(cartTotal.subtotal)}</span>
          </div>
          {cartTotal.total_discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Total Discount:</span>
              <span>-{formatPrice(cartTotal.total_discount)}</span>
            </div>
          )}
          {cartTotal.total_free_items > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Total Free Items:</span>
              <span>+{formatQuantity(cartTotal.total_free_items)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-gray-900">
            <span>Total:</span>
            <span>{formatPrice(cartTotal.total)}</span>
          </div>
          <div className="text-sm text-gray-600 text-center">
            {cartTotal.items_count} item{cartTotal.items_count !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
