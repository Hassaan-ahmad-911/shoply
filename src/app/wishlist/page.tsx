'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { Product } from '@/lib/types';

export default function WishlistPage() {
  const { wishlist, wishlistCount, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product: Product) => {
    await addToCart(product, 1);
    await toggleWishlist(product);
  };

  if (wishlistCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-shoply-bg border border-shoply-border flex items-center justify-center mx-auto text-shoply-mutedText">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-bold text-shoply-text">Your wishlist is empty</h1>
        <p className="text-sm text-shoply-mutedText max-w-sm mx-auto">
          Save your favorite styles, gadgets, and accessories here to revisit them anytime.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-shoply-accent text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-subtle"
        >
          Explore Shop <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="flex items-center justify-between pb-6 border-b border-shoply-border mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text font-sans">
            My Wishlist
          </h1>
          <p className="text-xs text-shoply-mutedText mt-1">
            {wishlistCount} {wishlistCount === 1 ? 'saved item' : 'saved items'}
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-semibold text-shoply-text hover:underline flex items-center gap-1"
        >
          Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-shoply-border p-4 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F4F3EE] mb-4 border border-shoply-border">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-red-500 hover:bg-white shadow-subtle transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] font-semibold text-shoply-mutedText uppercase tracking-wider block">
                {product.brand}
              </span>
              <Link href={`/product/${product.slug}`} className="block">
                <h3 className="text-sm font-bold text-shoply-text hover:text-neutral-600 truncate transition">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm font-extrabold text-shoply-text mt-1">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-shoply-border">
              <button
                type="button"
                onClick={() => handleMoveToCart(product)}
                disabled={product.stock <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500 transition flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {product.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

