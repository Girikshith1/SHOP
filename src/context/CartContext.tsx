import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductSize } from '../types/product';
import { CartItem } from '../types/cart';
import { BRAND } from '../config/brand';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: ProductSize, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'don_streetwear_cart';
const PROMO_STORAGE_KEY = 'don_streetwear_promo';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>(() => {
    return localStorage.getItem(PROMO_STORAGE_KEY) || '';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size: ProductSize, color?: string, quantity: number = 1) => {
    const chosenColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    const itemId = `${product.id}-${size}-${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size,
          color: chosenColor,
          quantity,
        },
      ];
    });

    showToast('ADDED TO BAG', `${product.name} [${size}]`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        showToast('REMOVED FROM BAG', item.product.name, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const applyPromoCode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'DON10' || formatted === 'DROP001' || formatted === 'INNERCIRCLE') {
      setPromoCode(formatted);
      showToast('PROMO CODE APPLIED', `${formatted} — 10% DISCOUNT APPLIED`, 'success');
      return true;
    }
    showToast('INVALID CODE', 'Please enter a valid drop code (e.g. DON10)', 'alert');
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    showToast('CODE REMOVED', 'Discount has been updated', 'info');
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const discount = promoCode ? Math.round(subtotal * 0.1) : 0;
  const isFreeShipping = subtotal >= BRAND.freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const freeShippingRemaining = Math.max(0, BRAND.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        freeShippingRemaining,
        isFreeShipping,
        promoCode,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
