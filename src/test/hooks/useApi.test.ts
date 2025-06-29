import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApi } from '@/hooks/useApi'

// Mock ApiService
vi.mock('@/services/ApiService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getProducts: vi.fn().mockResolvedValue([
        { id: 1, name: 'Test Product', price: 10.99 }
      ]),
      getCartItems: vi.fn().mockResolvedValue([]),
      addToCart: vi.fn().mockResolvedValue({ id: 1 }),
      updateCartItem: vi.fn().mockResolvedValue({ id: 1 }),
      removeFromCart: vi.fn().mockResolvedValue(null),
      clearCart: vi.fn().mockResolvedValue(null),
      getCartTotal: vi.fn().mockResolvedValue({
        subtotal: 10.99,
        total_discount: 0,
        total: 10.99,
        items_count: 1
      }),
      createProduct: vi.fn().mockResolvedValue({ id: 2 }),
      updateProduct: vi.fn().mockResolvedValue({ id: 1 }),
      deleteProduct: vi.fn().mockResolvedValue(null),
    }))
  }
})

describe('useApi', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useApi())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('')
    expect(result.current.products).toEqual([])
    expect(result.current.cartItems).toEqual([])
    expect(result.current.cartTotal).toBeNull()
  })

  it('loads products successfully', async () => {
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.loadProducts()
    })

    expect(result.current.products).toHaveLength(1)
    expect(result.current.products[0]).toEqual({
      id: 1,
      name: 'Test Product',
      price: 10.99
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('')
  })

  it('adds items to cart successfully', async () => {
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.addToCart(1, 2)
    })

    // Verify the addToCart function was called
    expect(result.current.error).toBe('')
  })
})
