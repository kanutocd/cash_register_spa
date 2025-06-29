import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Promo,
  CreatePromoRequest,
  UpdatePromoRequest
} from '@/types/product';
import type { CartItem, CartTotal } from '@/types/cart';
import type { ApiError } from '@/types/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: any; // We'll handle JSON stringification in the request method
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: { product },
    });
  }

  async updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: { product },
    });
  }

  async deleteProduct(id: number): Promise<null> {
    return this.request<null>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Promos API
  async getPromos(productId: number): Promise<Promo[]> {
    return this.request<Promo[]>(`/products/${productId}/promos`);
  }

  async createPromo(productId: number, promo: CreatePromoRequest): Promise<Promo> {
    return this.request<Promo>(`/products/${productId}/promos`, {
      method: 'POST',
      body: { promo },
    });
  }

  async updatePromo(
    productId: number,
    promoId: number,
    promo: UpdatePromoRequest
  ): Promise<Promo> {
    return this.request<Promo>(`/products/${productId}/promos/${promoId}`, {
      method: 'PUT',
      body: { promo },
    });
  }

  async deletePromo(productId: number, promoId: number): Promise<null> {
    return this.request<null>(`/products/${productId}/promos/${promoId}`, {
      method: 'DELETE',
    });
  }

  // Cart API
  async getCartItems(): Promise<CartItem[]> {
    return this.request<CartItem[]>('/cart_items');
  }

  async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
    return this.request<CartItem>('/cart_items', {
      method: 'POST',
      body: { cart_item: { product_id: productId, quantity } },
    });
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    return this.request<CartItem>(`/cart_items/${id}`, {
      method: 'PUT',
      body: { cart_item: { quantity } },
    });
  }

  async removeFromCart(id: number): Promise<null> {
    return this.request<null>(`/cart_items/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<null> {
    return this.request<null>('/cart', {
      method: 'DELETE',
    });
  }

  async getCartTotal(): Promise<CartTotal> {
    return this.request<CartTotal>('/cart/total');
  }
}

export default ApiService;
