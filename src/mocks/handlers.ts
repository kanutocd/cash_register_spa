import { http, HttpResponse } from 'msw'
import type { Product } from '@/types/product'
import type { CartItem, CartTotal } from '@/types/cart'

const baseURL = 'http://localhost:3000/api/v1'

// Mock data that persists during the session
let mockProducts: Product[] = [
  {
    id: 1,
    code: 'AP1',
    name: 'Apple',
    description: 'Fresh red apples from local orchards',
    price: 1.50,
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    promos: [
      {
        id: 1,
        product_id: 1,
        name: 'Buy 2 Get 1 Free',
        promo_type: 'buy_x_get_y_free',
        trigger_qty: 2,
        free_qty: 1,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
    ]
  },
  {
    id: 2,
    code: 'CF1',
    name: 'Coffee',
    description: 'Premium coffee beans, medium roast',
    price: 12.99,
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    promos: [
      {
        id: 2,
        product_id: 2,
        name: '15% Off on 3+',
        promo_type: 'percentage_discount',
        trigger_qty: 3,
        discount_percentage: 15.0,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
    ]
  },
  {
    id: 3,
    code: 'BR1',
    name: 'Bread',
    description: 'Fresh baked whole wheat bread',
    price: 3.50,
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    promos: [
      {
        id: 3,
        product_id: 3,
        name: '$1 Off Each',
        promo_type: 'fixed_discount',
        trigger_qty: 2,
        discount_amount: 1.0,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
    ]
  }
]

let mockCartItems: CartItem[] = []

let nextProductId = 4
let nextPromoId = 4
let nextCartItemId = 1

// Helper function to calculate cart totals
const calculateCartTotal = (): CartTotal => {
  let subtotal = 0
  let totalDiscount = 0
  let itemsCount = 0
  let totalFreeItems = 0

  mockCartItems.forEach(item => {
    const itemSubtotal = item.quantity * item.product.price
    subtotal += itemSubtotal
    totalDiscount += item.discount_price
    totalFreeItems += item.free_quantity
    itemsCount += item.quantity
  })

  return {
    subtotal,
    total_discount: totalDiscount,
    total: subtotal - totalDiscount,
    total_free_items: totalFreeItems,
    items_count: itemsCount + totalFreeItems
  }
}

// Helper function to apply promos to cart items
const applyPromos = (cartItem: CartItem): CartItem => {
  const product = cartItem.product
  const activePromos = product.promos?.filter(p => p.active) || []

  if (activePromos.length === 0) {
    return {
      ...cartItem,
      total_price: cartItem.quantity * product.price,
      discount_price: 0
    }
  }

  // Apply the first active promo (in a real app, you might have more complex logic)
  const promo = activePromos[0]
  let totalPrice = cartItem.quantity * product.price
  let discountAmount = 0

  if (promo && cartItem.quantity >= promo.trigger_qty) {
    switch (promo.promo_type) {
      case 'buy_x_get_y_free':
        if (promo.free_qty) {
          const sets = Math.floor(cartItem.quantity / promo.trigger_qty)
          const freeItems = sets * promo.free_qty
          discountAmount = Math.min(freeItems, cartItem.quantity) * product.price
          totalPrice -= discountAmount
        }
        break

      case 'percentage_discount':
        if (promo.discount_percentage) {
          const eligibleItems = Math.floor(cartItem.quantity / promo.trigger_qty) * promo.trigger_qty
          const discount = (eligibleItems * product.price * promo.discount_percentage) / 100
          discountAmount = discount
          totalPrice -= discount
        }
        break

      case 'fixed_discount':
        if (promo.discount_amount) {
          const eligibleItems = Math.floor(cartItem.quantity / promo.trigger_qty) * promo.trigger_qty
          const discount = eligibleItems * promo.discount_amount
          discountAmount = Math.min(discount, totalPrice)
          totalPrice -= discountAmount
        }
        break
    }
  }

  return {
    ...cartItem,
    total_price: Math.max(0, totalPrice),
    discount_price: discountAmount
  }
}

export const handlers = [
  // Products endpoints
  http.get(`${baseURL}/products`, () => {
    console.log('🔍 MSW: GET /products - Returning', mockProducts.length, 'products')
    return HttpResponse.json(mockProducts.filter(p => p.active))
  }),

  http.get(`${baseURL}/products/:id`, ({ params }) => {
    const productId = parseInt(params.id as string)
    const product = mockProducts.find(p => p.id === productId)

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log('🔍 MSW: GET /products/:id - Returning product', productId)
    return HttpResponse.json(product)
  }),

  http.post(`${baseURL}/products`, async ({ request }) => {
    const body = await request.json() as { product: any }
    const newProduct: Product = {
      id: nextProductId++,
      code: body.product.code,
      name: body.product.name,
      description: body.product.description,
      price: body.product.price,
      active: body.product.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      promos: []
    }

    mockProducts.push(newProduct)
    console.log('✅ MSW: POST /products - Created product', newProduct.id, newProduct.name)
    return HttpResponse.json(newProduct, { status: 201 })
  }),

  http.put(`${baseURL}/products/:id`, async ({ params, request }) => {
    const productId = parseInt(params.id as string)
    const body = await request.json() as { product: any }
    const productIndex = mockProducts.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...body.product,
      updated_at: new Date().toISOString()
    }

    console.log('✏️ MSW: PUT /products/:id - Updated product', productId)
    return HttpResponse.json(mockProducts[productIndex])
  }),

  http.delete(`${baseURL}/products/:id`, ({ params }) => {
    const productId = parseInt(params.id as string)
    const productIndex = mockProducts.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Soft delete - just mark as inactive
    if (mockProducts[productIndex]) {
      mockProducts[productIndex].active = false
      mockProducts[productIndex].updated_at = new Date().toISOString()
    }

    console.log('🗑️ MSW: DELETE /products/:id - Soft deleted product', productId)
    return new HttpResponse(null, { status: 204 })
  }),

  // Promos endpoints
  http.get(`${baseURL}/products/:productId/promos`, ({ params }) => {
    const productId = parseInt(params.productId as string)
    const product = mockProducts.find(p => p.id === productId)

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log('🔍 MSW: GET /products/:id/promos - Returning promos for product', productId)
    return HttpResponse.json(product.promos || [])
  }),

  http.post(`${baseURL}/products/:productId/promos`, async ({ params, request }) => {
    const productId = parseInt(params.productId as string)
    const body = await request.json() as { promo: any }
    const productIndex = mockProducts.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const newPromo = {
      id: nextPromoId++,
      product_id: productId,
      ...body.promo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (mockProducts[productIndex]) {
      if (!mockProducts[productIndex].promos) {
        mockProducts[productIndex].promos = []
      }
      mockProducts[productIndex].promos!.push(newPromo)
    }


    console.log('✅ MSW: POST /products/:id/promos - Created promo', newPromo.id)
    return HttpResponse.json(newPromo, { status: 201 })
  }),

  http.put(`${baseURL}/products/:productId/promos/:id`, async ({ params, request }) => {
    const productId = parseInt(params.productId as string)
    const promoId = parseInt(params.id as string)
    const body = await request.json() as { promo: any }

    const productIndex = mockProducts.findIndex(p => p.id === productId)
    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (mockProducts[productIndex]) {
      const promoIndex = mockProducts[productIndex].promos?.findIndex(p => p.id === promoId) ?? -1
      if (promoIndex === -1) {
        return HttpResponse.json({ error: 'Promo not found' }, { status: 404 })
      }

      mockProducts[productIndex].promos![promoIndex] = {
        ...mockProducts[productIndex].promos![promoIndex],
        ...body.promo,
        updated_at: new Date().toISOString()
      }

      console.log('✏️ MSW: PUT /products/:id/promos/:id - Updated promo', promoId)
      return HttpResponse.json(mockProducts[productIndex].promos![promoIndex])
    }

  }),

  http.delete(`${baseURL}/products/:productId/promos/:id`, ({ params }) => {
    const productId = parseInt(params.productId as string)
    const promoId = parseInt(params.id as string)

    const productIndex = mockProducts.findIndex(p => p.id === productId)
    if (productIndex === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (mockProducts[productIndex]) {
      const promoIndex = mockProducts[productIndex].promos?.findIndex(p => p.id === promoId) ?? -1
      if (promoIndex === -1) {
        return HttpResponse.json({ error: 'Promo not found' }, { status: 404 })
      }

      mockProducts[productIndex].promos!.splice(promoIndex, 1)

    }

    console.log('🗑️ MSW: DELETE /products/:id/promos/:id - Deleted promo', promoId)
    return new HttpResponse(null, { status: 204 })
  }),

  // Cart endpoints
  http.get(`${baseURL}/cart_items`, () => {
    console.log('🛒 MSW: GET /cart_items - Returning', mockCartItems.length, 'cart items')
    return HttpResponse.json(mockCartItems)
  }),

  http.post(`${baseURL}/cart_items`, async ({ request }) => {
    const body = await request.json() as { cart_item: { product_id: number; quantity: number } }
    const productId = body.cart_item.product_id
    const quantity = body.cart_item.quantity

    const product = mockProducts.find(p => p.id === productId && p.active)
    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItemIndex = mockCartItems.findIndex(item => item.product_id === productId)

    if (existingItemIndex >= 0 && mockCartItems[existingItemIndex]) {
      // Update existing item
      mockCartItems[existingItemIndex].quantity += quantity
      mockCartItems[existingItemIndex] = applyPromos(mockCartItems[existingItemIndex])

      console.log('🛒 MSW: POST /cart_items - Updated existing cart item', productId)
      return HttpResponse.json(mockCartItems[existingItemIndex], { status: 201 })
    } else {
      // Create new cart item
      let newCartItem: CartItem = {
        id: nextCartItemId++,
        product_id: productId,
        quantity,
        total_price: quantity * product.price,
        discount_price: 0,
        product,
        free_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      newCartItem = applyPromos(newCartItem)
      mockCartItems.push(newCartItem)

      console.log('🛒 MSW: POST /cart_items - Added new cart item', productId)
      return HttpResponse.json(newCartItem, { status: 201 })
    }
  }),

  http.put(`${baseURL}/cart_items/:id`, async ({ params, request }) => {
    const cartItemId = parseInt(params.id as string)
    const body = await request.json() as { cart_item: { quantity: number } }
    const itemIndex = mockCartItems.findIndex(item => item.id === cartItemId)

    if (itemIndex === -1) {
      return HttpResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    if (mockCartItems[itemIndex]) {
      mockCartItems[itemIndex].quantity = body.cart_item.quantity
      mockCartItems[itemIndex].updated_at = new Date().toISOString()
      mockCartItems[itemIndex] = applyPromos(mockCartItems[itemIndex])

      console.log('🛒 MSW: PUT /cart_items/:id - Updated cart item', cartItemId, 'quantity to', body.cart_item.quantity)
      return HttpResponse.json(mockCartItems[itemIndex])

    }
  }),

  http.delete(`${baseURL}/cart_items/:id`, ({ params }) => {
    const cartItemId = parseInt(params.id as string)
    const itemIndex = mockCartItems.findIndex(item => item.id === cartItemId)

    if (itemIndex === -1) {
      return HttpResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    mockCartItems.splice(itemIndex, 1)

    console.log('🛒 MSW: DELETE /cart_items/:id - Removed cart item', cartItemId)
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete(`${baseURL}/cart`, () => {
    mockCartItems = []
    console.log('🛒 MSW: DELETE /cart - Cleared all cart items')
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${baseURL}/cart/total`, () => {
    const total = calculateCartTotal()
    console.log('🛒 MSW: GET /cart/total - Calculated total:', total)
    return HttpResponse.json(total)
  })
]
