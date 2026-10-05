'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = user?.id || 'user-hassaan';

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || []);
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product.id);
    // Optimistic update
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      info(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      success(`Added "${product.name}" to wishlist`);
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist);
      }
    } catch (e) {
      // Revert on error
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

