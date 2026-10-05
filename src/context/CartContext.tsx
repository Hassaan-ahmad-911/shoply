'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Coupon } from '@/lib/types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  applyCoupon: (code?: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const userId = user?.id || 'user-hassaan';

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<boolean> => {
    if (product.stock <= 0) {
      toastError(`Sorry, "${product.name}" is currently out of stock`);
      return false;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          product_id: product.id,
          quantity,
          selected_size: selectedSize || product.sizes?.[0] || 'Standard',
          selected_color: selectedColor || product.colors?.[0]?.name || 'Standard',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || 'Failed to add item to cart');
        return false;
      }

      setCart(data.items);
      success(`Added "${product.name}" to cart`);
      return true;
    } catch (e: any) {
      toastError(e.message || 'Error adding to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      // Optimistic update
      setCart((prev) =>
        prev
          .map((item) => (item.id === itemId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0)
      );

      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items);
      }
    } catch (e) {
      fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const itemToRemove = cart.find((i) => i.id === itemId);
    try {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      if (itemToRemove) {
        info(`Removed "${itemToRemove.product?.name || 'item'}" from cart`);
      }

      const res = await fetch(`/api/cart?userId=${userId}&itemId=${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items);
      }
    } catch (e) {
      fetchCart();
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      info('Cart cleared');
      await fetch(`/api/cart?userId=${userId}&clear=true`, {
        method: 'DELETE',
      });
    } catch (e) {
      fetchCart();
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // In the mockup: subtotal Rs 44,500 + Shipping Rs 500 = Rs 45,000.
  // Standard shipping is 500 unless order is over 50,000 or with free shipping promo.
  // We'll set shipping to 500 if cart has items, 0 if empty.
  const shipping = itemCount > 0 ? (subtotal >= 50000 ? 0 : 500) : 0;

  // Calculate discount from coupon
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_percent) {
      discount = Math.round((subtotal * appliedCoupon.discount_percent) / 100);
    } else if (appliedCoupon.discount_amount) {
      discount = appliedCoupon.discount_amount;
    }
  }

  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = async (code?: string): Promise<{ success: boolean; message: string }> => {
    const codeToApply = (code || couponCodeInput).trim().toUpperCase();
    if (!codeToApply) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToApply, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        toastError(data.message || 'Invalid coupon code');
        return { success: false, message: data.message || 'Invalid coupon' };
      }

      setAppliedCoupon(data.coupon);
      success(data.message);
      return { success: true, message: data.message };
    } catch (e: any) {
      toastError(e.message || 'Failed to apply coupon');
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    info('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        shipping,
        discount,
        total,
        appliedCoupon,
        couponCodeInput,
        setCouponCodeInput,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

