export const formatPrice = (price: number | string): string => {
  return `€${parseFloat(price.toString()).toFixed(2)}`;
};

export const getPromoDescription = (promo: {
  promo_type: string;
  trigger_qty: number;
  free_qty?: number;
  discount_percentage?: number;
  discount_amount?: number;
  name: string;
}): string => {
  switch (promo.promo_type) {
    case 'buy_x_get_y_free':
      return `Buy ${promo.trigger_qty} Get ${promo.free_qty} Free`;
    case 'percentage_discount':
      return `${promo.discount_percentage}% off when buying ${promo.trigger_qty}+`;
    case 'fixed_discount':
      return `€${promo.discount_amount} off each when buying ${promo.trigger_qty}+`;
    default:
      return promo.name;
  }
};

export const formatQuantity = (quantity: number): string => {
  return quantity === 1 ? '1 item' : `${quantity} items`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
