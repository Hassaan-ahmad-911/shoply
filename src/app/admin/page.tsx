'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  RotateCcw,
  X,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Product, Category, Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/format';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'categories' | 'customers'>('analytics');

  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Customers
  const [customers, setCustomers] = useState<any[]>([]);

  // Search in tables
  const [tableSearch, setTableSearch] = useState('');

  // Fetch Analytics
  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Categories
  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Orders
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/orders?admin=true');
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

  // Fetch Customers
  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadProducts();
    loadCategories();
    loadOrders();
    loadCustomers();
  }, []);

  // Update order status
  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        success(`Order status updated to ${status}`);
        loadOrders();
        loadAnalytics();
        loadProducts(); // stock might change if cancelled
      } else {
        toastError('Failed to update status');
      }
    } catch {
      toastError('Network error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Product deleted');
        loadProducts();
        loadAnalytics();
      }
    } catch {
      toastError('Failed to delete product');
    }
  };

  // Restock product quickly
  const handleQuickRestock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        success('Inventory restocked');
        loadProducts();
        loadAnalytics();
      }
    } catch {
      toastError('Failed to restock');
    }
  };

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Shoply',
    category_id: 'cat-fashion',
    category_name: 'Fashion',
    category_slug: 'fashion',
    price: 5000,
    sale_price: 0,
    stock: 15,
    description: '',
    image: '',
    sizes: 'S, M, L, XL',
  });

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: 'Shoply',
      category_id: categories[0]?.id || 'cat-fashion',
      category_name: categories[0]?.name || 'Fashion',
      category_slug: categories[0]?.slug || 'fashion',
      price: 4500,
      sale_price: 0,
      stock: 20,
      description: 'Handcrafted premium quality with minimal design and timeless comfort.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      sizes: 'S, M, L, XL',
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category_id: prod.category_id,
      category_name: prod.category_name,
      category_slug: prod.category_slug,
      price: prod.price,
      sale_price: prod.sale_price || 0,
      stock: prod.stock,
      description: prod.description,
      image: prod.images[0] || '',
      sizes: prod.sizes.join(', '),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: productForm.name,
      brand: productForm.brand,
      category_id: productForm.category_id,
      category_name: categories.find((c) => c.id === productForm.category_id)?.name || 'Fashion',
      category_slug: categories.find((c) => c.id === productForm.category_id)?.slug || 'fashion',
      price: Number(productForm.price),
      sale_price: productForm.sale_price > 0 ? Number(productForm.sale_price) : undefined,
      stock: Number(productForm.stock),
      description: productForm.description,
      images: [productForm.image],
      sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          success('Product updated');
          setIsProductModalOpen(false);
          loadProducts();
          loadAnalytics();
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          success('Product created');
          setIsProductModalOpen(false);
          loadProducts();
          loadAnalytics();
        }
      }
    } catch {
      toastError('Failed to save product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-shoply-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-900" />
            <span className="text-xs font-bold uppercase tracking-wider text-shoply-mutedText">
              Administration Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-shoply-text mt-1">
            Shoply Management Console
          </h1>
          <p className="text-xs text-shoply-mutedText mt-0.5">
            Real-time catalog control, live inventory synchronization, and order fulfillment.
          </p>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="px-4 py-2.5 rounded-xl border border-shoply-border text-xs font-semibold text-shoply-text hover:bg-shoply-bg transition flex items-center gap-1.5"
          >
            Storefront <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={openCreateProduct}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-shoply-bg rounded-2xl border border-shoply-border">
        {[
          { id: 'analytics', label: 'Analytics & Overview', icon: LayoutDashboard },
          { id: 'products', label: 'Products & Inventory', icon: Package, count: products.length },
          { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length },
          { id: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
          { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setTableSearch('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-subtle border border-shoply-border/70'
                  : 'text-shoply-mutedText hover:text-shoply-text hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: ANALYTICS & OVERVIEW ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top 4 KPI Cards (Matches Prompt) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-shoply-mutedText">Total Sales</span>
                <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-shoply-text">
                {analytics ? formatPrice(analytics.totalSales) : '...'}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this month
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-shoply-mutedText">Total Orders</span>
                <span className="p-2 bg-sky-50 rounded-lg text-sky-600">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-shoply-text">
                {analytics?.totalOrders ?? '...'}
              </p>
              <p className="text-[11px] text-sky-700 font-semibold">
                Live from database
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-shoply-mutedText">Total Customers</span>
                <span className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-shoply-text">
                {analytics?.totalCustomers ?? '...'}
              </p>
              <p className="text-[11px] text-shoply-mutedText font-semibold">
                Verified buyer accounts
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-shoply-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-shoply-mutedText">Active Catalog</span>
                <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-shoply-text">
                {analytics?.totalProducts ?? '...'}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold">
                Across {categories.length} categories
              </p>
            </div>
          </div>

          {/* Low Stock Alert Banner */}
          {analytics?.lowStockProducts && analytics.lowStockProducts.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold">
                  Low Inventory Warning ({analytics.lowStockProducts.length} items need restock)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analytics.lowStockProducts.map((p: Product) => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-shoply-text truncate max-w-[160px]">{p.name}</p>
                      <p className="text-[11px] text-red-600 font-semibold">
                        {p.stock === 0 ? 'Out of stock' : `Only ${p.stock} units left`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickRestock(p.id, 20)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                    >
                      +20 Units
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Selling Products & Revenue Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-shoply-text">Best-Selling Products</h3>
              <div className="divide-y divide-shoply-border">
                {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((p: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-shoply-cardBg flex items-center justify-center text-xs font-bold text-shoply-text">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-shoply-text">{p.name}</p>
                          <p className="text-[11px] text-shoply-mutedText">
                            {p.salesCount} sold
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-shoply-text">
                        {formatPrice(p.revenue)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-shoply-mutedText py-4">No order items recorded yet.</p>
                )}
              </div>
            </div>

            {/* Sales Trends / Orders Chart Mockup */}
            <div className="bg-white p-6 rounded-2xl border border-shoply-border shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-shoply-text">Weekly Performance</h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { day: 'Mon', height: '60%', val: 'Rs. 45k' },
                  { day: 'Tue', height: '75%', val: 'Rs. 62k' },
                  { day: 'Wed', height: '40%', val: 'Rs. 32k' },
                  { day: 'Thu', height: '90%', val: 'Rs. 88k' },
                  { day: 'Fri', height: '85%', val: 'Rs. 79k' },
                  { day: 'Sat', height: '100%', val: 'Rs. 104k' },
                  { day: 'Sun', height: '70%', val: 'Rs. 58k' },
                ].map((bar) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition">
                      {bar.val}
                    </div>
                    <div
                      style={{ height: bar.height }}
                      className="w-full bg-neutral-900 group-hover:bg-neutral-700 rounded-t-lg transition-all"
                    />
                    <span className="text-[10px] font-semibold text-shoply-mutedText">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS & INVENTORY ================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-shoply-border shadow-subtle overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-shoply-border">
            <div>
              <h2 className="text-lg font-bold text-shoply-text">Product Inventory</h2>
              <p className="text-xs text-shoply-mutedText">Manage prices, categories, stock, and images</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-shoply-mutedText absolute left-3 top-3" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="text-xs pl-8 pr-3 py-2 rounded-xl border border-shoply-border bg-shoply-bg"
                />
              </div>

              <button
                type="button"
                onClick={openCreateProduct}
                className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-shoply-border text-shoply-mutedText uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shoply-border">
                {products
                  .filter((p) => p.name.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-shoply-bg/50 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-shoply-cardBg overflow-hidden relative border border-shoply-border flex-shrink-0">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <p className="font-bold text-shoply-text">{product.name}</p>
                            <p className="text-[11px] text-shoply-mutedText">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-shoply-text">
                        {product.category_name}
                      </td>
                      <td className="py-3 px-3 font-bold text-shoply-text">
                        {formatPrice(product.price)}
                        {product.sale_price && (
                          <span className="block text-[10px] text-red-600">
                            Sale: {formatPrice(product.sale_price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              product.stock === 0
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : product.stock <= 3
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickRestock(product.id, product.stock + 10)}
                            className="text-[10px] text-neutral-600 hover:text-neutral-900 border border-shoply-border px-1.5 py-0.5 rounded bg-white"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            className="p-1.5 text-shoply-text hover:bg-neutral-100 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CUSTOMER ORDERS ================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-shoply-border shadow-subtle p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-shoply-border">
            <div>
              <h2 className="text-lg font-bold text-shoply-text">Customer Orders Management</h2>
              <p className="text-xs text-shoply-mutedText">Change fulfillment states and inspect customer delivery addresses</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-shoply-mutedText absolute left-3 top-3" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search order # or name..."
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-shoply-border bg-shoply-bg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-shoply-border text-shoply-mutedText uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Fulfillment Status</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shoply-border">
                {orders
                  .filter(
                    (o) =>
                      o.order_number.includes(tableSearch) ||
                      o.customer_name.toLowerCase().includes(tableSearch.toLowerCase())
                  )
                  .map((order) => (
                    <tr key={order.id} className="hover:bg-shoply-bg/50 transition">
                      <td className="py-3 px-3 font-bold text-shoply-text">
                        #{order.order_number}
                        <span className="block text-[10px] text-shoply-mutedText font-normal">
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-shoply-text">{order.customer_name}</p>
                        <p className="text-[11px] text-shoply-mutedText">{order.customer_email}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-shoply-text">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-3 font-bold text-shoply-text">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="uppercase text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                          className="bg-shoply-bg border border-shoply-border rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800 outline-none cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(order)}
                          className="text-xs font-semibold text-neutral-800 underline hover:text-neutral-600"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CATEGORIES ================= */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-shoply-border shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-shoply-border">
            <h2 className="text-lg font-bold text-shoply-text">Store Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-shoply-border bg-white flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-shoply-cardBg overflow-hidden relative flex-shrink-0">
                  <Image src={c.image} alt={c.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-shoply-text">{c.name}</h4>
                  <p className="text-[11px] text-shoply-mutedText truncate">{c.description}</p>
                  <p className="text-[10px] text-neutral-500 font-semibold mt-1">{c.product_count} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: CUSTOMERS DIRECTORY ================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-shoply-border shadow-subtle p-6 space-y-4">
          <h2 className="text-lg font-bold text-shoply-text pb-4 border-b border-shoply-border">
            Registered Customers
          </h2>
          <div className="divide-y divide-shoply-border">
            {customers.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-shoply-text">{c.name}</p>
                  <p className="text-[11px] text-shoply-mutedText">{c.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-shoply-text">{formatPrice(c.totalSpent || 0)} spent</p>
                  <p className="text-[11px] text-shoply-mutedText">{c.orderCount || 0} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-shoply-border shadow-elevated">
            <div className="flex items-center justify-between pb-3 border-b border-shoply-border">
              <h3 className="text-base font-bold text-shoply-text">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-shoply-mutedText hover:text-shoply-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-shoply-text mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-shoply-text mb-1">Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-shoply-text mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-shoply-text mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-shoply-text mb-1">Sale Price (Rs.)</label>
                  <input
                    type="number"
                    value={productForm.sale_price}
                    onChange={(e) => setProductForm({ ...productForm, sale_price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-shoply-text mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-shoply-text mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                />
              </div>

              <div>
                <label className="block font-semibold text-shoply-text mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                />
              </div>

              <div>
                <label className="block font-semibold text-shoply-text mb-1">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-shoply-border bg-shoply-bg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-shoply-border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER INSPECT ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-shoply-border shadow-elevated text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-shoply-border">
              <h3 className="font-bold text-shoply-text">Order #{selectedOrderDetails.order_number}</h3>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="text-shoply-mutedText hover:text-shoply-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="font-bold">Customer: {selectedOrderDetails.customer_name}</p>
              <p className="text-shoply-mutedText">{selectedOrderDetails.customer_email} | {selectedOrderDetails.customer_phone}</p>
              <p className="text-shoply-mutedText mt-1">Address: {selectedOrderDetails.shipping_address.address}, {selectedOrderDetails.shipping_address.city}</p>
            </div>
            <div className="border-t border-b border-shoply-border py-2 space-y-1">
              <p className="font-bold">Ordered Items:</p>
              {selectedOrderDetails.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.quantity}x {it.name} ({it.selected_size})</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-sm">
              <span>Total:</span>
              <span>{formatPrice(selectedOrderDetails.total)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2 bg-neutral-900 text-white rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

