import { useState, useCallback } from 'react';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import type { CartItem, CartTotal } from '@/types/cart';
import ApiService from '@/services/ApiService';

interface UseApiReturn {
  loading: boolean;
  error: string;
  products: Product[];
  cartItems: CartItem[];
  cartTotal: CartTotal | null;
  setError: (error: string) => void;
  clearError: () => void;
  loadProducts: () => Promise<void>;
  loadCart: () => Promise<void>;
  loadCartTotal: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<void>;
  updateProduct: (id: number, productData: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);

  const api = new ApiService();

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load products: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCart = useCallback(async (): Promise<void> => {
    try {
      const data = await api.getCartItems();
      setCartItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load cart: ${errorMessage}`);
    }
  }, []);

  const loadCartTotal = useCallback(async (): Promise<void> => {
    try {
      const data = await api.getCartTotal();
      setCartTotal(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load cart total: ${errorMessage}`);
    }
  }, []);

  const addToCart = useCallback(async (productId: number, quantity: number = 1): Promise<void> => {
    try {
      await api.addToCart(productId, quantity);
      await loadCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to add to cart: ${errorMessage}`);
    }
  }, [loadCart]);

  const updateCartItem = useCallback(async (id: number, quantity: number): Promise<void> => {
    try {
      if (quantity <= 0) {
        await api.removeFromCart(id);
      } else {
        await api.updateCartItem(id, quantity);
      }
      await loadCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to update cart: ${errorMessage}`);
    }
  }, [loadCart]);

  const clearCart = useCallback(async (): Promise<void> => {
    try {
      await api.clearCart();
      await loadCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to clear cart: ${errorMessage}`);
    }
  }, [loadCart]);

  const createProduct = useCallback(async (productData: CreateProductRequest): Promise<void> => {
    try {
      await api.createProduct(productData);
      await loadProducts();
    } catch (err) {
      throw err;
    }
  }, [loadProducts]);

  const updateProduct = useCallback(async (id: number, productData: UpdateProductRequest): Promise<void> => {
    try {
      await api.updateProduct(id, productData);
      await loadProducts();
    } catch (err) {
      throw err;
    }
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    try {
      await api.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to delete product: ${errorMessage}`);
    }
  }, [loadProducts]);

  return {
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
  };
};
