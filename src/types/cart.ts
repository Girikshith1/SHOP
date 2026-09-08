import { Product, ProductSize } from './product';

export interface CartItem {
  id: string; // generated `${product.id}-${size}-${color}`
  product: Product;
  size: ProductSize;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}
