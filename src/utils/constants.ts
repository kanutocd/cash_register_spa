import type { PromoType } from '@/types/product';

export const PROMO_TYPES: Record<string, PromoType> = {
  BUY_X_GET_Y_FREE: 'buy_x_get_y_free',
  PERCENTAGE_DISCOUNT: 'percentage_discount',
  FIXED_DISCOUNT: 'fixed_discount',
} as const;

export const PROMO_TYPE_LABELS: Record<PromoType, string> = {
  buy_x_get_y_free: 'Buy X Get Y Free',
  percentage_discount: 'Percentage Discount',
  fixed_discount: 'Fixed Amount Discount',
};

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CART_ITEMS: '/cart_items',
  CART: '/cart',
  CART_TOTAL: '/cart/total',
} as const;
