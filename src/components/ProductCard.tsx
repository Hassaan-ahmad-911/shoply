'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const favorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const discountPercent =
    product.sale_price && product.sale_price > product.price
      ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100)
      : null;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const ok = await addToCart(product, 1);
    setIsAdding(false);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-shoply-border p-3 hover:border-neutral-300 hover:shadow-card transition duration-200">
      {/* Product Image Area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F4F3EE] flex items-center justify-center"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges: Discount or Stock */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent ? (
            <span className="px-2 py-0.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/80 rounded-md">
              -{discountPercent}%
            </span>
          ) : null}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[11px] font-semibold text-neutral-600 bg-neutral-200/90 rounded-md">
              Out of stock
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Heart Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            favorited
              ? 'bg-red-50 text-red-500 shadow-sm'
              : 'bg-white/80 text-shoply-text hover:bg-white hover:text-red-500 shadow-subtle'
          }`}
          aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'stroke-[2]'}`}
          />
        </button>

        {/* Desktop Quick Add Button Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-subtle transition ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-shoply-accent text-white hover:bg-neutral-800'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Cart
              </>
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : isAdding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details Area */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-shoply-text truncate hover:text-neutral-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-medium text-shoply-text">{product.rating}</span>
          <span className="text-xs text-shoply-lightText">({product.reviews_count})</span>
        </div>

        {/* Price & Mobile Add Button Row */}
        <div className="mt-2.5 flex items-baseline justify-between pt-1 border-t border-shoply-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-shoply-text">
              {formatPrice(product.price)}
            </span>
            {product.sale_price && product.sale_price > product.price && (
              <span className="text-xs text-shoply-lightText line-through">
                {formatPrice(product.sale_price)}
              </span>
            )}
          </div>

          {/* Mobile direct add icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="sm:hidden p-1.5 text-shoply-text bg-shoply-bg hover:bg-shoply-accent hover:text-white rounded-lg transition"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

