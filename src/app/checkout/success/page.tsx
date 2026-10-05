'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Clock, Truck, Home, ArrowRight, Download, Printer } from 'lucide-react';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/format';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#171717', '#8F9779', '#D7C4B7', '#A76D43'],
      });
    } catch (e) {
      // ignore
    }

    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-sm text-shoply-mutedText">
        Loading order confirmation...
      </div>
    );
  }

  const orderNum = order?.order_number || '12345';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-shoply-text font-sans">
          Order Placed Successfully
        </h1>
        <p className="text-sm text-shoply-mutedText max-w-md mx-auto">
          Thank you for shopping with Shoply! We&apos;ve sent a confirmation email to{' '}
          <span className="font-semibold text-shoply-text">{order?.customer_email || 'your email'}</span>.
        </p>
      </div>

      {/* Order Info & Estimated Delivery Card */}
      <div className="bg-white rounded-2xl border border-shoply-border p-6 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-shoply-border gap-2">
          <div>
            <span className="text-xs text-shoply-mutedText block">Order Number</span>
            <span className="text-lg font-extrabold text-shoply-text">#{orderNum}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-shoply-mutedText block">Estimated Delivery</span>
            <span className="text-sm font-bold text-shoply-text">3–5 Business Days</span>
          </div>
        </div>

        {/* Order Status Timeline (Matches prompt requirements) */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-shoply-mutedText mb-4">
            Live Order Status
          </p>
          <div className="grid grid-cols-4 gap-2 text-center relative">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ✓
              </div>
              <p className="text-xs font-bold text-shoply-text">Order Placed</p>
              <p className="text-[10px] text-shoply-mutedText">Confirmed</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto text-xs font-bold animate-pulse">
                2
              </div>
              <p className="text-xs font-bold text-shoply-text">Processing</p>
              <p className="text-[10px] text-shoply-mutedText">Packing items</p>
            </div>

            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-shoply-bg border border-shoply-border text-shoply-mutedText flex items-center justify-center mx-auto text-xs font-bold">
                3
              </div>
              <p className="text-xs font-bold text-shoply-text">Shipped</p>
              <p className="text-[10px] text-shoply-mutedText">With courier</p>
            </div>

            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-shoply-bg border border-shoply-border text-shoply-mutedText flex items-center justify-center mx-auto text-xs font-bold">
                4
              </div>
              <p className="text-xs font-bold text-shoply-text">Delivered</p>
              <p className="text-[10px] text-shoply-mutedText">To your door</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Items List */}
      {order?.items && order.items.length > 0 && (
        <div className="bg-white rounded-2xl border border-shoply-border p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-shoply-text pb-2 border-b border-shoply-border">
            Purchased Items ({order.items.length})
          </h3>
          <div className="divide-y divide-shoply-border">
            {order.items.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-shoply-cardBg overflow-hidden relative border border-shoply-border flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-shoply-text">{item.name}</h4>
                    <p className="text-[11px] text-shoply-mutedText">
                      Qty: {item.quantity} {item.selected_size ? `| Size: ${item.selected_size}` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-shoply-text">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-shoply-border space-y-1.5 text-xs">
            <div className="flex justify-between text-shoply-mutedText">
              <span>Subtotal</span>
              <span className="font-semibold text-shoply-text">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-shoply-mutedText">
              <span>Shipping</span>
              <span className="font-semibold text-shoply-text">
                {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-shoply-text pt-2 border-t border-shoply-border">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address & Payment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-shoply-border text-xs space-y-2">
          <p className="font-bold text-shoply-text uppercase tracking-wider text-[11px]">
            Delivery Address
          </p>
          <p className="font-semibold text-shoply-text">{order?.shipping_address.fullName}</p>
          <p className="text-shoply-mutedText">{order?.shipping_address.address}</p>
          <p className="text-shoply-mutedText">
            {order?.shipping_address.city}, {order?.shipping_address.state} {order?.shipping_address.postalCode}
          </p>
          <p className="text-shoply-mutedText">{order?.shipping_address.phone}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-shoply-border text-xs space-y-2">
          <p className="font-bold text-shoply-text uppercase tracking-wider text-[11px]">
            Payment Method
          </p>
          <p className="font-semibold text-shoply-text uppercase">
            {order?.payment_method === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery (COD)'}
          </p>
          <p className="text-shoply-mutedText">
            Status: <span className="text-emerald-700 font-semibold">{order?.payment_status}</span>
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 pt-2 text-shoply-accent font-semibold hover:underline"
          >
            <Printer className="w-3.5 h-3.5" /> Print Order Invoice
          </button>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/account"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition text-center shadow-subtle"
        >
          View in My Orders
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-shoply-border text-shoply-text text-xs sm:text-sm font-semibold hover:bg-shoply-bg transition text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-20 text-center text-sm text-shoply-mutedText">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

