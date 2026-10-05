'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  X,
  ExternalLink,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/format';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address edit state
  const [savedAddress, setSavedAddress] = useState({
    street: 'House 42, Street 7, Sector F-8/2',
    city: 'Islamabad',
    state: 'Federal Capital',
    postalCode: '44000',
    country: 'Pakistan',
  });

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?userId=${user?.id || 'user-hassaan'}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SIDEBAR (Matches Mockup) ================= */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-shoply-border">
            <div className="w-12 h-12 rounded-full bg-shoply-bg border border-shoply-border flex items-center justify-center text-sm font-bold text-shoply-text flex-shrink-0">
              {user?.name ? user.name.charAt(0) : 'H'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-shoply-text truncate">
                {user?.name || 'Hassaan Ahmad'}
              </h3>
              <p className="text-xs text-shoply-mutedText truncate">
                {user?.email || 'hassaan@example.com'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-900 text-white'
                  : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-neutral-900 text-white'
                  : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'orders' ? 'bg-neutral-800 text-white' : 'bg-shoply-bg text-shoply-text'
              }`}>
                {orders.length}
              </span>
            </button>

            <Link
              href="/wishlist"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text transition"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'addresses'
                  ? 'bg-neutral-900 text-white'
                  : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'payments'
                  ? 'bg-neutral-900 text-white'
                  : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Methods</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white'
                  : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: MY ORDERS (Matches Mockup) */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-shoply-border">
                <h1 className="text-xl font-bold text-shoply-text">My Orders</h1>

                {/* Status Filter Pills (Matches Mockup) */}
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        statusFilter === st
                          ? 'bg-neutral-900 text-white'
                          : 'bg-shoply-bg text-shoply-mutedText hover:text-shoply-text'
                      }`}
                    >
                      {st === 'All' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards List */}
              {loadingOrders ? (
                <div className="text-center py-12 text-xs text-shoply-mutedText">
                  Loading orders...
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const firstItem = order.items?.[0];
                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl border border-shoply-border bg-white hover:border-neutral-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle"
                      >
                        {/* Thumbnail & Order Info */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-shoply-cardBg border border-shoply-border flex-shrink-0">
                            {firstItem?.image ? (
                              <Image
                                src={firstItem.image}
                                alt={firstItem.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <Package className="w-6 h-6 m-auto text-neutral-400" />
                            )}
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs sm:text-sm font-bold text-shoply-text">
                                Order #{order.order_number}
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <p className="text-xs text-shoply-mutedText">
                              Placed on {formatDate(order.created_at)}
                            </p>

                            <p className="text-xs font-semibold text-shoply-text truncate max-w-xs">
                              {firstItem?.name}{' '}
                              {order.items.length > 1 && (
                                <span className="text-shoply-mutedText font-normal">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Amount & View Details Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                          <div className="sm:text-right">
                            <span className="text-xs text-shoply-mutedText block sm:hidden">Total</span>
                            <span className="text-sm font-bold text-shoply-text">
                              {formatPrice(order.total)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border border-shoply-border text-shoply-text hover:bg-neutral-900 hover:text-white transition"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-shoply-mutedText">
                  No orders found under {statusFilter === 'All' ? 'this account' : statusFilter}.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DASHBOARD SUMMARY */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-2">
                <h2 className="text-lg font-bold text-shoply-text">Welcome back, {user?.name || 'Hassaan'}!</h2>
                <p className="text-xs text-shoply-mutedText">
                  From your account dashboard, you can easily check and track your recent orders, manage your shipping addresses, and review wishlist items.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-1">
                  <span className="text-xs text-shoply-mutedText">Total Orders</span>
                  <p className="text-2xl font-extrabold text-shoply-text">{orders.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-1">
                  <span className="text-xs text-shoply-mutedText">Delivered</span>
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {orders.filter((o) => o.status === 'Delivered').length}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-1">
                  <span className="text-xs text-shoply-mutedText">In Transit</span>
                  <p className="text-2xl font-extrabold text-sky-600">
                    {orders.filter((o) => o.status === 'Shipped' || o.status === 'Processing').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6">
              <h2 className="text-lg font-bold text-shoply-text pb-3 border-b border-shoply-border">
                Saved Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Street Address</label>
                  <input
                    type="text"
                    value={savedAddress.street}
                    onChange={(e) => setSavedAddress({ ...savedAddress, street: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">City</label>
                  <input
                    type="text"
                    value={savedAddress.city}
                    onChange={(e) => setSavedAddress({ ...savedAddress, city: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">State / Province</label>
                  <input
                    type="text"
                    value={savedAddress.state}
                    onChange={(e) => setSavedAddress({ ...savedAddress, state: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={savedAddress.postalCode}
                    onChange={(e) => setSavedAddress({ ...savedAddress, postalCode: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* TAB 4: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6">
              <h2 className="text-lg font-bold text-shoply-text pb-3 border-b border-shoply-border">
                Saved Payment Methods
              </h2>
              <div className="p-4 rounded-xl border border-shoply-border bg-shoply-bg flex items-center justify-between max-w-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-shoply-text">Mastercard ending in 4242</p>
                    <p className="text-[11px] text-shoply-mutedText">Expires 12/26</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded">
                  Default
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-6">
              <h2 className="text-lg font-bold text-shoply-text pb-3 border-b border-shoply-border">
                Account Settings
              </h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Hassaan Ahmad'}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-shoply-text mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user?.email || 'hassaan@example.com'}
                    className="w-full text-xs p-3 rounded-xl border border-shoply-border bg-neutral-100 text-neutral-500"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= ORDER DETAILS MODAL (Matches Requirements) ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-shoply-border shadow-elevated">
            <div className="flex items-center justify-between pb-4 border-b border-shoply-border">
              <div>
                <h3 className="text-lg font-bold text-shoply-text">
                  Order #{selectedOrder.order_number}
                </h3>
                <p className="text-xs text-shoply-mutedText">
                  Placed on {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-shoply-mutedText hover:text-shoply-text rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Status Timeline */}
            <div className="p-4 bg-shoply-bg rounded-xl border border-shoply-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-shoply-text">Current Status</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center pt-2 text-[10px]">
                <div className={`p-1.5 rounded ${selectedOrder.status !== 'Cancelled' ? 'bg-neutral-900 text-white font-bold' : 'bg-neutral-200'}`}>1. Placed</div>
                <div className={`p-1.5 rounded ${['Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-neutral-900 text-white font-bold' : 'bg-neutral-200 text-neutral-500'}`}>2. Processing</div>
                <div className={`p-1.5 rounded ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-neutral-900 text-white font-bold' : 'bg-neutral-200 text-neutral-500'}`}>3. Shipped</div>
                <div className={`p-1.5 rounded ${selectedOrder.status === 'Delivered' ? 'bg-emerald-700 text-white font-bold' : 'bg-neutral-200 text-neutral-500'}`}>4. Delivered</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-shoply-text uppercase tracking-wider">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-shoply-border">
                {selectedOrder.items.map((i) => (
                  <div key={i.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F4F3EE] relative overflow-hidden border border-shoply-border flex-shrink-0">
                        <Image src={i.image} alt={i.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-shoply-text">{i.name}</p>
                        <p className="text-[11px] text-shoply-mutedText">
                          Qty: {i.quantity} {i.selected_size ? `| Size: ${i.selected_size}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-shoply-text">
                      {formatPrice(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-shoply-border">
              <div>
                <p className="font-bold text-shoply-text mb-1">Shipping Address</p>
                <p className="text-shoply-mutedText">{selectedOrder.shipping_address.fullName}</p>
                <p className="text-shoply-mutedText">{selectedOrder.shipping_address.address}</p>
                <p className="text-shoply-mutedText">
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}
                </p>
                <p className="text-shoply-mutedText">{selectedOrder.shipping_address.phone}</p>
              </div>

              <div>
                <p className="font-bold text-shoply-text mb-1">Financial Breakdown</p>
                <div className="space-y-1 text-shoply-mutedText">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-shoply-text pt-1 border-t border-shoply-border">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

