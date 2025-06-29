import type { Product } from './product';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  discount_price: number;
  free_quantity: number;
  product: Product;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCartItemRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartTotal {
  subtotal: number;
  total_discount: number;
  total: number;
  total_free_items: number;
  items_count: number;
}
