import type { CreateProductRequest } from '@/types/product';
import type { CreatePromoRequest } from '@/types/product';

// TODO: some of these validations are not needed.

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Product validation
export const validateProduct = (product: Partial<CreateProductRequest>): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required');
  } else if (product.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  } else if (product.name.trim().length > 100) {
    errors.push('Product name must be less than 100 characters');
  }

  // Description validation
  if (!product.description || product.description.trim().length === 0) {
    errors.push('Product description is required');
  } else if (product.description.trim().length < 10) {
    errors.push('Product description must be at least 10 characters long');
  } else if (product.description.trim().length > 500) {
    errors.push('Product description must be less than 500 characters');
  }

  // Price validation
  if (product.price === undefined || product.price === null) {
    errors.push('Product price is required');
  } else if (typeof product.price !== 'number' || isNaN(product.price)) {
    errors.push('Product price must be a valid number');
  } else if (product.price <= 0) {
    errors.push('Product price must be greater than $0.00');
  } else if (product.price > 10000) {
    errors.push('Product price must be less than $10,000.00');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Promo validation
export const validatePromo = (promo: Partial<CreatePromoRequest>): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!promo.name || promo.name.trim().length === 0) {
    errors.push('Promo name is required');
  } else if (promo.name.trim().length < 3) {
    errors.push('Promo name must be at least 3 characters long');
  } else if (promo.name.trim().length > 100) {
    errors.push('Promo name must be less than 100 characters');
  }

  // Promo type validation
  const validPromoTypes = ['buy_x_get_y_free', 'percentage_discount', 'fixed_discount'];
  if (!promo.promo_type) {
    errors.push('Promo type is required');
  } else if (!validPromoTypes.includes(promo.promo_type)) {
    errors.push('Invalid promo type');
  }

  // Trigger quantity validation
  if (promo.trigger_qty === undefined || promo.trigger_qty === null) {
    errors.push('Trigger quantity is required');
  } else if (typeof promo.trigger_qty !== 'number' || isNaN(promo.trigger_qty)) {
    errors.push('Trigger quantity must be a valid number');
  } else if (promo.trigger_qty <= 0) {
    errors.push('Trigger quantity must be greater than 0');
  } else if (promo.trigger_qty > 1000) {
    errors.push('Trigger quantity must be less than 1000');
  } else if (!Number.isInteger(promo.trigger_qty)) {
    errors.push('Trigger quantity must be a whole number');
  }

  // Type-specific validation
  if (promo.promo_type === 'buy_x_get_y_free') {
    if (promo.free_qty === undefined || promo.free_qty === null) {
      errors.push('Free quantity is required for buy X get Y free promos');
    } else if (typeof promo.free_qty !== 'number' || isNaN(promo.free_qty)) {
      errors.push('Free quantity must be a valid number');
    } else if (promo.free_qty <= 0) {
      errors.push('Free quantity must be greater than 0');
    } else if (promo.free_qty > 1000) {
      errors.push('Free quantity must be less than 1000');
    } else if (!Number.isInteger(promo.free_qty)) {
      errors.push('Free quantity must be a whole number');
    }
  }

  if (promo.promo_type === 'percentage_discount') {
    if (promo.discount_percentage === undefined || promo.discount_percentage === null) {
      errors.push('Discount percentage is required for percentage discount promos');
    } else if (typeof promo.discount_percentage !== 'number' || isNaN(promo.discount_percentage)) {
      errors.push('Discount percentage must be a valid number');
    } else if (promo.discount_percentage <= 0) {
      errors.push('Discount percentage must be greater than 0');
    } else if (promo.discount_percentage > 100) {
      errors.push('Discount percentage must be 100% or less');
    }
  }

  if (promo.promo_type === 'fixed_discount') {
    if (promo.discount_amount === undefined || promo.discount_amount === null) {
      errors.push('Discount amount is required for fixed discount promos');
    } else if (typeof promo.discount_amount !== 'number' || isNaN(promo.discount_amount)) {
      errors.push('Discount amount must be a valid number');
    } else if (promo.discount_amount <= 0) {
      errors.push('Discount amount must be greater than $0.00');
    } else if (promo.discount_amount > 1000) {
      errors.push('Discount amount must be less than $1,000.00');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Email validation helper
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation helper (US format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

// Currency validation helper
export const validateCurrency = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(numValue) && numValue >= 0 && numValue <= 10000;
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

// String length validation
export const validateStringLength = (
  value: string,
  fieldName: string,
  min: number = 0,
  max: number = 1000
): string | null => {
  if (!value) return null; // Let required validation handle empty values

  const trimmedValue = value.trim();

  if (trimmedValue.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }

  if (trimmedValue.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }

  return null;
};

// Number range validation
export const validateNumberRange = (
  value: number,
  fieldName: string,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): string | null => {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }

  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }

  if (value > max) {
    return `${fieldName} must be less than or equal to ${max}`;
  }

  return null;
};

// Generic form validation helper
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ((value: any) => string | null)[]>
): ValidationResult => {
  const errors: string[] = [];

  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.push(error);
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Comprehensive validation for common use cases
export const commonValidations = {
  required: (fieldName: string) => (value: any) => validateRequired(value, fieldName),

  minLength: (min: number, fieldName: string) => (value: string) =>
    validateStringLength(value, fieldName, min),

  maxLength: (max: number, fieldName: string) => (value: string) =>
    validateStringLength(value, fieldName, 0, max),

  range: (min: number, max: number, fieldName: string) => (value: number) =>
    validateNumberRange(value, fieldName, min, max),

  email: (value: string) =>
    value && !validateEmail(value) ? 'Please enter a valid email address' : null,

  phone: (value: string) =>
    value && !validatePhone(value) ? 'Please enter a valid phone number' : null,

  currency: (value: string | number) =>
    !validateCurrency(value) ? 'Please enter a valid currency amount' : null,

};
