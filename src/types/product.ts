export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  promos?: Promo[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

export interface Promo {
  id: number;
  product_id: number;
  name: string;
  promo_type: PromoType;
  trigger_qty: number;
  free_qty?: number;
  discount_percentage?: number;
  discount_amount?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PromoType = 'buy_x_get_y_free' | 'percentage_discount' | 'fixed_discount';

export interface CreatePromoRequest {
  name: string;
  promo_type: PromoType;
  trigger_qty: number;
  free_qty?: number;
  discount_percentage?: number;
  discount_amount?: number;
  active: boolean;
}

export interface UpdatePromoRequest extends Partial<CreatePromoRequest> { }

export interface PromoFormData {
  name: string;
  promo_type: PromoType;
  trigger_qty: number;
  free_qty: number;
  discount_percentage: number;
  discount_amount: number;
  active: boolean;
}
