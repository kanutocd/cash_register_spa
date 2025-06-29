import { describe, it, expect } from 'vitest'
import { formatPrice, getPromoDescription, formatQuantity, truncateText } from '@/utils/formatters'

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats integer prices correctly', () => {
      expect(formatPrice(10)).toBe('€10.00')
    })

    it('formats decimal prices correctly', () => {
      expect(formatPrice(10.99)).toBe('€10.99')
      expect(formatPrice(10.5)).toBe('€10.50')
    })

    it('formats string prices correctly', () => {
      expect(formatPrice('10.99')).toBe('€10.99')
    })

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('€0.00')
    })
  })

  describe('getPromoDescription', () => {
    it('formats buy_x_get_y_free promo', () => {
      const promo = {
        promo_type: 'buy_x_get_y_free',
        trigger_qty: 2,
        free_qty: 1,
        name: 'Test'
      }
      expect(getPromoDescription(promo)).toBe('Buy 2 Get 1 Free')
    })

    it('formats percentage_discount promo', () => {
      const promo = {
        promo_type: 'percentage_discount',
        trigger_qty: 3,
        discount_percentage: 15,
        name: 'Test'
      }
      expect(getPromoDescription(promo)).toBe('15% off when buying 3+')
    })

    it('formats fixed_discount promo', () => {
      const promo = {
        promo_type: 'fixed_discount',
        trigger_qty: 2,
        discount_amount: 5,
        name: 'Test'
      }
      expect(getPromoDescription(promo)).toBe('€5 off each when buying 2+')
    })
  })

  describe('formatQuantity', () => {
    it('formats single item correctly', () => {
      expect(formatQuantity(1)).toBe('1 item')
    })

    it('formats multiple items correctly', () => {
      expect(formatQuantity(5)).toBe('5 items')
    })
  })

  describe('truncateText', () => {
    it('returns original text if within limit', () => {
      expect(truncateText('Short text', 20)).toBe('Short text')
    })

    it('truncates text that exceeds limit', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is a ...')
    })
  })
})
