'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function CartPage() {
  const router = useRouter();
  const {
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
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const res = await fetch('/api/products?limit=8');
        if (res.ok) {
          const data = await res.json();
          // Find sunglasses, smartwatch, backpack, headphones or top items
          const list: Product[] = data.products || [];
          const recs = list.filter((p) => !cart.some((c) => c.product_id === p.id)).slice(0, 4);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadRecommendations();
  }, [cart]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponSubmitting(true);
    await applyCoupon();
    setCouponSubmitting(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-shoply-bg border border-shoply-border flex items-center justify-center mx-auto mb-4 text-shoply-mutedText">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-shoply-text">Your cart is empty</h2>
        <p className="text-sm text-shoply-mutedText max-w-sm mx-auto mt-2 mb-6">
          Looks like you haven&apos;t added any items to your shopping cart yet.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-shoply-accent text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-subtle"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>

        {recommendations.length > 0 && (
          <div className="mt-20 text-left border-t border-shoply-border pt-12">
            <h3 className="text-xl font-bold text-shoply-text mb-6">Trending Picks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Title Bar (Matches Mockup) */}
      <div className="flex items-center justify-between pb-6 border-b border-shoply-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text font-sans">
          Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-shoply-mutedText hover:text-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
        {/* ================= LEFT: CART ITEMS LIST ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-shoply-border bg-white rounded-2xl border border-shoply-border p-4 sm:p-6 shadow-subtle">
            {cart.map((item) => (
              <div
                key={item.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F4F3EE] flex-shrink-0 border border-shoply-border">
                    <Image
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'}
                      alt={item.product?.name || 'Cart item'}
                      fill
                      className="object-cover object-center"
                      sizes="96px"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/product/${item.product?.slug || ''}`}
                      className="text-sm sm:text-base font-bold text-shoply-text hover:text-neutral-600 transition truncate block"
                    >
                      {item.product?.name || 'Product'}
                    </Link>

                    {/* Metadata: Size & Color */}
                    <p className="text-xs text-shoply-mutedText">
                      {item.selected_size && <span>Size: {item.selected_size}</span>}
                      {item.selected_size && item.selected_color && <span> | </span>}
                      {item.selected_color && <span>Color: {item.selected_color}</span>}
                    </p>

                    {/* Unit Price */}
                    <p className="text-sm font-bold text-shoply-text">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Quantity Counter + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-shoply-border rounded-xl bg-shoply-bg p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-shoply-text hover:bg-white rounded-lg disabled:opacity-30 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-shoply-text">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product?.stock ?? 99)}
                      className="p-1.5 text-shoply-text hover:bg-white rounded-lg disabled:opacity-30 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Trash Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-shoply-mutedText hover:text-red-500 rounded-lg transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.75]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT: ORDER SUMMARY (Matches Mockup) ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-shoply-border p-6 shadow-subtle space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-shoply-text border-b border-shoply-border pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-shoply-mutedText">
                <span>Subtotal</span>
                <span className="text-shoply-text font-semibold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-shoply-mutedText">
                <span>Shipping</span>
                <span className="text-shoply-text font-semibold">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <hr className="border-shoply-border" />

              <div className="flex items-center justify-between text-base font-extrabold text-shoply-text pt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full py-4 rounded-xl bg-shoply-accent text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-subtle flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-shoply-border">
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div>
                    <p className="font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Coupon &quot;{appliedCoupon.code}&quot; Active
                    </p>
                    <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-medium text-shoply-mutedText block">
                    Have a coupon code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Enter code (e.g. SHOPLY10)"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text placeholder:text-shoply-lightText focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      disabled={couponSubmitting || !couponCodeInput.trim()}
                      className="px-4 py-2.5 text-xs font-semibold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                      {couponSubmitting ? '...' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-[11px] text-shoply-lightText">
                    Try <span className="font-semibold text-neutral-800">SHOPLY10</span> for 10% off or <span className="font-semibold text-neutral-800">SAVE500</span>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM: YOU MAY ALSO LIKE (Matches Mockup) ================= */}
      {recommendations.length > 0 && (
        <div className="mt-20 border-t border-shoply-border pt-12 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-shoply-text">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

