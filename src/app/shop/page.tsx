'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategoryParam = searchParams.get('category') || 'fashion';
  const activeBrandParam = searchParams.get('brand') || '';
  const activeSizeParam = searchParams.get('size') || '';
  const activeSortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 70000;
  const saleParam = searchParams.get('sale') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    activeBrandParam ? activeBrandParam.split(',') : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    activeSizeParam ? activeSizeParam.split(',') : []
  );
  const [priceRange, setPriceRange] = useState<number>(maxPriceParam);
  const [sortBy, setSortBy] = useState(activeSortParam);

  const availableBrands = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's", 'Apple'];
  const availableSizes = ['S', 'M', 'L', 'XL', '7', '8', '9', '10', '11'];

  // Sub-categories list matching mockup
  const subCategories = [
    { label: 'All Fashion', value: 'fashion' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Shirts', value: 'shirts' },
    { label: 'Hoodies & Sweatshirts', value: 'hoodies' },
    { label: 'Jeans', value: 'jeans' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Jackets', value: 'jackets' },
    { label: 'Activewear', value: 'sports' },
    { label: 'Accessories', value: 'bags-accessories' },
  ];

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        if (selectedBrands.length > 0) {
          params.set('brand', selectedBrands.join(','));
        }
        if (selectedSizes.length > 0) {
          params.set('size', selectedSizes.join(','));
        }
        if (priceRange < 70000) {
          params.set('maxPrice', priceRange.toString());
        }
        if (sortBy) {
          params.set('sort', sortBy);
        }

        const res = await fetch(`/api/products?${params.toString()}&limit=40`);
        if (res.ok) {
          const data = await res.json();
          let list: Product[] = data.products || [];
          if (saleParam) {
            list = list.filter((p) => p.sale_price && p.sale_price > p.price);
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, selectedBrands, selectedSizes, priceRange, sortBy, saleParam]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('fashion');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange(70000);
    setSortBy('newest');
  };

  const currentCategoryTitle = useMemo(() => {
    if (selectedCategory === 'fashion') return 'Fashion';
    if (selectedCategory === 'all') return 'All Products';
    const found = categories.find((c) => c.slug === selectedCategory);
    if (found) return found.name;
    const sub = subCategories.find((s) => s.value === selectedCategory);
    return sub ? sub.label : 'Fashion';
  }, [selectedCategory, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* 1. TOP HERO BANNER (Matches mockup) */}
      <div className="my-6 rounded-3xl bg-white border border-shoply-border overflow-hidden shadow-subtle">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-shoply-text font-sans">
              {currentCategoryTitle}
            </h1>
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-shoply-mutedText">
              <Link href="/" className="hover:text-shoply-text transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-shoply-text font-medium">{currentCategoryTitle}</span>
            </nav>
          </div>
          <div className="md:col-span-5 relative h-44 sm:h-52 md:h-full min-h-[180px]">
            <Image
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
              alt="Category Banner"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:block space-y-8 bg-white p-6 rounded-2xl border border-shoply-border sticky top-28 shadow-subtle">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-shoply-border">
            <h3 className="text-base font-bold text-shoply-text">Categories</h3>
            {(selectedBrands.length > 0 || selectedSizes.length > 0 || priceRange < 70000) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-shoply-mutedText hover:text-shoply-text flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Subcategories list */}
          <div className="space-y-1.5">
            {subCategories.map((sub) => {
              const isActive = selectedCategory === sub.value;
              return (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => setSelectedCategory(sub.value)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-shoply-accent text-white font-semibold'
                      : 'text-shoply-mutedText hover:bg-shoply-bg hover:text-shoply-text'
                  }`}
                >
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filters section */}
          <div className="pt-4 border-t border-shoply-border space-y-6">
            <h3 className="text-sm font-bold text-shoply-text">Filters</h3>

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-shoply-text">
                <span>Price Range</span>
                <span className="text-shoply-mutedText">Up to {formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="70000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-shoply-lightText">
                <span>Rs. 0</span>
                <span>Rs. 70,000</span>
              </div>
            </div>

            {/* Brand checkboxes */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-shoply-text block">Brand</span>
              <div className="space-y-2">
                {availableBrands.map((brand) => {
                  const checked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 text-xs text-shoply-mutedText hover:text-shoply-text cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded border-shoply-border text-shoply-accent focus:ring-0 accent-neutral-900"
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Size pills */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-shoply-text block">Size</span>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition ${
                        isSelected
                          ? 'bg-shoply-accent text-white border-shoply-accent'
                          : 'bg-white text-shoply-text border-shoply-border hover:bg-shoply-bg'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT PRODUCT GRID ================= */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Count, Mobile Filter Trigger, and Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-shoply-border shadow-subtle">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-shoply-text">
                {currentCategoryTitle}
              </h2>
              <p className="text-xs text-shoply-mutedText">
                Showing {products.length} products
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-shoply-text border border-shoply-border rounded-xl hover:bg-shoply-bg transition"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs text-shoply-mutedText">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-shoply-bg border border-shoply-border rounded-xl px-3 py-2 text-xs font-semibold text-shoply-text outline-none cursor-pointer focus:border-shoply-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="best-rated">Best Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-shoply-border p-3 space-y-3 animate-pulse"
                >
                  <div className="aspect-square bg-neutral-200 rounded-xl" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-shoply-border p-8 space-y-3">
              <h3 className="text-lg font-bold text-shoply-text">No products found</h3>
              <p className="text-sm text-shoply-mutedText max-w-sm mx-auto">
                No items match your selected filters. Try broadening your criteria or resetting filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 text-xs font-semibold bg-shoply-accent text-white rounded-xl hover:bg-shoply-hover transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE FILTER MODAL ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-shoply-border">
              <h3 className="text-base font-bold text-shoply-text">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-shoply-mutedText hover:text-shoply-text rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-shoply-text uppercase tracking-wider block">
                Category
              </span>
              <div className="space-y-1">
                {subCategories.map((sub) => (
                  <button
                    key={sub.value}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(sub.value);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                      selectedCategory === sub.value
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-shoply-mutedText hover:bg-neutral-100'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-3 pt-3 border-t border-shoply-border">
              <span className="text-xs font-bold text-shoply-text uppercase tracking-wider block">
                Max Price: {formatPrice(priceRange)}
              </span>
              <input
                type="range"
                min="2000"
                max="70000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
            </div>

            {/* Mobile Brands */}
            <div className="space-y-2 pt-3 border-t border-shoply-border">
              <span className="text-xs font-bold text-shoply-text uppercase tracking-wider block">
                Brands
              </span>
              <div className="space-y-2">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-xs text-shoply-text">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="accent-neutral-900 w-4 h-4 rounded"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-shoply-accent text-white font-semibold text-xs rounded-xl hover:bg-neutral-800 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm text-shoply-mutedText">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

