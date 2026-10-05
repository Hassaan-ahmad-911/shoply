'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shipping, discount, total, appliedCoupon } = useCart();
  const { user } = useAuth();
  const { error: toastError } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Hassaan Ahmad',
    email: user?.email || 'hassaan@example.com',
    phone: user?.phone || '+92 300 1234567',
    address: 'House 42, Street 7, Sector F-8/2',
    city: 'Islamabad',
    state: 'Federal Capital',
    postalCode: '44000',
    country: 'Pakistan',
    paymentMethod: 'card' as 'cod' | 'card',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/26',
    cardCvc: '123',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toastError('Your cart is empty');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.address || !formData.city) {
      toastError('Please fill in all required shipping address fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 'user-hassaan',
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          payment_method: formData.paymentMethod,
          items: cart,
          coupon_code: appliedCoupon?.code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || 'Failed to place order');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Redirect to confirmation screen
      router.push(`/checkout/success?orderId=${data.order.id}`);
    } catch (err: any) {
      toastError(err.message || 'An unexpected error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-shoply-text">No items to checkout</h2>
        <p className="text-sm text-shoply-mutedText">Your cart is currently empty.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-shoply-mutedText hover:text-shoply-text transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text mb-8">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= LEFT: CHECKOUT FORMS ================= */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-shoply-text flex items-center justify-between">
              <span>1. Contact Information</span>
              <span className="text-xs font-normal text-shoply-mutedText">Secure 256-bit SSL</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-shoply-text mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Hassaan Ahmad"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. hassaan@example.com"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-shoply-text">2. Shipping Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Apartment #, Street, Area"
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Islamabad"
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Federal"
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 44000"
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-shoply-text mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg text-shoply-text focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-shoply-text">3. Payment Method</h2>

            <div className="space-y-3">
              {/* Credit Card Option */}
              <label
                className={`p-4 rounded-xl border flex flex-col gap-3 cursor-pointer transition ${
                  formData.paymentMethod === 'card'
                    ? 'border-neutral-900 bg-shoply-bg'
                    : 'border-shoply-border bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="accent-neutral-900 w-4 h-4"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-shoply-text" />
                      <span className="text-xs font-bold text-shoply-text">Credit or Debit Card</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant
                  </span>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="pt-2 border-t border-shoply-border space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-shoply-mutedText mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-shoply-mutedText mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleChange}
                          className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-shoply-mutedText mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          className="w-full text-xs p-2.5 rounded-lg border border-shoply-border bg-white text-shoply-text focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Cash on Delivery Option */}
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  formData.paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-shoply-bg'
                    : 'border-shoply-border bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="accent-neutral-900 w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-shoply-text" />
                    <span className="text-xs font-bold text-shoply-text">Cash on Delivery (COD)</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-shoply-mutedText">
                  Pay upon arrival
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: ORDER REVIEW ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6 sticky top-28">
            <h2 className="text-base font-bold text-shoply-text border-b border-shoply-border pb-3">
              Order Items ({cart.length})
            </h2>

            {/* Compact items list */}
            <div className="divide-y divide-shoply-border max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-shoply-cardBg flex-shrink-0 border border-shoply-border">
                    <Image
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'}
                      alt={item.product?.name || 'Item'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-shoply-text truncate">{item.product?.name}</h4>
                    <p className="text-[11px] text-shoply-mutedText">
                      Qty: {item.quantity} {item.selected_size ? `| ${item.selected_size}` : ''}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-shoply-text">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-shoply-border text-xs">
              <div className="flex justify-between text-shoply-mutedText">
                <span>Subtotal</span>
                <span className="font-semibold text-shoply-text">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-shoply-mutedText">
                <span>Shipping</span>
                <span className="font-semibold text-shoply-text">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <hr className="border-shoply-border" />
              <div className="flex justify-between text-base font-extrabold text-shoply-text pt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-shoply-accent text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order ({formatPrice(total)})
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-shoply-mutedText">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Guaranteed safe checkout & 30-day money back guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

